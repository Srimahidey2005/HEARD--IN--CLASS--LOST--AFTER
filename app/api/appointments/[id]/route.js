import {NextResponse} from 'next/server';
import {connectDB} from '@/lib/db';
import {requireUser} from '@/lib/auth';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import {isObjectId,validateSlot,checkAvailability} from '@/lib/validators';

// Which current statuses each action may start from.
const ALLOWED_FROM={
  Approved:['Pending'],
  Rejected:['Pending','Approved','Rescheduled'],
  Rescheduled:['Pending','Approved','Rescheduled'],
  Completed:['Approved','Rescheduled'],
  Cancelled:['Pending','Approved','Rescheduled']
};
const asDate=d=>new Date(`${d}T00:00:00.000Z`);
const populate = (q) =>
  q
    .populate('student', 'name email registrationNumber')
    .populate('faculty', 'name email department subjects')
    .populate('query', 'title');

// Faculty (owner of the appointment) or admin: approve, reject, reschedule or complete.
// Reschedule body: {status:'Rescheduled', date:'YYYY-MM-DD', time:'HH:MM', note?}
// Student (owner): may only cancel their own appointment ({status:'Cancelled'}).
export async function PATCH(req,{params}){
  const {user,error}=await requireUser(['student','faculty','admin']);
  if(error)return error;
  try{
    const {id}=await params;
    if(!isObjectId(id))return NextResponse.json({message:'Invalid appointment id'},{status:400});
    let body;
    try{body=await req.json()}catch{return NextResponse.json({message:'Invalid request body'},{status:400})}
    const {status,date,time}=body||{};
    const note=typeof body?.note==='string'?body.note.trim().slice(0,500):'';
    if(!ALLOWED_FROM[status])return NextResponse.json({message:'Invalid appointment status'},{status:400});
    await connectDB();
    const ap=await Appointment.findById(id);
    if(!ap)return NextResponse.json({message:'Appointment not found'},{status:404});
    if(user.role==='student'){
      if(ap.student.toString()!==user.id)return NextResponse.json({message:'Not your appointment'},{status:403});
      if(status!=='Cancelled')return NextResponse.json({message:'Students can only cancel their own appointments'},{status:403});
    }else{
      if(status==='Cancelled')return NextResponse.json({message:'Only the student can cancel an appointment'},{status:403});
      if(user.role==='faculty'&&ap.faculty.toString()!==user.id)return NextResponse.json({message:'Not your appointment'},{status:403});
    }
    if(!ALLOWED_FROM[status].includes(ap.status))return NextResponse.json({message:`A ${ap.status.toLowerCase()} appointment cannot be marked ${status.toLowerCase()}`},{status:409});

    let slotDate=ap.date,slotTime=ap.time;
    if(status==='Rescheduled'){
      const slot=validateSlot({date,time});
      if(slot.error)return NextResponse.json({message:slot.error},{status:400});
      slotDate=asDate(slot.value.date);slotTime=slot.value.time;
    }
    if(status==='Approved'||status==='Rescheduled'){
      const checkedSlot=validateSlot({date:status==='Rescheduled'?date:ap.date.toISOString().slice(0,10),time:status==='Rescheduled'?time:ap.time});
      if(checkedSlot.error)return NextResponse.json({message:checkedSlot.error},{status:400});
      const faculty=await User.findOne({_id:ap.faculty,role:'faculty'}).select('availability');
      if(!faculty)return NextResponse.json({message:'Faculty not found'},{status:404});
      const availability=checkAvailability(faculty.availability||[],status==='Rescheduled'?date:ap.date.toISOString().slice(0,10),status==='Rescheduled'?time:ap.time);
      if(!availability.ok)return NextResponse.json({message:availability.message},{status:400});
      const clash=await Appointment.findOne({faculty:ap.faculty,date:slotDate,time:slotTime,status:{$in:['Approved','Rescheduled']},_id:{$ne:ap._id}}).select('_id');
      if(clash)return NextResponse.json({message:'You already have an approved appointment at that date and time'},{status:409});
    }
    if(status==='Rescheduled'){
      if(!ap.rescheduledFrom?.date)ap.rescheduledFrom={date:ap.date,time:ap.time};
      ap.date=slotDate;ap.time=slotTime;
    }
    ap.status=status;
    // Keep the saved note unless a new one is sent; a reject/reschedule without a note clears the stale one.
    if(note||['Rejected','Rescheduled'].includes(status))ap.note=note;
    await ap.save();
    return NextResponse.json({appointment:await populate(Appointment.findById(ap._id)).lean()})
  }catch(e){return NextResponse.json({message:e.message},{status:400})}
}

export async function GET(req, { params }) {
  const { user, error } = await requireUser(['student', 'faculty', 'admin']);
  if (error) return error;
  try {
    const { id } = await params;
    if (!isObjectId(id)) return NextResponse.json({ message: 'Invalid appointment id' }, { status: 400 });
    await connectDB();
    const ap = await populate(Appointment.findById(id)).lean();
    if (!ap) return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    if (user.role === 'student' && ap.student?._id?.toString() !== user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
    if (user.role === 'faculty' && ap.faculty?._id?.toString() !== user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
    return NextResponse.json({ appointment: ap });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
