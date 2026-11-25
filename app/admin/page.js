import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Query from '@/models/Query';
import Appointment from '@/models/Appointment';
import Link from 'next/link';
import TriagePanel from '@/components/TriagePanel';
<<<<<<< HEAD
import UserManagementTable from '@/components/UserManagementTable';
=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
  Activity,
  UserPlus,
  Send,
  HelpCircle,
  TrendingUp,
  BarChart2
=======
  Activity
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
} from 'lucide-react';

export default async function AdminDashboard() {
  await connectDB();

  const [
    studentsCount,
    facultyCount,
    totalQueries,
    pendingQueries,
<<<<<<< HEAD
    assignedQueries,
=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
    unassignedQueries,
    resolvedQueries,
    urgentQueries,
    totalAppointments,
    approvedAppointments,
    pendingAppointments,
    recentQueries,
    facultyList,
    categoryStats,
<<<<<<< HEAD
    facultyWithWorkload,
    allUsersList
=======
    facultyWithWorkload
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'faculty' }),
    Query.countDocuments(),
    Query.countDocuments({ status: { $in: ['Pending', 'Submitted'] } }),
<<<<<<< HEAD
    Query.countDocuments({ status: { $in: ['Assigned', 'In Progress'] } }),
=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
    User.find({ role: 'faculty' }).select('name department courses subjects').lean(),
    User.find({})
      .select('name email role department courses subjects sections registrationNumber semester course createdAt')
      .sort({ createdAt: -1 })
      .limit(35)
      .lean()
=======
    User.find({ role: 'faculty' }).select('name department courses subjects').lean()
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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

<<<<<<< HEAD
  const serializedUsers = allUsersList.map((u) => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department || '',
    courses: u.courses || [],
    subjects: u.subjects || [],
    sections: u.sections || [],
    registrationNumber: u.registrationNumber || '',
    semester: u.semester || null,
    course: u.course || '',
    createdAt: u.createdAt ? u.createdAt.toISOString() : null
  }));

  return (
    <div className="space-y-10 pb-12">
      {/* Command Header */}
      <div className="card p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A99AEF]/15 border border-[#A99AEF]/30 text-[#A99AEF] text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles size={14} className="text-[#A99AEF]" />
            <span>COMMAND · ACADEMIC TRIAGE &amp; GOVERNANCE</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
            Institutional Command Center
          </h1>
          <p className="text-[var(--text-secondary)] text-sm md:text-base font-normal leading-relaxed">
            Monitor real-time communication throughput between students and faculty, oversee intelligent doubt triage, and manage university academic mappings with zero lost inquiries.
          </p>
        </div>

        {/* Prominent Create Account & Faculty Actions */}
        <div className="flex flex-wrap items-center gap-3.5 self-start lg:self-auto">
          <Link
            href="/admin/faculty"
            className="btn btn-primary text-black font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2"
          >
            <UserPlus size={18} className="text-black" />
            <span className="text-black font-bold">+ Create Account</span>
          </Link>

          <Link
            href="/admin/faculty"
            className="btn btn-secondary px-5 py-3.5 font-bold text-xs sm:text-sm flex items-center gap-2"
          >
            <Users size={17} className="text-[#A99AEF]" />
            <span>Faculty Mappings</span>
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          </Link>
        </div>
      </div>

<<<<<<< HEAD
      {/* 6 Core Database-Powered KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">Students</span>
            <div className="p-2 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
              <GraduationCap size={16} />
            </div>
          </div>
          <p className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">{studentsCount}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A99AEF]" />
            <span>Total Enrolled</span>
          </div>
        </div>

        {/* Total Faculty */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">Faculty</span>
            <div className="p-2 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
              <BookOpen size={16} />
            </div>
          </div>
          <p className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">{facultyCount}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A99AEF]" />
            <span>Active Instructors</span>
          </div>
        </div>

        {/* Total Queries */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Doubts</span>
            <div className="p-2 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
              <Inbox size={16} />
            </div>
          </div>
          <p className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">{totalQueries}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A99AEF]" />
            <span>All Submissions</span>
          </div>
        </div>

        {/* Pending Queries */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">Pending</span>
            <div className="p-2 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
              <Clock size={16} />
            </div>
          </div>
          <p className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">{pendingQueries}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A99AEF]" />
            <span>Awaiting Action</span>
          </div>
        </div>

        {/* Assigned Queries */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">Assigned</span>
            <div className="p-2 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
              <Activity size={16} />
            </div>
          </div>
          <p className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">{assignedQueries}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A99AEF]" />
            <span>In Faculty Queue</span>
          </div>
        </div>

        {/* Answered Queries */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">Answered</span>
            <div className="p-2 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="font-heading text-3xl md:text-4xl font-extrabold text-[#A99AEF]">{resolvedQueries}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A99AEF]" />
            <span>Resolved Queries</span>
          </div>
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
        </div>
      </div>

      {/* Two Column Layout: Faculty Workload & Category Breakdown */}
<<<<<<< HEAD
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Faculty Workload Overview (7 cols) */}
        <div className="lg:col-span-7 card p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Faculty Workload Balance</h2>
                <p className="text-xs text-[var(--text-secondary)]">Live active doubts routed to assigned instructors</p>
              </div>
            </div>
            <Link
              href="/admin/faculty"
              className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <span>Manage Subjects</span>
              <ArrowRight size={13} className="text-[#A99AEF]" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-elevated)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-card)] text-[var(--text-secondary)] uppercase tracking-wider font-bold text-[10px] bg-[var(--bg-card)]">
                  <th className="py-3 px-3.5">Faculty Member</th>
                  <th className="py-3 px-3.5">Department</th>
                  <th className="py-3 px-3.5">Subjects Taught</th>
                  <th className="py-3 px-3.5 text-right">Active Queue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-card)]">
                {facultyWorkloads.length > 0 ? (
                  facultyWorkloads.map((fac) => (
                    <tr key={fac._id} className="hover:bg-[var(--bg-card)] transition-colors">
                      <td className="py-3 px-3.5 font-bold text-[var(--text-primary)] whitespace-nowrap">{fac.name}</td>
                      <td className="py-3 px-3.5 text-[var(--text-secondary)] font-mono text-[11px]">{fac.department}</td>
                      <td className="py-3 px-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {fac.subjects.slice(0, 2).map((sub) => (
                            <span
                              key={sub}
                              className="px-2 py-0.5 rounded-full bg-[var(--bg-main)] border border-[var(--border-card)] text-[10px] text-[var(--text-secondary)] font-mono"
                            >
                              {sub}
                            </span>
                          ))}
                          {fac.subjects.length > 2 && (
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">+{fac.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <span
                          className="font-mono font-bold px-2.5 py-1 rounded-full text-[11px] bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30"
                        >
                          {fac.openQueries} Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[var(--text-secondary)]">
                      No faculty members registered yet.
                    </td>
                  </tr>
                )}
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
              </tbody>
            </table>
          </div>
        </div>

<<<<<<< HEAD
        {/* Queries by Category (5 cols) */}
        <div className="lg:col-span-5 card p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF]">
                <BarChart2 size={18} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Queries by Category</h2>
                <p className="text-xs text-[var(--text-secondary)]">Campus submission breakdown</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-card)]">
              {totalQueries} TOTAL
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {categoryStats.length > 0 ? (
              categoryStats.map((item) => {
                const percentage = totalQueries > 0 ? Math.round((item.count / totalQueries) * 100) : 0;

                return (
                  <div key={item._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[var(--text-primary)]">{item._id || 'Uncategorized'}</span>
                      <span className="font-mono text-[var(--text-secondary)]">{item.count} doubts ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden border border-[var(--border-card)]">
                      <div
                        className="h-full rounded-full bg-[#A99AEF] transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 6)}%` }}
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      />
                    </div>
                  </div>
                );
              })
            ) : (
<<<<<<< HEAD
              <p className="text-xs text-[var(--text-secondary)] py-8 text-center">No queries submitted yet.</p>
=======
              <p className="text-xs text-slate-400 py-4 text-center">No queries submitted yet.</p>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            )}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* User Management Section */}
      <UserManagementTable users={serializedUsers} />

      {/* Query Monitoring & Triage Panel Component */}
=======
      {/* Main Triage & Routing Panel Component */}
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
      <TriagePanel queries={rows} faculty={facultyOptions} />
    </div>
  );
}
