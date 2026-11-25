import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Query from '@/models/Query';
import Appointment from '@/models/Appointment';
import mongoose from 'mongoose';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Inbox,
  UserCheck,
  AlertCircle,
  MapPin,
  Phone,
  Video
} from 'lucide-react';
import { formatDate } from '@/lib/dataService';
import { formatTime12 } from '@/lib/timetable';

export default async function StudentHome() {
  await connectDB();
  const u = await getCurrentUser();

  const userObjectId = mongoose.Types.ObjectId.createFromHexString(u.id);

  // Queries summary
  const [recentQueries, counts, upcomingAppointments, totalAppointments] = await Promise.all([
    Query.find({ student: u.id })
      .populate('faculty', 'name department')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    Query.aggregate([
      { $match: { student: userObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Appointment.find({
      student: u.id,
      status: { $in: ['Pending', 'Approved', 'Rescheduled'] }
    })
      .populate('faculty', 'name department')
      .populate('query', 'title referenceId')
      .sort({ date: 1, time: 1 })
      .limit(4)
      .lean(),
    Appointment.countDocuments({ student: u.id })
  ]);

  const countMap = counts.reduce((acc, x) => {
    acc[x._id] = x.count;
    return acc;
  }, {});

  const total = counts.reduce((a, x) => a + x.count, 0);
  const pendingCount = (countMap['Pending'] || 0) + (countMap['Submitted'] || 0);
  const inProgressCount = (countMap['Assigned'] || 0) + (countMap['In Progress'] || 0);
  const answeredCount = (countMap['Answered'] || 0) + (countMap['Resolved'] || 0) + (countMap['Closed'] || 0);

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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
<<<<<<< HEAD
      <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A99AEF] font-bold mb-1">
            <Sparkles size={14} />
            Student Workspace · {u.course || 'Academic Track'}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Welcome back, {u.name.split(' ')[0]} 👋
          </h1>
          <p className="text-[var(--text-secondary)] mt-1.5 text-sm">
=======
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#131b31] to-cyan-950/30 border border-white/10 shadow-card">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
            <Sparkles size={14} />
            Student Workspace · {u.course || 'Academic Track'}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {u.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            Track your submitted doubts, faculty replies, and scheduled academic consultations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/student/submit-query"
<<<<<<< HEAD
            className="btn btn-primary px-5 py-2.5 font-bold text-black"
=======
            className="btn btn-lime shadow-glow-lime px-5 py-2.5 font-bold"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          >
            + Ask a Doubt
          </Link>
          <Link
            href="/student/appointments"
            className="btn btn-secondary px-4 py-2.5"
          >
<<<<<<< HEAD
            <Calendar size={16} className="text-[#A99AEF]" />
=======
            <Calendar size={16} />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            <span>Appointments</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
<<<<<<< HEAD
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Queries</span>
            <Inbox size={18} className="text-[#A99AEF]" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-[var(--text-primary)]">{total}</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Submitted questions</p>
        </div>

        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending / Routing</span>
            <Clock size={18} className="text-[#A99AEF]" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-[var(--text-primary)]">{pendingCount}</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Awaiting triage &amp; faculty</p>
        </div>

        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">With Faculty</span>
            <UserCheck size={18} className="text-[#A99AEF]" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-[var(--text-primary)]">{inProgressCount}</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Under review</p>
        </div>

        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Answered Doubts</span>
            <CheckCircle2 size={18} className="text-[#A99AEF]" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-[#A99AEF]">{answeredCount}</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Resolved with faculty notes</p>
=======
        <div className="card p-5 border-l-4 border-l-violet-500">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Queries</span>
            <Inbox size={18} className="text-violet-400" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-white">{total}</p>
          <p className="text-[11px] text-slate-400 mt-1">Submitted questions</p>
        </div>

        <div className="card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending / Routing</span>
            <Clock size={18} className="text-amber-400" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-white">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting triage &amp; faculty</p>
        </div>

        <div className="card p-5 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">With Faculty</span>
            <UserCheck size={18} className="text-cyan-400" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-white">{inProgressCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Under review</p>
        </div>

        <div className="card p-5 border-l-4 border-l-lime-400">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Answered Doubts</span>
            <CheckCircle2 size={18} className="text-lime-400" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-white">{answeredCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Resolved with faculty notes</p>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
        </div>
      </div>

      {/* Two Column Layout: Upcoming Appointments & Recent Queries */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recent Queries */}
        <div className="lg:col-span-2 card p-6 md:p-7 space-y-4">
<<<<<<< HEAD
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={18} className="text-[#A99AEF]" />
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Recent Doubts &amp; Queries</h2>
            </div>
            <Link
              href="/student/queries"
              className="text-xs font-semibold text-[#A99AEF] hover:text-[#C6B9FF] flex items-center gap-1"
=======
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={18} className="text-cyan-400" />
              <h2 className="font-heading font-bold text-lg text-white">Recent Doubts &amp; Queries</h2>
            </div>
            <Link
              href="/student/queries"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            >
              <span>View all ({total})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentQueries.length > 0 ? (
              recentQueries.map((q) => {
                const refCode = q.referenceId || `#QRY-${q._id.toString().slice(-6).toUpperCase()}`;
                return (
                  <div
                    key={q._id.toString()}
<<<<<<< HEAD
                    className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#A99AEF]">{refCode}</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{q.title}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {q.subject} · <span className="text-[var(--text-primary)]">{q.course}</span>
                        {q.semester ? ` · Sem ${q.semester}` : ''}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Assigned to:{' '}
                        {q.faculty ? (
                          <span className="text-[#A99AEF] font-medium">{q.faculty.name}</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">Automated Triage Pending</span>
=======
                    className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-violet-400">{refCode}</span>
                        <span className="text-sm font-semibold text-white">{q.title}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {q.subject} · <span className="text-slate-300">{q.course}</span>
                        {q.semester ? ` · Sem ${q.semester}` : ''}
                      </p>
                      <p className="text-xs text-slate-400">
                        Assigned to:{' '}
                        {q.faculty ? (
                          <span className="text-cyan-400 font-medium">{q.faculty.name}</span>
                        ) : (
                          <span className="text-amber-400">Automated Triage Pending</span>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <span className={`pill ${getStatusPillClass(q.status)}`}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
<<<<<<< HEAD
              <div className="py-12 text-center text-[var(--text-secondary)] space-y-3">
                <AlertCircle size={32} className="mx-auto text-[var(--text-secondary)]" />
                <p className="text-sm">You haven&apos;t submitted any queries yet.</p>
                <Link href="/student/submit-query" className="btn btn-primary text-xs font-bold inline-flex text-black">
=======
              <div className="py-12 text-center text-slate-400 space-y-3">
                <AlertCircle size={32} className="mx-auto text-slate-500" />
                <p className="text-sm">You haven&apos;t submitted any queries yet.</p>
                <Link href="/student/submit-query" className="btn btn-lime text-xs font-bold inline-flex">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                  Submit Your First Doubt
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Upcoming Appointments */}
        <div className="card p-6 md:p-7 space-y-4">
<<<<<<< HEAD
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-[#A99AEF]" />
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Upcoming Meetings</h2>
            </div>
            <Link
              href="/student/appointments"
              className="text-xs font-semibold text-[#A99AEF] hover:text-[#C6B9FF] flex items-center gap-1"
=======
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-lime-400" />
              <h2 className="font-heading font-bold text-lg text-white">Upcoming Meetings</h2>
            </div>
            <Link
              href="/student/appointments"
              className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            >
              <span>Manage</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((a) => (
                <div
                  key={a._id.toString()}
<<<<<<< HEAD
                  className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[160px]">
=======
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate max-w-[160px]">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      {a.reason}
                    </span>
                    <span className={`pill ${getStatusPillClass(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
<<<<<<< HEAD
                  <p className="text-xs text-[var(--text-secondary)]">
                    With: <strong className="text-[var(--text-primary)]">{a.faculty?.name || 'Faculty'}</strong>
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="text-[11px] font-mono text-[#A99AEF] bg-[var(--bg-main)] px-2 py-0.5 rounded-md border border-[var(--border-card)] w-fit">
=======
                  <p className="text-xs text-slate-400">
                    With: <strong className="text-slate-300">{a.faculty?.name || 'Faculty'}</strong>
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded-md border border-cyan-800/30 w-fit">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      📅 {formatDate(a.date)} · ⏰ {formatTime12(a.time) || a.time}
                    </div>
                    {(() => {
                      const mt = String(a.meetingType || '').toLowerCase();
                      if (mt.includes('phone')) {
                        return (
<<<<<<< HEAD
                          <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border-card)] bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                            <Phone size={10} className="text-[#A99AEF]" />
=======
                          <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-fuchsia-500/40 bg-fuchsia-950/40 text-fuchsia-300 flex items-center gap-1 font-semibold">
                            <Phone size={10} className="text-fuchsia-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                            <span>Phone</span>
                          </div>
                        );
                      }
                      if (mt.includes('virtual') || mt.includes('meet') || mt.includes('video') || mt.includes('online')) {
                        return (
<<<<<<< HEAD
                          <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border-card)] bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                            <Video size={10} className="text-[#A99AEF]" />
=======
                          <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 flex items-center gap-1 font-semibold">
                            <Video size={10} className="text-emerald-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                            <span>Virtual</span>
                          </div>
                        );
                      }
                      return (
<<<<<<< HEAD
                        <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border-card)] bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                          <MapPin size={10} className="text-[#A99AEF]" />
=======
                        <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-violet-500/40 bg-violet-950/40 text-violet-300 flex items-center gap-1 font-semibold">
                          <MapPin size={10} className="text-violet-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                          <span>In-person</span>
                        </div>
                      );
                    })()}
                  </div>
                  {a.note && (
<<<<<<< HEAD
                    <p className="text-[11px] text-[var(--text-secondary)] italic bg-[var(--bg-main)] p-2 rounded border border-[var(--border-card)]">
=======
                    <p className="text-[11px] text-slate-400 italic bg-white/[0.02] p-2 rounded">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      &quot;{a.note}&quot;
                    </p>
                  )}
                </div>
              ))
            ) : (
<<<<<<< HEAD
              <div className="py-8 text-center text-[var(--text-secondary)] space-y-2">
                <Calendar size={28} className="mx-auto text-[var(--text-secondary)]" />
=======
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Calendar size={28} className="mx-auto text-slate-600" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                <p className="text-xs">No upcoming appointments scheduled.</p>
                <Link
                  href="/student/appointments"
                  className="btn btn-secondary text-xs px-3 py-1.5 mt-2 inline-flex"
                >
                  Book Office Hours
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
