import {NextResponse} from 'next/server';
import {connectDB} from '@/lib/db';
import {requireUser} from '@/lib/auth';
import User from '@/models/User';
import {validateAvailability} from '@/lib/validators';

export async function GET(){
  const {user,error}=await requireUser(['student','faculty','admin']);
  if(error)return error;
  try{
    await connectDB();
    const rows=await User.find({role:'faculty'}).select('name email department courses subjects availability').lean();
    const faculty=rows.map(f=>({...f,isMe:String(f._id)===user.id}));
    return NextResponse.json({faculty})
  }catch(e){return NextResponse.json({message:e.message},{status:500})}
}

// Module 3 – a faculty member manages their own office hours: {availability:[{day,start,end}]}.
export async function PATCH(req){
  const {user,error}=await requireUser(['faculty']);
  if(error)return error;
  try{
    let body;try{body=await req.json()}catch{return NextResponse.json({message:'Invalid request body'},{status:400})}
    const {value,error:invalid}=validateAvailability(body?.availability);
    if(invalid)return NextResponse.json({message:invalid},{status:400});
    await connectDB();
    const me=await User.findById(user.id);
    me.availability=value;
    await me.save();
    return NextResponse.json({availability:value})
  }catch(e){return NextResponse.json({message:e.message},{status:400})}
}
