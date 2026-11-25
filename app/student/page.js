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

export const dynamic = 'force-dynamic';

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
            Track your submitted doubts, faculty replies, and scheduled academic consultations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/student/submit-query"
            className="btn btn-primary px-5 py-2.5 font-bold text-black"
          >
            + Ask a Doubt
          </Link>
          <Link
            href="/student/appointments"
            className="btn btn-secondary px-4 py-2.5"
          >
            <Calendar size={16} className="text-[#A99AEF]" />
            <span>Appointments</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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
        </div>
      </div>

      {/* Two Column Layout: Upcoming Appointments & Recent Queries */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recent Queries */}
        <div className="lg:col-span-2 card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={18} className="text-[#A99AEF]" />
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Recent Doubts &amp; Queries</h2>
            </div>
            <Link
              href="/student/queries"
              className="text-xs font-semibold text-[#A99AEF] hover:text-[#C6B9FF] flex items-center gap-1"
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
              <div className="py-12 text-center text-[var(--text-secondary)] space-y-3">
                <AlertCircle size={32} className="mx-auto text-[var(--text-secondary)]" />
                <p className="text-sm">You haven&apos;t submitted any queries yet.</p>
                <Link href="/student/submit-query" className="btn btn-primary text-xs font-bold inline-flex text-black">
                  Submit Your First Doubt
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Upcoming Appointments */}
        <div className="card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-[#A99AEF]" />
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Upcoming Meetings</h2>
            </div>
            <Link
              href="/student/appointments"
              className="text-xs font-semibold text-[#A99AEF] hover:text-[#C6B9FF] flex items-center gap-1"
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
                  className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[160px]">
                      {a.reason}
                    </span>
                    <span className={`pill ${getStatusPillClass(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    With: <strong className="text-[var(--text-primary)]">{a.faculty?.name || 'Faculty'}</strong>
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="text-[11px] font-mono text-[#A99AEF] bg-[var(--bg-main)] px-2 py-0.5 rounded-md border border-[var(--border-card)] w-fit">
                      📅 {formatDate(a.date)} · ⏰ {formatTime12(a.time) || a.time}
                    </div>
                    {(() => {
                      const mt = String(a.meetingType || '').toLowerCase();
                      if (mt.includes('phone')) {
                        return (
                          <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border-card)] bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                            <Phone size={10} className="text-[#A99AEF]" />
                            <span>Phone</span>
                          </div>
                        );
                      }
                      if (mt.includes('virtual') || mt.includes('meet') || mt.includes('video') || mt.includes('online')) {
                        return (
                          <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border-card)] bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                            <Video size={10} className="text-[#A99AEF]" />
                            <span>Virtual</span>
                          </div>
                        );
                      }
                      return (
                        <div className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border-card)] bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                          <MapPin size={10} className="text-[#A99AEF]" />
                          <span>In-person</span>
                        </div>
                      );
                    })()}
                  </div>
                  {a.note && (
                    <p className="text-[11px] text-[var(--text-secondary)] italic bg-[var(--bg-main)] p-2 rounded border border-[var(--border-card)]">
                      &quot;{a.note}&quot;
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[var(--text-secondary)] space-y-2">
                <Calendar size={28} className="mx-auto text-[var(--text-secondary)]" />
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
