import mongoose from 'mongoose';

const QuerySchema = new mongoose.Schema({
  referenceId: { type: String, trim: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  course: { type: String, required: true, trim: true },
  section: { type: String, trim: true, default: '' },
  subject: { type: String, required: true, trim: true },
  semester: { type: Number, min: 1, max: 12 },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: [
      'Academic Doubt',
      'Assignment',
      'Examination',
      'Attendance',
      'Course Material',
      'Administrative Request',
      'Administrative',
      'Other'
    ],
    default: 'Academic Doubt'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'Normal', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Assigned', 'In Progress', 'Answered', 'Resolved', 'Closed', 'Cancelled'],
    default: 'Pending'
  },
  response: { type: String, default: '' },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  respondedAt: { type: Date },
  appointmentRequested: { type: Boolean, default: false },
  attachment: {
    name: { type: String, default: '' },
    url: { type: String, default: '' }
  }
}, { timestamps: true, strict: false });

QuerySchema.pre('save', function (next) {
  if (!this.referenceId) {
    const hex = this._id ? this._id.toString().slice(-6).toUpperCase() : Math.random().toString(36).slice(2, 8).toUpperCase();
    this.referenceId = `QRY-${hex}`;
  }
  next();
});

QuerySchema.index({ faculty: 1, createdAt: -1 });
QuerySchema.index({ student: 1, createdAt: -1 });

if (mongoose.models && mongoose.models.Query) {
  delete mongoose.models.Query;
}

export default mongoose.model('Query', QuerySchema);
