"use client";

<<<<<<< HEAD
import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cancelQuery, getQueries, getAppointments, formatDate, formatDateTime } from '@/lib/dataService';
=======
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cancelQuery, formatDate, formatDateTime } from '@/lib/dataService';
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
import { formatTime12 } from '@/lib/timetable';
import {
  Search,
  Filter,
  Calendar,
  XCircle,
  MessageSquare,
  Clock,
  User,
  Paperclip,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronDown,
<<<<<<< HEAD
  ChevronUp,
  RefreshCw
=======
  ChevronUp
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
} from 'lucide-react';

export default function StudentQueriesView({ initialQueries = [], initialAppointments = [] }) {
  const router = useRouter();
  const [queries, setQueries] = useState(initialQueries);
  const [appointments, setAppointments] = useState(initialAppointments);
<<<<<<< HEAD
  const [isRefreshing, setIsRefreshing] = useState(false);
=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [actionBusy, setActionBusy] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [expandedId, setExpandedId] = useState(null);

<<<<<<< HEAD
  const reloadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [qs, apps] = await Promise.all([
        getQueries().catch(() => null),
        getAppointments().catch(() => null)
      ]);
      if (Array.isArray(qs)) setQueries(qs);
      if (Array.isArray(apps)) setAppointments(apps);
    } catch {} finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(reloadData, 10000);
    window.addEventListener('focus', reloadData);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', reloadData);
    };
  }, [reloadData]);

=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
  // Group appointments by queryId
  const appointmentsByQuery = useMemo(() => {
    const map = {};
    for (const a of appointments) {
      if (a.query?._id || a.query) {
        const qId = a.query._id ? a.query._id.toString() : a.query.toString();
        if (!map[qId]) map[qId] = [];
        map[qId].push(a);
      }
    }
    return map;
  }, [appointments]);

  // Filtered queries
  const filtered = useMemo(() => {
    return queries.filter((q) => {
      const matchSearch =
        !search.trim() ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase()) ||
        (q.course && q.course.toLowerCase().includes(search.toLowerCase())) ||
        (q.referenceId && q.referenceId.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'OPEN' && ['Pending', 'Submitted', 'Assigned', 'In Progress'].includes(q.status)) ||
        (statusFilter === 'RESOLVED' && ['Answered', 'Resolved'].includes(q.status)) ||
        q.status.toLowerCase() === statusFilter.toLowerCase();

      const matchCategory =
        categoryFilter === 'ALL' || q.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [queries, search, statusFilter, categoryFilter]);

  async function handleCancel(id) {
    if (!confirm('Are you sure you want to cancel this query?')) return;
    setActionBusy(id);
    setFeedbackMsg('');
    try {
      const updated = await cancelQuery(id);
      setQueries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: 'Cancelled' } : item))
      );
      setFeedbackMsg('Query cancelled successfully.');
      router.refresh();
    } catch (err) {
      setFeedbackMsg(err.message || 'Could not cancel query.');
    } finally {
      setActionBusy('');
    }
  }

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
        return 'pill-answered';
      case 'Closed':
      case 'Cancelled':
      case 'Rejected':
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
    <div className="space-y-6">
      {/* Search and Filters toolbar */}
      <div className="card p-5 space-y-4">
        <div className="grid md:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="md:col-span-6 relative">
<<<<<<< HEAD
            <Search className="absolute left-3.5 top-3.5 text-[var(--text-secondary)]" size={17} />
=======
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, keyword or #QRY code..."
              className="field pl-10 text-sm"
            />
          </div>

          {/* Status filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="field text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Triage</option>
              <option value="Assigned">Assigned to Faculty</option>
              <option value="In Progress">In Progress</option>
              <option value="Answered">Answered</option>
              <option value="Resolved">Resolved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="field text-sm"
            >
              <option value="ALL">All Categories</option>
              <option value="Academic Doubt">Academic Doubt</option>
              <option value="Assignment">Assignment</option>
              <option value="Examination">Examination</option>
              <option value="Attendance">Attendance</option>
              <option value="Course Material">Course Material</option>
              <option value="Administrative Request">Administrative Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Feedback message */}
        {feedbackMsg && (
<<<<<<< HEAD
          <div className="p-3 rounded-xl bg-[#A99AEF]/15 border border-[#A99AEF]/30 text-[var(--text-primary)] text-xs">
=======
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            {feedbackMsg}
          </div>
        )}
      </div>

      {/* Query count indicator */}
<<<<<<< HEAD
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1 font-mono">
        <span>SHOWING {filtered.length} OF {queries.length} QUERIES</span>
        <Link href="/student/submit-query" className="text-[#A99AEF] hover:text-[#C6B9FF] font-semibold flex items-center gap-1 font-sans">
=======
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>SHOWING {filtered.length} OF {queries.length} QUERIES</span>
        <Link href="/student/submit-query" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 font-sans">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          <span>+ Submit New Query</span>
        </Link>
      </div>

      {/* Query List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((q) => {
            const refCode = q.referenceId || `#QRY-${q._id.toString().slice(-6).toUpperCase()}`;
            const relatedAppointments = appointmentsByQuery[q._id.toString()] || [];
            const canCancel = ['Pending', 'Submitted', 'Assigned'].includes(q.status);
            const isExpanded = expandedId === q._id;

            return (
              <article
                key={q._id.toString()}
<<<<<<< HEAD
                className="card p-6 md:p-7 space-y-4 transition-all"
              >
                {/* Header row: Reference & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-card)]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#A99AEF] bg-[#A99AEF]/10 px-2 py-0.5 rounded border border-[#A99AEF]/30">
                      {refCode}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                      {formatDateTime(q.createdAt)}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">·</span>
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
=======
                className="card p-6 md:p-7 space-y-4 transition-all hover:border-white/20"
              >
                {/* Header row: Reference & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded border border-violet-800/40">
                      {refCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {formatDateTime(q.createdAt)}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-300 font-medium">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      {q.course}{q.semester ? ` · Sem ${q.semester}` : ''}{q.section ? ` · Sec ${q.section}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`pill ${getPriorityPillClass(q.priority)}`}>
                      {q.priority}
                    </span>
                    <span className={`pill ${getStatusPillClass(q.status)}`}>
                      {q.status}
                    </span>
                  </div>
                </div>

                {/* Title & Subject */}
                <div>
<<<<<<< HEAD
                  <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">
                    {q.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
                    <span className="text-[#A99AEF] font-semibold">{q.subject}</span>
                    <span>•</span>
                    <span className="text-[var(--text-secondary)]">{q.category}</span>
=======
                  <h2 className="font-heading font-bold text-xl text-white">
                    {q.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">{q.subject}</span>
                    <span>•</span>
                    <span className="text-slate-300">{q.category}</span>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                  </div>
                </div>

                {/* Description */}
<<<<<<< HEAD
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
=======
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                  {q.description}
                </p>

                {/* Attachment if present */}
                {q.attachment?.name && (
<<<<<<< HEAD
                  <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Paperclip size={14} className="text-[#A99AEF]" />
=======
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Paperclip size={14} className="text-cyan-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      <span>{q.attachment.name}</span>
                    </div>
                    {q.attachment.url && (
                      <a
                        href={q.attachment.url}
                        target="_blank"
                        rel="noreferrer"
<<<<<<< HEAD
                        className="text-[#A99AEF] hover:underline flex items-center gap-1 font-semibold"
=======
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      >
                        <span>Open Link</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}

                {/* Assigned Faculty Banner */}
<<<<<<< HEAD
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-xs text-[var(--text-secondary)]">
                  <User size={16} className="text-[var(--text-secondary)] shrink-0" />
=======
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400">
                  <User size={16} className="text-slate-500 shrink-0" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                  <div>
                    {q.faculty ? (
                      <span>
                        Assigned Faculty:{' '}
<<<<<<< HEAD
                        <strong className="text-[var(--text-primary)] font-medium">{q.faculty.name}</strong>
                        {q.faculty.department ? ` (${q.faculty.department})` : ''}
                      </span>
                    ) : (
                      <span className="text-[#A99AEF] flex items-center gap-1">
=======
                        <strong className="text-white font-medium">{q.faculty.name}</strong>
                        {q.faculty.department ? ` (${q.faculty.department})` : ''}
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        <Clock size={13} />
                        Awaiting automatic triage assignment
                      </span>
                    )}
                  </div>
                </div>

                {/* Faculty Response Section (if exists) */}
                {q.response && (
<<<<<<< HEAD
                  <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[#A99AEF]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#A99AEF] uppercase tracking-wider">
=======
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-lime-950/30 to-[#131b31] border border-lime-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        <CheckCircle2 size={16} />
                        Faculty Response
                      </div>
                      {q.respondedAt && (
<<<<<<< HEAD
                        <span className="text-[11px] text-[var(--text-secondary)] font-mono">
=======
                        <span className="text-[11px] text-slate-400 font-mono">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                          {formatDateTime(q.respondedAt)}
                        </span>
                      )}
                    </div>
<<<<<<< HEAD
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                      {q.response}
                    </p>
                    <div className="text-[11px] text-[var(--text-secondary)] pt-1">
                      Answered by:{' '}
                      <strong className="text-[var(--text-primary)]">
=======
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {q.response}
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Answered by:{' '}
                      <strong className="text-slate-300">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        {q.answeredBy?.name || q.faculty?.name || 'Assigned Faculty'}
                      </strong>
                    </div>
                  </div>
                )}

                {/* Linked Appointments */}
                {relatedAppointments.length > 0 && (
                  <div className="space-y-2 pt-1">
<<<<<<< HEAD
                    <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#A99AEF]" />
=======
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={13} className="text-cyan-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      Linked Appointments ({relatedAppointments.length})
                    </div>
                    {relatedAppointments.map((ap) => (
                      <div
                        key={ap._id.toString()}
<<<<<<< HEAD
                        className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">
                            {ap.faculty?.name || 'Faculty Member'} · {formatDate(ap.date)} at {formatTime12(ap.time) || ap.time}
                          </p>
                          <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">{ap.reason}</p>
                          {ap.note && (
                            <p className="text-[var(--text-secondary)] text-[11px] italic mt-1 bg-[var(--bg-main)] p-1.5 rounded">
=======
                        className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {ap.faculty?.name || 'Faculty Member'} · {formatDate(ap.date)} at {formatTime12(ap.time) || ap.time}
                          </p>
                          <p className="text-slate-400 text-[11px] mt-0.5">{ap.reason}</p>
                          {ap.note && (
                            <p className="text-slate-400 text-[11px] italic mt-1 bg-white/[0.02] p-1.5 rounded">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                              Note: {ap.note}
                            </p>
                          )}
                        </div>
                        <span className={`pill ${getStatusPillClass(ap.status)} self-start sm:self-center shrink-0`}>
                          {ap.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons Bar */}
<<<<<<< HEAD
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-b border-[var(--border-card)]">
=======
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Book Appointment linking this query */}
                    {q.faculty && (
                      <Link
                        href={`/student/appointments?queryId=${q._id}&facultyId=${q.faculty._id || q.faculty}`}
                        className="btn btn-secondary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                      >
<<<<<<< HEAD
                        <Calendar size={13} className="text-[#A99AEF]" />
=======
                        <Calendar size={13} className="text-cyan-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        <span>Book Related Appointment</span>
                      </Link>
                    )}

                    {/* Cancel Query Button */}
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(q._id)}
                        disabled={actionBusy === q._id}
<<<<<<< HEAD
                        className="text-xs text-rose-500 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
=======
                        className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      >
                        <XCircle size={13} />
                        <span>{actionBusy === q._id ? 'Cancelling…' : 'Cancel Query'}</span>
                      </button>
                    )}
                  </div>

<<<<<<< HEAD
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">
=======
                  <span className="text-[11px] text-slate-500 font-mono">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    ID: {q._id.toString()}
                  </span>
                </div>
              </article>
            );
          })
        ) : (
<<<<<<< HEAD
          <div className="card p-12 text-center text-[var(--text-secondary)] space-y-4">
            <Search size={36} className="mx-auto text-[var(--text-secondary)]" />
            <div>
              <p className="text-base font-semibold text-[var(--text-primary)]">No queries match your filter criteria.</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Try adjusting your search terms or clearing status filters.</p>
=======
          <div className="card p-12 text-center text-slate-400 space-y-4">
            <Search size={36} className="mx-auto text-slate-600" />
            <div>
              <p className="text-base font-semibold text-white">No queries match your filter criteria.</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or clearing status filters.</p>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            </div>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="btn btn-secondary text-xs px-4 py-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
