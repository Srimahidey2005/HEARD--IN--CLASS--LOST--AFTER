"use client";

import { useState, useMemo } from 'react';
import { updateQuery } from '@/lib/dataService';
import { QUERY_CATEGORIES } from '@/lib/validators';
import {
  Search,
  Filter,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function TriagePanel({ queries = [], faculty = [] }) {
  const [rows, setRows] = useState(queries);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'UNASSIGNED_ONLY', 'URGENT'
  const [msg, setMsg] = useState('');
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState('');

  async function apply(id, body) {
    setMsg('');
    setBad(false);
    setBusy(id);
    try {
      const q = await updateQuery(id, body);
      setRows((prev) =>
        prev.map((x) =>
          x._id === id
            ? {
                ...x,
                status: q.status,
                category: q.category,
                priority: q.priority || x.priority,
                facultyId: q.faculty?._id || '',
                facultyName: q.faculty?.name || ''
              }
            : x
        )
      );
      setMsg(`Query #${q.referenceId || id.slice(-6).toUpperCase()} updated successfully.`);
    } catch (err) {
      setMsg(err.message || 'Failed to update query.');
      setBad(true);
    } finally {
      setBusy('');
    }
  }

  const processed = useMemo(() => {
    return rows.filter((q) => {
      const matchSearch =
        !search.trim() ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.toLowerCase().includes(search.toLowerCase()) ||
        q.studentName.toLowerCase().includes(search.toLowerCase()) ||
        (q.referenceId && q.referenceId.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

      if (filterMode === 'UNASSIGNED_ONLY') return !q.facultyId;
      if (filterMode === 'URGENT') return q.priority === 'Urgent' || q.priority === 'High';
      return true;
    }).sort((a, b) => {
      if (filterMode === 'UNASSIGNED_FIRST') {
        const aUnassigned = !a.facultyId ? 1 : 0;
        const bUnassigned = !b.facultyId ? 1 : 0;
        return bUnassigned - aUnassigned || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [rows, search, filterMode]);

  const unassignedTotal = rows.filter((x) => !x.facultyId).length;
  const urgentTotal = rows.filter((x) => x.priority === 'Urgent' || x.priority === 'High').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-card)]">
            <Clock size={12} />
            <span>Pending</span>
          </span>
        );
      case 'Assigned':
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-card)]">
            <UserCheck size={12} className="text-[#A99AEF]" />
            <span>{status}</span>
          </span>
        );
      case 'Answered':
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
            <CheckCircle2 size={12} />
            <span>Answered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
            ⚡ Urgent
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-card)]">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-card)]">
            Low
          </span>
        );
    }
  };

  return (
    <div id="triage" className="card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--border-card)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A99AEF] font-bold mb-1">
            <Sparkles size={15} />
            <span>Module 3 · Query Monitoring &amp; Live Triage</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Academic Query Monitoring Matrix
          </h2>
          <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
            Monitor real-time student doubt submissions with automated faculty subject-matching, priority scoring, and instant administrative assignment override.
          </p>
        </div>

        {unassignedTotal > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#A99AEF]/15 border border-[#A99AEF]/30 text-[#A99AEF] text-xs font-bold shrink-0">
            <AlertTriangle size={16} />
            <span>{unassignedTotal} Doubt{unassignedTotal === 1 ? '' : 's'} Awaiting Route</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-[var(--text-secondary)]" size={17} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search query title, reference #, student, or subject..."
            className="field pl-10 text-xs md:text-sm"
          />
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterMode === 'ALL'
                ? 'bg-[#A99AEF] text-black border-[#A99AEF]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            All Queries ({rows.length})
          </button>
          <button
            onClick={() => setFilterMode('UNASSIGNED_ONLY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterMode === 'UNASSIGNED_ONLY'
                ? 'bg-[#A99AEF] text-black border-[#A99AEF]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            Unassigned Only ({unassignedTotal})
          </button>
          <button
            onClick={() => setFilterMode('URGENT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterMode === 'URGENT'
                ? 'bg-[#A99AEF] text-black border-[#A99AEF]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            ⚡ Urgent / High ({urgentTotal})
          </button>
        </div>
      </div>

      {/* Global Status Toast */}
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border animate-fadeIn ${
            bad
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
              : 'bg-[#A99AEF]/15 border-[#A99AEF]/30 text-[var(--text-primary)]'
          }`}
        >
          {bad ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-[#A99AEF]" />}
          <span>{msg}</span>
        </div>
      )}

      {/* Query Detail Cards */}
      <div className="space-y-4 pt-1">
        {processed.length > 0 ? (
          processed.map((q) => {
            const isUnassigned = !q.facultyId;
            const refCode = q.referenceId || `#QRY-${q._id.slice(-6).toUpperCase()}`;

            return (
              <div
                key={q._id}
                className={`p-6 rounded-3xl border transition-all ${
                  isUnassigned
                    ? 'bg-[var(--bg-elevated)] border-[#A99AEF]'
                    : 'bg-[var(--bg-card)] border-[var(--border-card)]'
                }`}
              >
                {/* Top Row: Reference, Title, Priority, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-card)]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
                      {refCode}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[var(--text-primary)] tracking-tight">
                      {q.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {getPriorityBadge(q.priority)}
                    {getStatusBadge(q.status)}
                  </div>
                </div>

                {/* Middle Row: Student, Subject, Course, Submission Date */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 py-3 text-xs text-[var(--text-secondary)]">
                  <div>
                    <span className="text-[var(--text-secondary)] text-[11px] block font-semibold">Submitted By</span>
                    <strong className="text-[var(--text-primary)] text-sm">{q.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] text-[11px] block font-semibold">Academic Subject</span>
                    <span className="text-[#A99AEF] font-bold text-sm">{q.subject}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] text-[11px] block font-semibold">Course &amp; Semester</span>
                    <span className="text-[var(--text-primary)]">
                      {q.course || 'Degree Program'} {q.semester ? `· Sem ${q.semester}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] text-[11px] block font-semibold">Submitted On</span>
                    <span className="text-[var(--text-secondary)] font-mono">
                      {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Inline Assignment & Category Adjustment Controls */}
                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-card)] text-xs">
                  {/* Assigned Faculty Selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                      Assigned Teaching Faculty
                    </label>
                    <select
                      className="field text-xs"
                      disabled={busy === q._id}
                      value={q.facultyId || ''}
                      onChange={(e) =>
                        e.target.value && apply(q._id, { facultyId: e.target.value })
                      }
                    >
                      <option value="">⚡ Unassigned (Select faculty to route)</option>
                      {faculty.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name} · Taught: {(f.subjects || []).join(', ')}
                        </option>
                      ))}
                    </select>
                    {isUnassigned && (
                      <p className="text-[11px] text-[#A99AEF] mt-1.5 flex items-center gap-1.5 font-medium">
                        <AlertCircle size={13} className="text-[#A99AEF] shrink-0" />
                        No automatic alias match. Select faculty to assign instantly.
                      </p>
                    )}
                  </div>

                  {/* Category Adjuster */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                      Academic Category
                    </label>
                    <select
                      className="field text-xs"
                      disabled={busy === q._id}
                      value={q.category}
                      onChange={(e) => apply(q._id, { category: e.target.value })}
                    >
                      {QUERY_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-[var(--text-secondary)] text-sm rounded-2xl border border-[var(--border-card)] bg-[var(--bg-elevated)]">
            No queries match your current filter &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
