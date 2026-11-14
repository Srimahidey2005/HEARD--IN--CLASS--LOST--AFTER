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
  HelpCircle
} from 'lucide-react';

export default function TriagePanel({ queries = [], faculty = [] }) {
  const [rows, setRows] = useState(queries);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('UNASSIGNED_FIRST'); // 'ALL', 'UNASSIGNED_ONLY', 'URGENT'
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
      return 0;
    });
  }, [rows, search, filterMode]);

  const unassignedTotal = rows.filter((x) => !x.facultyId).length;

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

  return (
    <div className="card p-6 md:p-8 space-y-6 border border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
            <Sparkles size={14} />
            Module 3 · Triage &amp; Routing Control
          </div>
          <h2 className="font-heading font-bold text-2xl text-white">Query Routing &amp; Triage</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Queries are routed automatically by subject mapping and faculty workload. If no faculty member teaches a subject, or if manual override is required, assign it below.
          </p>
        </div>

        {unassignedTotal > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold shrink-0">
            <AlertTriangle size={16} />
            <span>{unassignedTotal} Unassigned Query Awaiting Route</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queries, students, subjects..."
            className="field pl-10 text-xs py-2.5"
          />
        </div>

        <div className="flex gap-2 flex-wrap text-xs">
          <button
            onClick={() => setFilterMode('UNASSIGNED_FIRST')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterMode === 'UNASSIGNED_FIRST'
                ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            All Queries
          </button>
          <button
            onClick={() => setFilterMode('UNASSIGNED_ONLY')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterMode === 'UNASSIGNED_ONLY'
                ? 'bg-amber-500/30 border-amber-500 text-amber-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Unassigned Only ({unassignedTotal})
          </button>
          <button
            onClick={() => setFilterMode('URGENT')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterMode === 'URGENT'
                ? 'bg-rose-500/30 border-rose-500 text-rose-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            High Priority / Urgent
          </button>
        </div>
      </div>

      {/* Global Toast */}
      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
            bad
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-lime-500/10 border-lime-500/30 text-lime-300'
          }`}
        >
          {bad ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{msg}</span>
        </div>
      )}

      {/* Query Triage Rows */}
      <div className="space-y-3 pt-1">
        {processed.length > 0 ? (
          processed.map((q) => {
            const isUnassigned = !q.facultyId;
            const refCode = q.referenceId || `#QRY-${q._id.slice(-6).toUpperCase()}`;

            return (
              <div
                key={q._id}
                className={`p-5 rounded-xl border transition-all ${
                  isUnassigned
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-violet-400">{refCode}</span>
                    <span className="font-heading font-bold text-sm text-white">{q.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`pill ${getStatusPillClass(q.status)}`}>{q.status}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Student: <strong className="text-slate-300">{q.studentName}</strong> ·{' '}
                  Subject: <span className="text-cyan-400 font-semibold">{q.subject}</span> ·{' '}
                  {q.course}{q.semester ? ` · Sem ${q.semester}` : ''}
                </p>

                {/* Routing & Category Correction Controls */}
                <div className="grid sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Assign To Faculty Member
                    </label>
                    <select
                      className="field text-xs py-1.5"
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
                      <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} />
                        No automatic match found. Please assign a faculty member.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Correct / Adjust Category
                    </label>
                    <select
                      className="field text-xs py-1.5"
                      disabled={busy === q._id}
                      value={q.category}
                      onChange={(e) => apply(q._id, { category: e.target.value })}
                    >
                      {QUERY_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No queries match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
