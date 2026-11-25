import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Query from '@/models/Query';
import Appointment from '@/models/Appointment';
import { formatDate } from '@/lib/dataService';
import { PRIORITY_RANK } from '@/lib/validators';
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FacultyDashboard() {
  await connectDB();
  const u = await getCurrentUser();

  const [
    totalAssigned,
    pendingQueries,
    urgentQueries,
    inProgressQueries,
    answeredQueries,
    pendingAppointments,
    recentQueriesList,
    upcomingAppointmentsList
  ] = await Promise.all([
    Query.countDocuments({ faculty: u.id }),
    Query.countDocuments({ faculty: u.id, status: { $in: ['Assigned', 'Pending', 'Submitted'] } }),
    Query.countDocuments({ faculty: u.id, priority: 'Urgent', status: { $in: ['Assigned', 'In Progress'] } }),
    Query.countDocuments({ faculty: u.id, status: 'In Progress' }),
    Query.countDocuments({ faculty: u.id, status: { $in: ['Answered', 'Resolved', 'Closed'] } }),
    Appointment.countDocuments({ faculty: u.id, status: 'Pending' }),
    Query.find({ faculty: u.id })
      .populate('student', 'name email registrationNumber course semester')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    Appointment.find({ faculty: u.id, status: { $in: ['Pending', 'Approved', 'Rescheduled'] } })
      .populate('student', 'name email registrationNumber')
      .populate('query', 'title referenceId')
      .sort({ date: 1, time: 1 })
      .limit(4)
      .lean()
  ]);

  const getStatusPillClass = (status) => {
    switch (status) {
      case 'Pending':
      case 'Submitted':
        return 'pill-pending';
      case 'Assigned':
        return 'pill-assigned';
      case 'In Progress':
        return 'pill-progress';
      case 'Answered':
      case 'Resolved':
      case 'Approved':
      case 'Completed':
        return 'pill-answered';
      case 'Rejected':
      case 'Cancelled':
      case 'Closed':
        return 'pill-rejected';
      default:
        return 'pill-medium';
    }
  };

  const getPriorityPillClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'pill-urgent';
      case 'High':
        return 'pill-high';
      case 'Medium':
      case 'Normal':
        return 'pill-medium';
      default:
        return 'pill-low';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner with Profile Summary */}
      <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A99AEF] font-bold mb-1">
            <Sparkles size={14} />
            Faculty Instruction Workspace · Dept of {u.department || 'Computer Science'}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Professor {u.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap mt-2 text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-secondary)]">Teaching Subjects:</span>
            {u.subjects?.length ? (
              u.subjects.map((sub) => (
                <span key={sub} className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[#A99AEF] font-mono text-[11px]">
                  {sub}
                </span>
              ))
            ) : (
              <span className="text-[#A99AEF] italic">No subject mappings assigned yet</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/faculty/queries"
            className="btn btn-primary px-5 py-2.5 font-bold text-black"
          >
            Review Inbox ({pendingQueries + inProgressQueries})
          </Link>
          <Link
            href="/faculty/appointments"
            className="btn btn-secondary px-4 py-2.5"
          >
            <Calendar size={16} className="text-[#A99AEF]" />
            <span>Office Hours</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Total Assigned</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mt-1">{totalAssigned}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">All time</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Awaiting Reply</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-[#A99AEF] mt-1">{pendingQueries}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Newly routed</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Urgent Doubts</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-rose-500 mt-1">{urgentQueries}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">High priority</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">In Progress</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mt-1">{inProgressQueries}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Under drafting</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Resolved</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-[#A99AEF] mt-1">{answeredQueries}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Answered</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Pending Appts</p>
          <p className="font-heading text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mt-1">{pendingAppointments}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Requests to confirm</p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Priority Inbox (2 Cols) */}
        <div className="lg:col-span-2 card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <Inbox size={18} className="text-[#A99AEF]" />
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Priority Student Queries</h2>
            </div>
            <Link
              href="/faculty/queries"
              className="text-xs font-semibold text-[#A99AEF] hover:text-[#C6B9FF] flex items-center gap-1"
            >
              <span>Manage all ({totalAssigned})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentQueriesList.length > 0 ? (
              recentQueriesList.map((q) => {
                const refCode = q.referenceId || `#QRY-${q._id.toString().slice(-6).toUpperCase()}`;
                return (
                  <div
                    key={q._id.toString()}
                    className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#A99AEF]">{refCode}</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{q.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`pill ${getPriorityPillClass(q.priority)}`}>{q.priority}</span>
                        <span className={`pill ${getStatusPillClass(q.status)}`}>{q.status}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)]">
                      From: <strong className="text-[var(--text-primary)]">{q.student?.name}</strong>
                      {q.student?.registrationNumber ? ` (${q.student.registrationNumber})` : ''} ·{' '}
                      <span className="text-[#A99AEF]">{q.subject}</span> · {q.course}{q.section ? ` · Sec ${q.section}` : ''}
                    </p>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {q.description}
                    </p>

                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-[var(--text-secondary)] font-mono text-[11px]">
                        Received: {formatDate(q.createdAt)}
                      </span>
                      <Link
                        href={`/faculty/queries`}
                        className="text-[#A99AEF] hover:underline font-semibold"
                      >
                        {q.response ? 'Update response →' : 'Write response →'}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-[var(--text-secondary)] space-y-2">
                <Inbox size={32} className="mx-auto text-[var(--text-secondary)]" />
                <p className="text-sm">No queries currently assigned to you.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Appointments Column (1 Col) */}
        <div className="card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-[#A99AEF]" />
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Student Consultations</h2>
            </div>
            <Link
              href="/faculty/appointments"
              className="text-xs font-semibold text-[#A99AEF] hover:text-[#C6B9FF] flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingAppointmentsList.length > 0 ? (
              upcomingAppointmentsList.map((a) => (
                <div
                  key={a._id.toString()}
                  className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[150px]">
                      {a.reason}
                    </span>
                    <span className={`pill ${getStatusPillClass(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Student: <strong className="text-[var(--text-primary)]">{a.student?.name}</strong>
                  </p>
                  <p className="text-[11px] font-mono text-[#A99AEF]">
                    📅 {formatDate(a.date)} · ⏰ {a.time}
                  </p>
                  <Link
                    href="/faculty/appointments"
                    className="text-xs text-[#A99AEF] hover:underline font-semibold block pt-1"
                  >
                    Review request →
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[var(--text-secondary)] space-y-2">
                <Calendar size={28} className="mx-auto text-[var(--text-secondary)]" />
                <p className="text-xs">No pending student appointments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
