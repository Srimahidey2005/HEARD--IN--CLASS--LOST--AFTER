import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Query from '@/models/Query';
import Appointment from '@/models/Appointment';
import Link from 'next/link';
import TriagePanel from '@/components/TriagePanel';
import {
  Users,
  GraduationCap,
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default async function AdminDashboard() {
  await connectDB();

  const [
    studentsCount,
    facultyCount,
    totalQueries,
    pendingQueries,
    unassignedQueries,
    resolvedQueries,
    urgentQueries,
    totalAppointments,
    approvedAppointments,
    pendingAppointments,
    recentQueries,
    facultyList,
    categoryStats,
    facultyWithWorkload
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'faculty' }),
    Query.countDocuments(),
    Query.countDocuments({ status: { $in: ['Pending', 'Submitted'] } }),
    Query.countDocuments({ faculty: null }),
    Query.countDocuments({ status: { $in: ['Answered', 'Resolved', 'Closed'] } }),
    Query.countDocuments({ priority: 'Urgent', status: { $in: ['Pending', 'Assigned', 'In Progress'] } }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'Approved' }),
    Appointment.countDocuments({ status: 'Pending' }),
    Query.find({})
      .populate('student', 'name email registrationNumber course semester')
      .populate('faculty', 'name email department subjects')
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),
    User.find({ role: 'faculty' }).select('name email subjects department courses').sort({ name: 1 }).lean(),
    Query.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    User.find({ role: 'faculty' }).select('name department courses subjects').lean()
  ]);

  // Compute live open workload for each faculty member
  const facultyWorkloads = await Promise.all(
    facultyWithWorkload.map(async (f) => ({
      _id: f._id.toString(),
      name: f.name,
      department: f.department || 'CSE',
      subjects: f.subjects || [],
      courses: f.courses || [],
      openQueries: await Query.countDocuments({
        faculty: f._id,
        status: { $in: ['Assigned', 'In Progress'] }
      }),
      resolvedQueries: await Query.countDocuments({
        faculty: f._id,
        status: { $in: ['Answered', 'Resolved', 'Closed'] }
      })
    }))
  );

  const rows = recentQueries.map((q) => ({
    _id: q._id.toString(),
    referenceId: q.referenceId || `QRY-${q._id.toString().slice(-6).toUpperCase()}`,
    title: q.title,
    subject: q.subject,
    course: q.course,
    semester: q.semester || null,
    status: q.status,
    category: q.category,
    priority: q.priority || 'Medium',
    studentName: q.student?.name || 'Student',
    facultyId: q.faculty?._id?.toString() || '',
    facultyName: q.faculty?.name || '',
    createdAt: q.createdAt ? q.createdAt.toISOString() : null
  }));

  const facultyOptions = facultyList.map((f) => ({
    _id: f._id.toString(),
    name: f.name,
    subjects: f.subjects || []
  }));

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#131b31] to-cyan-950/30 border border-white/10 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-400 font-bold mb-1">
            <Sparkles size={14} />
            Module 3 · Triage &amp; Academic Administration
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm max-w-2xl">
            Monitor real-time communication flows between students and faculty, oversee query categorization, and manage academic subject mappings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/faculty"
            className="btn btn-lime shadow-glow-lime px-5 py-2.5 font-bold flex items-center gap-2"
          >
            <Users size={16} className="text-midnight" />
            <span>Manage Faculty &amp; Mappings</span>
          </Link>
        </div>
      </div>

      {/* 6 High-Level Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="card p-4 border-l-4 border-l-cyan-400">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Students</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-white mt-1">{studentsCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Enrolled</p>
        </div>

        <div className="card p-4 border-l-4 border-l-violet-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Faculty</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-white mt-1">{facultyCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Subject mapped</p>
        </div>

        <div className="card p-4 border-l-4 border-l-indigo-400">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Queries</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-indigo-300 mt-1">{totalQueries}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">All modules</p>
        </div>

        <div className="card p-4 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Unassigned</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">{unassignedQueries}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting routing</p>
        </div>

        <div className="card p-4 border-l-4 border-l-rose-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Urgent Queries</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-rose-400 mt-1">{urgentQueries}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">High priority</p>
        </div>

        <div className="card p-4 border-l-4 border-l-lime-400">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Appointments</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-lime-400 mt-1">{totalAppointments}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{approvedAppointments} Approved</p>
        </div>
      </div>

      {/* Two Column Layout: Faculty Workload & Category Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Faculty Workload Overview (7 cols) */}
        <div className="lg:col-span-7 card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              <h2 className="font-heading font-bold text-lg text-white">Faculty Workload &amp; Subjects</h2>
            </div>
            <Link
              href="/admin/faculty"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Manage Subjects</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Faculty Member</th>
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 font-semibold">Subjects Taught</th>
                  <th className="pb-3 font-semibold text-right">Active Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {facultyWorkloads.map((fac) => (
                  <tr key={fac._id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-medium text-white">{fac.name}</td>
                    <td className="py-3 text-slate-400">{fac.department}</td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        {fac.subjects.slice(0, 3).map((sub) => (
                          <span
                            key={sub}
                            className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-cyan-300 font-mono"
                          >
                            {sub}
                          </span>
                        ))}
                        {fac.subjects.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{fac.subjects.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          fac.openQueries > 3
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-lime-500/20 text-lime-300'
                        }`}
                      >
                        {fac.openQueries} Open
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories Distribution Breakdown (5 cols) */}
        <div className="lg:col-span-5 card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-violet-400" />
              <h2 className="font-heading font-bold text-lg text-white">Queries by Category</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">{totalQueries} TOTAL</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {categoryStats.length > 0 ? (
              categoryStats.map((item) => {
                const percentage = totalQueries > 0 ? Math.round((item.count / totalQueries) * 100) : 0;
                return (
                  <div key={item._id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">{item._id || 'Uncategorized'}</span>
                      <span className="font-mono text-slate-400">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-sm transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No queries submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Triage & Routing Panel Component */}
      <TriagePanel queries={rows} faculty={facultyOptions} />
    </div>
  );
}
