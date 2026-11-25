import {NextResponse} from 'next/server';
import {connectDB} from '@/lib/db';
import {requireUser} from '@/lib/auth';
import Appointment from '@/models/Appointment';
import Query from '@/models/Query';
import User from '@/models/User';
import {validateAppointmentInput,validateSlot,checkAvailability,isObjectId} from '@/lib/validators';

const populate = (q) =>
  q
    .populate('student', 'name email registrationNumber')
    .populate('faculty', 'name email department subjects')
    .populate('query', 'title');
const asDate=d=>new Date(`${d}T00:00:00.000Z`);

// A slot is taken once the faculty member has an Approved/Rescheduled appointment at that date and time.
const slotTaken=(facultyId,date,time,exceptId)=>Appointment.findOne({faculty:facultyId,date:asDate(date),time,status:{$in:['Approved','Rescheduled']},...(exceptId?{_id:{$ne:exceptId}}:{})}).select('_id');

// Student: request an appointment (saved Pending, linked to the session student and the chosen faculty member).
// Faculty: schedule a consultation for a student who asked a query assigned to them -> {queryId,date,time,note?};
//          it is saved as Approved and appears in that student's portal.
export async function POST(req){
  const {user,error}=await requireUser(['student','faculty']);
  if(error)return error;
  try{
    let raw;
    try{raw=await req.json()}catch{return NextResponse.json({message:'Invalid request body'},{status:400})}
    await connectDB();

    if(user.role==='faculty'){
      const queryId=typeof raw?.queryId==='string'?raw.queryId.trim():'';
      if(!isObjectId(queryId))return NextResponse.json({message:'A valid queryId is required to schedule a consultation'},{status:400});
      const slot=validateSlot({date:raw?.date,time:raw?.time});
      if(slot.error)return NextResponse.json({message:slot.error},{status:400});
      const q=await Query.findOne({_id:queryId,faculty:user.id});
      if(!q)return NextResponse.json({message:'Query not found or not assigned to you'},{status:404});
      if(await slotTaken(user.id,slot.value.date,slot.value.time))return NextResponse.json({message:'You already have an appointment at that date and time'},{status:409});
      const note=typeof raw?.note==='string'?raw.note.trim().slice(0,500):'';
      const meetingType = typeof raw?.meetingType === 'string' && ['In-person', 'Phone call', 'Virtual meeting'].includes(raw.meetingType) ? raw.meetingType : 'In-person';
      const meetingLocation = typeof raw?.meetingLocation === 'string' ? raw.meetingLocation.trim().slice(0, 200) : '';
      const ap=await Appointment.create({student:q.student,faculty:user.id,query:q._id,date:asDate(slot.value.date),time:slot.value.time,reason:`Consultation: ${q.title}`.slice(0,200),meetingType,meetingLocation,note,initiatedBy:'faculty',status:'Approved'});
      q.appointmentRequested=true;
      if(['Pending','Submitted','Assigned'].includes(q.status))q.status='In Progress';
      await q.save();
      return NextResponse.json({appointment:await populate(Appointment.findById(ap._id)).lean()},{status:201});
    }

    const {value,error:invalid}=validateAppointmentInput(raw);
    if(invalid)return NextResponse.json({message:invalid},{status:400});
    const faculty=await User.findOne({_id:value.facultyId,role:'faculty'}).select('_id name availability');
    if(!faculty)return NextResponse.json({message:'Faculty not found'},{status:404});
    const avail=checkAvailability(faculty.availability||[],value.date,value.time);
    if(!avail.ok)return NextResponse.json({message:avail.message},{status:400});
    if(await slotTaken(faculty._id,value.date,value.time))return NextResponse.json({message:'That slot is already booked. Please choose another time.'},{status:409});
    let linked=null;
    if(value.queryId){
      linked=await Query.findOne({_id:value.queryId,student:user.id});
      if(!linked)return NextResponse.json({message:'Linked query not found'},{status:404});
      if(!linked.faculty)return NextResponse.json({message:'This query has no faculty assigned yet. Request an appointment without linking the query, or wait for an assignment.'},{status:400});
      if(linked.faculty.toString()!==faculty._id.toString())return NextResponse.json({message:'That query is assigned to a different faculty member. Choose the assigned faculty or clear the related query.'},{status:400});
    }
    const ap=await Appointment.create({student:user.id,faculty:faculty._id,query:value.queryId,date:asDate(value.date),time:value.time,reason:value.reason,meetingType:value.meetingType,meetingLocation:value.meetingLocation,status:'Pending',initiatedBy:'student'});
    if(linked){linked.appointmentRequested=true;await linked.save()}
    return NextResponse.json({appointment:await populate(Appointment.findById(ap._id)).lean()},{status:201})
  }catch(e){return NextResponse.json({message:e.message},{status:400})}
}

// Students see their own requests; faculty see only appointments assigned to them; admins see all.
export async function GET(){
  const {user,error}=await requireUser(['student','faculty','admin']);
  if(error)return error;
  try{
    await connectDB();
    const filter=user.role==='student'?{student:user.id}:user.role==='faculty'?{faculty:user.id}:{};
    const appointments=await populate(Appointment.find(filter)).sort({createdAt:-1}).lean();
    return NextResponse.json({appointments})
  }catch(e){return NextResponse.json({message:e.message},{status:500})}
}
