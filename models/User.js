import mongoose from 'mongoose';

// One collection for all roles. Student-only fields (registrationNumber, course, semester) and
// faculty-only fields (department, courses, subjects, availability) are simply left empty for other roles.
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  // Student profile
  registrationNumber: { type: String, unique: true, sparse: true },
  course: { type: String, trim: true, default: '' },
  semester: { type: Number, min: 1, max: 12 },
  section: { type: String, trim: true, default: '' },
  // Faculty profile
  department: { type: String, default: 'CSE' },
  courses: [{ type: String, trim: true }],
  subjects: [{ type: String }],
  sections: [{ type: String, trim: true }],
  availability: [{ day: String, start: String, end: String }],
}, { timestamps: true, strict: false });

if (mongoose.models && mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model('User', UserSchema);
