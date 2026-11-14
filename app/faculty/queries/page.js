"use client";

import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  getQueries,
  updateQuery,
  scheduleConsultation,
  formatDateTime,
  formatDate,
  todayLocal
} from '@/lib/dataService';
import {
  PRIORITY_RANK,
  QUERY_CATEGORIES,
  QUERY_PRIORITIES
} from '@/lib/validators';
import {
  Search,
  Filter,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Inbox,
  User,
  Paperclip,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';

const closed = (s) => ['Answered', 'Resolved', 'Closed'].includes(s);

export default function FacultyQueriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('PRIORITY_DEFAULT');

  const load = useCallback(async () => {
    try {
      const qs = await getQueries();
      setItems(qs);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch assigned queries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  async function handleAnswer(id, body) {
    await updateQuery(id, body);
    await load();
  }

  // Unique subjects for filter
  const subjects = useMemo(() => {
    const set = new Set();
    for (const q of items) {
      if (q.subject) set.add(q.subject);
    }
    return Array.from(set);
  }, [items]);

  // Filtering and Sorting
  const processed = useMemo(() => {
    let list = items.filter((q) => {
      const matchSearch =
        !search.trim() ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.toLowerCase().includes(search.toLowerCase()) ||
        (q.student?.name && q.student.name.toLowerCase().includes(search.toLowerCase())) ||
        (q.referenceId && q.referenceId.toLowerCase().includes(search.toLowerCase()));

      const matchSubject = subjectFilter === 'ALL' || q.subject === subjectFilter;
      const matchPriority = priorityFilter === 'ALL' || q.priority === priorityFilter;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'OPEN' && ['Assigned', 'In Progress', 'Pending', 'Submitted'].includes(q.status)) ||
        (statusFilter === 'RESOLVED' && ['Answered', 'Resolved', 'Closed'].includes(q.status)) ||
        q.status === statusFilter;

      return matchSearch && matchSubject && matchPriority && matchStatus;
    });

    return list.sort((a, b) => {
      if (sortBy === 'PRIORITY_DEFAULT') {
        return (
          closed(a.status) - closed(b.status) ||
          (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0) ||
          new Date(a.createdAt) - new Date(b.createdAt)
        );
      }
      if (sortBy === 'NEWEST') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'OLDEST') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'PRIORITY_DESC') {
        return (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0);
      }
      return 0;
    });
  }, [items, search, subjectFilter, priorityFilter, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-bold mb-1">
          <Sparkles size={14} />
          Instruction Management
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Assigned Queries
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-3xl">
          Review doubts submitted by students in your courses. Prioritize questions, provide detailed academic explanations, and schedule office hour appointments when needed.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="card p-5 space-y-4">
        <div className="grid md:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, title, context or #QRY..."
              className="field pl-10 text-sm"
            />
          </div>

          {/* Subject filter */}
          <div className="md:col-span-3">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="field text-sm"
            >
              <option value="ALL">All Subjects ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="md:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="field text-sm"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="field text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open (Awaiting / In Progress)</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Answered">Answered</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Sort selector bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-cyan-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white border-0 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="PRIORITY_DEFAULT" className="bg-[#171F35]">Urgency &amp; Open First (Recommended)</option>
              <option value="NEWEST" className="bg-[#171F35]">Newest Submissions First</option>
              <option value="OLDEST" className="bg-[#171F35]">Oldest Submissions First</option>
              <option value="PRIORITY_DESC" className="bg-[#171F35]">Highest Priority First</option>
            </select>
          </div>
          <span className="font-mono">
            SHOWING {processed.length} OF {items.length} ASSIGNED
          </span>
        </div>
      </div>

      {/* Query List */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card p-12 text-center text-slate-400">Loading assigned student queries…</div>
      ) : processed.length > 0 ? (
        <div className="space-y-4">
          {processed.map((q) => (
            <FacultyQueryCard
              key={q._id}
              q={q}
              onAnswer={handleAnswer}
              onReload={load}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-slate-400 space-y-3">
          <Inbox size={36} className="mx-auto text-slate-600" />
          <p className="text-base font-semibold text-white">No queries match your current filter.</p>
          <button
            onClick={() => {
              setSearch('');
              setSubjectFilter('ALL');
              setPriorityFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="btn btn-secondary text-xs px-4 py-2"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

function FacultyQueryCard({ q, onAnswer, onReload }) {
  const [response, setResponse] = useState(q.response || '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const refCode = q.referenceId || `#QRY-${q._id.slice(-6).toUpperCase()}`;

  async function runAction(body, okMsg = '') {
    setErr('');
    setInfo('');
    setBusy(true);
    try {
      await onAnswer(q._id, body);
      if (okMsg) setInfo(okMsg);
    } catch (e) {
      setErr(e.message || 'Operation failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleSchedule(e) {
    e.preventDefault();
    setErr('');
    setInfo('');
    setBusy(true);
    try {
      await scheduleConsultation({ queryId: q._id, date, time, note });
      setScheduleOpen(false);
      setDate('');
      setTime('');
      setNote('');
      setInfo('1-on-1 consultation scheduled. The appointment now appears in the student’s portal as Approved.');
      await onReload();
    } catch (e2) {
      setErr(e2.message || 'Failed to schedule consultation');
    } finally {
      setBusy(false);
    }
  }

  const text = response.trim();

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
    <article className="card p-6 md:p-7 space-y-5 border border-white/10 hover:border-white/20 transition-all">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded border border-violet-800/40">
            {refCode}
          </span>
          <span className="text-xs font-semibold text-slate-400 font-mono">
            {formatDateTime(q.createdAt)}
          </span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-cyan-400 font-semibold">
            {q.subject}
          </span>
          <span className="text-xs text-slate-400">
            ({q.course}{q.semester ? ` · Sem ${q.semester}` : ''}{q.section ? ` · Sec ${q.section}` : ''})
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

      {/* Student Details and Question */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <User size={14} className="text-cyan-400" />
          <span>
            Student: <strong className="text-white">{q.student?.name}</strong>
            {q.student?.registrationNumber ? ` (Reg. No. ${q.student.registrationNumber})` : ''} · {q.student?.email}
          </span>
        </div>
        <h2 className="font-heading font-bold text-xl text-white">
          {q.title}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pt-1">
          {q.description}
        </p>
      </div>

      {/* Attachment if present */}
      {q.attachment?.name && (
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Paperclip size={14} className="text-cyan-400" />
            <span>Attachment: {q.attachment.name}</span>
          </div>
          {q.attachment.url && (
            <a
              href={q.attachment.url}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Attachment Link</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {/* Triage Adjustments: Priority & Category */}
      <div className="flex gap-4 flex-wrap text-xs pt-1">
        <label className="font-semibold text-slate-400 flex items-center gap-2">
          <span>Priority:</span>
          <select
            className="field text-xs py-1.5 px-3 w-auto"
            value={q.priority}
            disabled={busy}
            onChange={(e) => runAction({ priority: e.target.value })}
          >
            {QUERY_PRIORITIES.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>

        <label className="font-semibold text-slate-400 flex items-center gap-2">
          <span>Category:</span>
          <select
            className="field text-xs py-1.5 px-3 w-auto"
            value={q.category}
            disabled={busy}
            onChange={(e) => runAction({ category: e.target.value })}
          >
            {QUERY_CATEGORIES.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Previously Saved Response */}
      {q.response && (
        <div className="p-4 rounded-xl bg-lime-950/20 border border-lime-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-lime-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              Saved Faculty Response
            </span>
            {q.respondedAt && (
              <span className="text-[11px] text-slate-400 font-mono font-normal">
                {formatDateTime(q.respondedAt)}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {q.response}
          </p>
        </div>
      )}

      {/* Response Textarea */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {q.response ? 'Update Academic Response' : 'Write Academic Response'}
        </label>
        <textarea
          className="field min-h-[110px] text-sm leading-relaxed"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Explain the concept clearly, provide reference materials, or suggest next steps for the student..."
        />
      </div>

      {/* Inline Feedback alerts */}
      {err && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {err}
        </div>
      )}
      {info && (
        <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/30 text-lime-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{info}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2.5 flex-wrap items-center pt-1">
        <button
          className="btn btn-lime shadow-glow-lime text-xs font-bold px-4 py-2"
          disabled={busy || text.length < 2}
          onClick={() =>
            runAction(
              { response: text, status: 'Answered' },
              'Response saved! Status marked Answered and visible in student portal.'
            )
          }
        >
          <Send size={14} className="text-midnight" />
          <span>{q.response ? 'Update & Send Response' : 'Send Official Response'}</span>
        </button>

        <button
          className="btn btn-secondary text-xs px-3.5 py-2"
          disabled={busy || q.status === 'In Progress'}
          onClick={() => runAction({ status: 'In Progress' }, 'Marked In Progress.')}
        >
          <Clock size={14} className="text-cyan-400" />
          <span>Mark In Progress</span>
        </button>

        <button
          className="btn btn-secondary text-xs px-3.5 py-2"
          disabled={busy || (text.length < 2 && !q.response)}
          onClick={() =>
            runAction(
              text.length >= 2 ? { response: text, status: 'Resolved' } : { status: 'Resolved' },
              'Query marked as fully Resolved.'
            )
          }
        >
          <CheckCircle2 size={14} className="text-lime-400" />
          <span>Mark Resolved</span>
        </button>

        <button
          className="btn btn-secondary text-xs px-3.5 py-2"
          onClick={() => setScheduleOpen((o) => !o)}
        >
          <Calendar size={14} className="text-violet-400" />
          <span>{scheduleOpen ? 'Cancel Consultation Form' : 'Schedule Consultation'}</span>
        </button>
      </div>

      {/* Schedule Consultation Modal/Inline Form */}
      {scheduleOpen && (
        <form
          onSubmit={handleSchedule}
          className="p-5 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
            <Calendar size={15} />
            Direct Consultation Booking
          </div>
          <p className="text-xs text-slate-400">
            Book a meeting directly for this query. The appointment will be saved as <strong>Approved</strong> and appear in the student’s portal.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-xs font-semibold text-slate-300">
              Meeting Date
              <input
                className="field mt-1 text-xs"
                type="date"
                min={todayLocal()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              Meeting Time (HH:MM)
              <input
                className="field mt-1 text-xs"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-300">
            Instructions / Venue Note for Student (optional)
            <input
              className="field mt-1 text-xs"
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Meet in Block 34, Cabin 204 or join Google Meet link"
            />
          </label>

          <button
            type="submit"
            className="btn btn-cyan text-xs font-bold px-4 py-2"
            disabled={busy}
          >
            {busy ? 'Scheduling…' : 'Confirm & Schedule Consultation'}
          </button>
        </form>
      )}
    </article>
  );
}
