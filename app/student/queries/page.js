import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Query from '@/models/Query';
import Appointment from '@/models/Appointment';
import StudentQueriesView from '@/components/StudentQueriesView';
import { Sparkles, MessageSquare } from 'lucide-react';

export default async function StudentQueriesPage() {
  await connectDB();
  const u = await getCurrentUser();

  const [rawQueries, rawAppointments] = await Promise.all([
    Query.find({ student: u.id })
      .populate('faculty', 'name email department courses subjects')
      .populate('answeredBy', 'name email')
      .sort({ createdAt: -1 })
      .lean(),
    Appointment.find({ student: u.id })
      .populate('faculty', 'name email')
      .populate('query', 'title referenceId')
      .sort({ date: 1, time: 1 })
      .lean()
  ]);

  // JSON serialization safe for Next.js Server Components passing to Client Components
  const queries = rawQueries.map((q) => ({
    _id: q._id.toString(),
    referenceId: q.referenceId || `QRY-${q._id.toString().slice(-6).toUpperCase()}`,
    title: q.title,
    description: q.description,
    course: q.course,
    section: q.section || '',
    semester: q.semester || null,
    subject: q.subject,
    category: q.category,
    priority: q.priority,
    status: q.status,
    response: q.response || '',
    respondedAt: q.respondedAt ? q.respondedAt.toISOString() : null,
    answeredBy: q.answeredBy ? { name: q.answeredBy.name } : null,
    faculty: q.faculty ? {
      _id: q.faculty._id.toString(),
      name: q.faculty.name,
      department: q.faculty.department || ''
    } : null,
    attachment: q.attachment ? {
      name: q.attachment.name || '',
      url: q.attachment.url || ''
    } : null,
    createdAt: q.createdAt ? q.createdAt.toISOString() : null
  }));

  const appointments = rawAppointments.map((a) => ({
    _id: a._id.toString(),
    query: a.query ? {
      _id: a.query._id ? a.query._id.toString() : a.query.toString(),
      title: a.query.title || ''
    } : null,
    faculty: a.faculty ? {
      _id: a.faculty._id ? a.faculty._id.toString() : a.faculty.toString(),
      name: a.faculty.name || 'Faculty Member'
    } : null,
    date: a.date ? a.date.toISOString() : null,
    time: a.time,
    reason: a.reason,
    status: a.status,
    note: a.note || '',
    initiatedBy: a.initiatedBy || 'student'
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
          <Sparkles size={14} />
          Student Query Tracking
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          My Academic Queries
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          Monitor your submitted doubts in real time, view assigned faculty, read detailed faculty explanations, and request follow-up office hours.
        </p>
      </div>

      <StudentQueriesView
        initialQueries={queries}
        initialAppointments={appointments}
      />
    </div>
  );
}
