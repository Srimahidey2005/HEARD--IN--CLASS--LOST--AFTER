"use client";

import { useCallback, useEffect, useState } from 'react';
import {
  getAppointments,
  getFaculty,
  updateAvailability,
  setAppointmentStatus,
  rescheduleAppointment,
  formatDate,
  todayLocal
} from '@/lib/dataService';
import {
  formatTime12,
  formatDateDisplay,
  generateSlotsFromWindow,
  DEFAULT_WEEKDAY_SLOTS
} from '@/lib/timetable';
import { DAYS } from '@/lib/validators';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Info,
  CalendarDays,
  Check,
  MapPin,
  Phone,
  Video
} from 'lucide-react';

export default function FacultyAppointmentsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getAppointments();
      setItems(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 12000);
    window.addEventListener('focus', load);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', load);
    };
  }, [load]);

  async function update(id, status) {
    try {
      await setAppointmentStatus(id, status);
      setError('');
      await load();
    } catch (err) {
      setError(err.message || 'Action failed.');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-bold mb-1">
          <Sparkles size={14} />
          Faculty Availability &amp; Consultations
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Appointment Management
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-3xl">
          Publish your weekly office hours timetable so students can book consultation slots during your free windows. Approve, reschedule, or complete pending student consultations.
        </p>
      </div>

      {/* Office Hours Management Component */}
      <OfficeHours />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading font-bold text-lg text-white">Student Appointment Requests</h2>
          <span className="text-xs font-mono text-slate-400">TOTAL: {items.length}</span>
        </div>

        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((a) => (
              <FacultyAppointmentCard
                key={a._id}
                a={a}
                onStatus={update}
                onChanged={load}
                onError={setError}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="card p-12 text-center text-slate-400 space-y-2">
              <CalendarDays size={32} className="mx-auto text-slate-600" />
              <p className="text-base font-semibold text-white">No appointment requests yet.</p>
              <p className="text-xs text-slate-400">Student requests will appear here in real time.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function FacultyAppointmentCard({ a, onStatus, onChanged, onError }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleReschedule(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await rescheduleAppointment(a._id, { date, time, note });
      onError('');
      setOpen(false);
      setDate('');
      setTime('');
      setNote('');
      await onChanged();
    } catch (err) {
      onError(err.message || 'Failed to reschedule');
    } finally {
      setBusy(false);
    }
  }

  const canReschedule = ['Pending', 'Approved', 'Rescheduled'].includes(a.status);

  const getStatusPillClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'pill-pending';
      case 'Approved':
      case 'Completed':
        return 'pill-answered';
      case 'Rescheduled':
        return 'pill-progress';
      case 'Rejected':
      case 'Cancelled':
        return 'pill-rejected';
      default:
        return 'pill-medium';
    }
  };

  return (
    <div className="card p-6 space-y-4 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-base text-white">{a.reason}</span>
          {(() => {
            const mt = String(a.meetingType || '').toLowerCase();
            if (mt.includes('phone')) {
              return (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-fuchsia-950/40 border-fuchsia-500/40 text-fuchsia-300 font-semibold shadow-sm">
                  <Phone size={11} className="text-fuchsia-400" />
                  <span>Phone call</span>
                </span>
              );
            }
            if (mt.includes('virtual') || mt.includes('meet') || mt.includes('video') || mt.includes('online')) {
              return (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-semibold shadow-sm">
                  <Video size={11} className="text-emerald-400" />
                  <span>Virtual meet</span>
                </span>
              );
            }
            return (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-violet-950/40 border-violet-500/40 text-violet-300 font-semibold shadow-sm">
                <MapPin size={11} className="text-violet-400" />
                <span>In-person</span>
              </span>
            );
          })()}
        </div>
        <span className={`pill ${getStatusPillClass(a.status)}`}>{a.status}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <User size={14} className="text-cyan-400" />
          <span>
            Student: <strong className="text-white">{a.student?.name}</strong>
            {a.student?.registrationNumber ? ` (Reg: ${a.student.registrationNumber})` : ''} · {a.student?.email}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-cyan-300">
          <Calendar size={14} className="text-slate-400" />
          <span>
            Requested: <strong>{formatDate(a.date)}</strong> at <strong>{formatTime12(a.time) || a.time}</strong>
          </span>
        </div>
      </div>

      {a.query?.title && (
        <p className="text-xs text-violet-300 bg-violet-950/20 p-2.5 rounded-lg border border-violet-800/20">
          Related Query: &quot;{a.query.title}&quot;
        </p>
      )}

      {a.status === 'Rescheduled' && a.rescheduledFrom?.date && (
        <p className="text-xs text-amber-400 bg-amber-950/20 p-2.5 rounded-lg border border-amber-800/20">
          ⚡ Rescheduled (originally requested for {formatDate(a.rescheduledFrom.date)} at {formatTime12(a.rescheduledFrom.time) || a.rescheduledFrom.time})
        </p>
      )}

      {a.note && (
        <div className="text-xs text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Note to Student:
          </span>
          <p className="italic">&quot;{a.note}&quot;</p>
        </div>
      )}

      {/* Faculty Actions Bar */}
      <div className="flex gap-2.5 flex-wrap pt-2">
        {a.status === 'Pending' && (
          <button
            className="btn btn-lime text-xs font-bold px-4 py-2"
            onClick={() => onStatus(a._id, 'Approved')}
          >
            <CheckCircle2 size={14} className="text-midnight" />
            <span>Approve Appointment</span>
          </button>
        )}

        {canReschedule && (
          <button
            className="btn btn-secondary text-xs px-3.5 py-2"
            onClick={() => {
              setOpen(!open);
              if (!open) {
                setDate(a.date ? new Date(a.date).toISOString().slice(0, 10) : todayLocal());
                setTime(a.time || '11:00');
              }
            }}
          >
            <RotateCcw size={14} className="text-cyan-400" />
            <span>{open ? 'Close Reschedule' : 'Propose New Slot'}</span>
          </button>
        )}

        {['Pending', 'Approved', 'Rescheduled'].includes(a.status) && (
          <button
            className="btn btn-secondary text-xs px-3.5 py-2 hover:border-rose-500/40 hover:text-rose-400"
            onClick={() => onStatus(a._id, 'Rejected')}
          >
            <XCircle size={14} />
            <span>Reject</span>
          </button>
        )}

        {['Approved', 'Rescheduled'].includes(a.status) && (
          <button
            className="btn btn-secondary text-xs px-3.5 py-2 hover:border-lime-500/40 hover:text-lime-400"
            onClick={() => onStatus(a._id, 'Completed')}
          >
            <CheckCircle2 size={14} />
            <span>Mark Completed</span>
          </button>
        )}
      </div>

      {/* Reschedule Form */}
      {open && (
        <form
          onSubmit={handleReschedule}
          className="p-5 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-4 mt-3 animate-fadeIn"
        >
          <div className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={14} />
            Propose Rescheduled Slot
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-xs font-semibold text-slate-300">
              New Date
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
              New Time (HH:MM or Select Below)
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
            Reason / Note for Rescheduling (optional)
            <input
              className="field mt-1 text-xs"
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. In departmental meeting at requested time; please meet at 14:00 instead"
            />
          </label>

          <button
            type="submit"
            className="btn btn-cyan text-xs font-bold px-4 py-2"
            disabled={busy}
          >
            {busy ? 'Saving Slot…' : 'Confirm & Notify Student'}
          </button>
        </form>
      )}
    </div>
  );
}

// Faculty Office Hours Manager with Free Slots Breakdown
function OfficeHours() {
  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState('Monday');
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('12:00');
  const [msg, setMsg] = useState('');
  const [bad, setBad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await getFaculty();
        const mine = me.find((f) => f.isMe) || null;
        setSlots(mine?.availability || []);
      } catch (err) {
        setMsg(err.message || 'Could not load office hours');
        setBad(true);
      }
      setReady(true);
    })();
  }, []);

  async function saveSlots(next) {
    setMsg('');
    setBad(false);
    try {
      const saved = await updateAvailability(next);
      setSlots(saved);
      setMsg('Office hours updated successfully! Student booking slots will reflect these timetable windows.');
    } catch (err) {
      setMsg(err.message || 'Could not save office hours');
      setBad(true);
    }
  }

  // Pre-calculate 30-min consultation slots for faculty's reference
  const generatedSlotsPreview = slots.length > 0
    ? slots.map((s) => ({
        day: s.day,
        window: `${s.start}–${s.end}`,
        subSlots: generateSlotsFromWindow(s.start, s.end, 30).map(formatTime12)
      }))
    : [
        {
          day: 'Monday–Friday (Default Campus Schedule)',
          window: '10:00–12:30, 14:00–16:00',
          subSlots: DEFAULT_WEEKDAY_SLOTS.map(formatTime12)
        }
      ];

  return (
    <div className="card p-6 md:p-7 space-y-5 border border-violet-500/20">
      <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
        <Clock size={18} className="text-violet-400" />
        <div>
          <h2 className="font-heading font-bold text-lg text-white">Weekly Office Hours Schedule</h2>
          <p className="text-xs text-slate-400">
            Define your availability windows. Our timetable engine automatically generates 30-minute bookable slot chips for students.
          </p>
        </div>
      </div>

      {/* Active Slots Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 block">Active Office Windows:</span>
        <div className="flex gap-2.5 flex-wrap">
          {slots.map((s, i) => (
            <span
              key={`${s.day}${s.start}${s.end}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300"
            >
              <span>{s.day}: {s.start}–{s.end}</span>
              <button
                type="button"
                className="text-rose-400 hover:text-rose-300 ml-1 font-sans font-bold"
                aria-label="Remove slot"
                onClick={() => saveSlots(slots.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </span>
          ))}
          {ready && !slots.length && (
            <span className="text-xs text-slate-400 italic">
              No custom office hours published yet. (Currently using default academic consultation slots: 10:00 AM – 03:30 PM).
            </span>
          )}
        </div>
      </div>

      {/* Add Slot Form */}
      <form
        className="flex gap-3 flex-wrap items-end pt-2 border-t border-white/5"
        onSubmit={(e) => {
          e.preventDefault();
          saveSlots([...slots, { day, start, end }]);
        }}
      >
        <label className="text-xs font-semibold text-slate-300">
          Weekday
          <select
            className="field mt-1 text-xs py-1.5 px-3"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-300">
          Start Time
          <input
            className="field mt-1 text-xs py-1.5 px-3"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </label>

        <label className="text-xs font-semibold text-slate-300">
          End Time
          <input
            className="field mt-1 text-xs py-1.5 px-3"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn-secondary text-xs font-bold px-4 py-2">
          <Plus size={14} />
          <span>Add Timetable Window</span>
        </button>
      </form>

      {/* Free Slots Live Breakdown for Faculty */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
          <span>Student Free Slots View Preview:</span>
          <span className="text-cyan-400 font-normal">30-min consultation intervals</span>
        </div>
        <div className="space-y-2">
          {generatedSlotsPreview.map((item, idx) => (
            <div key={idx} className="text-xs space-y-1.5">
              <span className="font-semibold text-slate-300">{item.day} ({item.window}):</span>
              <div className="flex flex-wrap gap-1.5">
                {item.subSlots.map((slotTime) => (
                  <span
                    key={slotTime}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10"
                  >
                    {slotTime}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {msg && (
        <p className={`text-xs ${bad ? 'text-rose-400' : 'text-lime-400'} pt-1`}>
          {msg}
        </p>
      )}
    </div>
  );
}
