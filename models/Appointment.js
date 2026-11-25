import mongoose from 'mongoose';
const AppointmentSchema=new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  faculty:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  query:{type:mongoose.Schema.Types.ObjectId,ref:'Query',default:null},
  date:{type:Date,required:true},
  time:{type:String,required:true},
  reason:{type:String,required:true},
  meetingType:{type:String,enum:['In-person','Phone call','Virtual meeting'],default:'In-person'},
  meetingLocation:{type:String,default:''},
  status:{type:String,enum:['Pending','Approved','Rejected','Rescheduled','Cancelled','Completed'],default:'Pending'},
  note:{type:String,default:''},
  initiatedBy:{type:String,enum:['student','faculty'],default:'student'},
  rescheduledFrom:{date:Date,time:String}
},{timestamps:true, strict:false});
AppointmentSchema.index({faculty:1,status:1,date:1});
AppointmentSchema.index({student:1,createdAt:-1});

if (mongoose.models && mongoose.models.Appointment) {
  delete mongoose.models.Appointment;
}

export default mongoose.model('Appointment',AppointmentSchema);
