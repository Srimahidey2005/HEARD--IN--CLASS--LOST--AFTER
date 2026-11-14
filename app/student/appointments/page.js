"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getAppointments,
  getFaculty,
  createAppointment,
  setAppointmentStatus,
  formatDate,
  todayLocal
} from '@/lib/dataService';
import {
  formatTime12,
  formatDateDisplay,
  getFacultySlotsForDate,
  getNextWorkingDateLocal,
  getUpcomingWorkingDays
} from '@/lib/timetable';
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  CalendarDays,
  Check,
  MapPin,
  Phone,
  Video,
  ChevronRight,
  Eye
} from 'lucide-react';
import AppointmentConfirmationModal from '@/components/AppointmentConfirmationModal';

export default function AppointmentsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading appointments workspace…</div>}>
      <StudentAppointmentsPage />
    </Suspense>
  );
}

function StudentAppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preFacultyId = searchParams.get('facultyId') || '';

  const upcomingWorkingDays = useMemo(() => getUpcomingWorkingDays(5), []);

  const [items, setItems] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({
    facultyId: preFacultyId,
    date: getNextWorkingDateLocal(),
    time: '11:30',
    reason: '',
    meetingType: 'In-person',
    meetingLocation: ''
  });
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cancellingId, setCancellingId] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const load = useCallback(async () => {
    try {
      const [a, f] = await Promise.all([
        getAppointments().catch((e) => {
          console.warn('Appointments fetch error:', e);
          return [];
        }),
        getFaculty().catch((e) => {
          console.warn('Faculty fetch error:', e);
          return [];
        })
      ]);

      setItems(Array.isArray(a) ? a : []);
      setFaculty(Array.isArray(f) ? f : []);

      // Default or preserve faculty selection
      if (Array.isArray(f) && f.length) {
        setForm((prev) => {
          const targetFacId = prev.facultyId || preFacultyId;
          const valid = f.some((x) => String(x._id) === String(targetFacId));
          return {
            ...prev,
            facultyId: valid ? targetFacId : f[0]._id
          };
        });
      }
    } catch (err) {
      setMsg(err.message || 'Failed to load appointments data');
      setIsError(true);
    }
  }, [preFacultyId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 12000);
    window.addEventListener('focus', load);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', load);
    };
  }, [load]);

  const selectedFaculty =
    faculty.find((x) => String(x._id) === String(form.facultyId)) ||
    faculty[0] ||
    null;

  // Compute live available slots based on faculty timetable and existing bookings
  const facultySlotsData = useMemo(() => {
    if (!selectedFaculty || !form.date) {
      return {
        slots: [],
        message: 'Please choose an appointment date to see available slots.'
      };
    }
    return getFacultySlotsForDate({
      faculty: selectedFaculty,
      date: form.date,
      existingAppointments: items
    });
  }, [selectedFaculty, form.date, items]);

  // Automatically select an available free slot (defaulting to 11:30 AM as per mockup if open)
  useEffect(() => {
    if (!facultySlotsData?.slots?.length) return;
    const currentValid = facultySlotsData.slots.find(
      (s) => s.time24 === form.time && !s.isBooked
    );
    if (!currentValid) {
      const prefSlot = facultySlotsData.slots.find((s) => s.time24 === '11:30' && !s.isBooked);
      const firstAvailable = facultySlotsData.slots.find((s) => !s.isBooked);
      if (prefSlot) {
        setForm((prev) => ({ ...prev, time: prefSlot.time24 }));
      } else if (firstAvailable) {
        setForm((prev) => ({ ...prev, time: firstAvailable.time24 }));
      }
    }
  }, [facultySlotsData?.slots, form.time]);

  async function cancel(id) {
    if (!confirm('Are you sure you want to cancel this appointment request?')) return;
    setCancellingId(id);
    try {
      await setAppointmentStatus(id, 'Cancelled');
      setMsg('Appointment request cancelled.');
      setIsError(false);
      await load();
    } catch (err) {
      setMsg(err.message || 'Could not cancel appointment.');
      setIsError(true);
    } finally {
      setCancellingId('');
    }
  }

  function change(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setIsError(false);

    const targetFacultyId = selectedFaculty?._id || form.facultyId;
    if (!targetFacultyId) {
      setMsg('Please select a faculty member.');
      setIsError(true);
      return;
    }

    if (!form.time) {
      setMsg('Please select one of the available free slots from the faculty schedule below.');
      setIsError(true);
      return;
    }

    setBusy(true);

    try {
      const created = await createAppointment({
        ...form,
        facultyId: targetFacultyId
      });
      setConfirmedAppointment({
        ...created,
        faculty: selectedFaculty,
        meetingType: form.meetingType,
        meetingLocation: form.meetingLocation,
        date: form.date,
        time: form.time,
        reason: form.reason
      });
      setMsg('Appointment request submitted successfully! Redirecting to your consultation pass…');
      setForm((prev) => ({
        ...prev,
        reason: ''
      }));
      await load();
      // Navigate to dedicated confirmation page matching mockup
      const targetId = created?._id ? String(created._id) : '';
      router.push(`/student/appointments/confirmed${targetId ? `?id=${targetId}` : ''}`);
    } catch (err) {
      setMsg(err.message || 'Failed to book appointment.');
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

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
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
          <Sparkles size={14} />
          Office Hours &amp; Timetable Consultations
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Academic Appointments
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-3xl">
          Browse faculty timetable availability, inspect their real-time free consultation slots, and book 1-on-1 academic meetings with instant clash prevention.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form (7 cols) */}
        <div className="lg:col-span-7 card p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">Book Consultation Slot</h2>
              <p className="text-xs text-slate-400">Slots are dynamically updated in accordance with the faculty timetable.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Faculty selection */}
            <label className="block text-sm font-semibold text-slate-300">
              Select Faculty Member
              <select
                className="field mt-1.5"
                name="facultyId"
                value={selectedFaculty?._id || form.facultyId}
                onChange={change}
                required
              >
                {faculty.map((x) => (
                  <option key={x._id} value={x._id}>
                    {x.name} {x.department ? `(${x.department})` : ''} · {(x.subjects || []).join(', ')}
                  </option>
                ))}
              </select>
            </label>

            {/* Faculty Availability & Free Slots Card (Mockup Style) */}
            {selectedFaculty ? (
              <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 space-y-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-1">
                      Faculty availability
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                      {selectedFaculty.name} ({selectedFaculty.department || 'CSE'})
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                      {(selectedFaculty.subjects || []).join(', ') || 'Data Structures & Algorithms'}
                    </p>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0D2418] text-[#34D399] border border-[#059669]/30 shrink-0">
                    Available
                  </span>
                </div>

                {/* Quick Date Selector Strip */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Consultation Date:</span>
                    <label className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                      <Calendar size={13} />
                      <span>Custom calendar ({form.date})</span>
                      <input
                        type="date"
                        name="date"
                        min={todayLocal()}
                        value={form.date}
                        onChange={change}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {upcomingWorkingDays.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, date: d.date }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                          form.date === d.date
                            ? 'bg-violet-600 text-white shadow-glow border border-violet-400'
                            : 'bg-[#171F35] text-slate-300 hover:bg-[#1E294B] border border-white/10'
                        }`}
                      >
                        {d.display}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Slots Section */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-sm md:text-base font-extrabold text-white tracking-tight">
                    Available slots · {form.date ? formatDateDisplay(form.date) : 'Choose date'}
                  </div>

                  {form.date ? (
                    facultySlotsData.slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                        {facultySlotsData.slots.map((slot) => {
                          const isSelected = form.time === slot.time24;
                          return (
                            <button
                              key={slot.time24}
                              type="button"
                              disabled={slot.isBooked}
                              onClick={() => setForm((prev) => ({ ...prev, time: slot.time24 }))}
                              className={`py-3.5 px-3 rounded-xl text-xs md:text-sm font-bold font-mono transition-all flex flex-col items-center justify-center gap-0.5 ${
                                slot.isBooked
                                  ? 'bg-white/[0.02] text-slate-600 border border-white/5 cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#1D1730] text-white border-2 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                                  : 'bg-[#1A2234] hover:bg-[#202B42] text-slate-200 border border-white/10 hover:border-white/20'
                              }`}
                            >
                              <span>{slot.time12}</span>
                              {slot.isBooked && (
                                <span className="text-[10px] text-rose-400 font-sans no-underline font-semibold">
                                  Booked
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed space-y-2">
                        <p>{facultySlotsData.message || 'No consultation slots available on this date. Please pick a working day.'}</p>
                        {facultySlotsData.isWeekend && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, date: getNextWorkingDateLocal() }))}
                            className="text-xs font-bold text-cyan-300 underline hover:text-cyan-200 block"
                          >
                            Switch to Monday, 16 November (Open Slots) →
                          </button>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
                      Select an appointment date above to inspect {selectedFaculty.name}&apos;s free timetable slots.
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 italic pt-1">
                    Illustrative available slots. Actual availability must come from the faculty schedule.
                  </p>
                </div>

                {/* Footer: Selected slot display */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm font-semibold">
                  <span className="text-slate-400">Selected slot</span>
                  <span className="font-heading font-extrabold text-base md:text-lg text-white">
                    {form.time ? formatTime12(form.time) : 'None selected'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-center py-8 text-slate-400 text-xs space-y-2">
                <Clock size={24} className="mx-auto text-slate-500" />
                <p>Loading faculty availability &amp; timetable slots…</p>
              </div>
            )}

            {/* Where Meetings Take Place (Location Card - Mockup Style) */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  Location
                </span>
                <h3 className="font-heading font-extrabold text-base md:text-lg text-white">
                  Where meetings take place
                </h3>
              </div>

              <div className="space-y-3">
                {/* In-person */}
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, meetingType: 'In-person' }))}
                  className={`w-full p-4 rounded-xl flex items-center justify-between text-left transition-all ${
                    form.meetingType === 'In-person'
                      ? 'bg-violet-950/40 border-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                      : 'bg-[#151C2C]/80 hover:bg-[#1A2338] border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">In-person</div>
                      <div className="text-xs text-slate-400 mt-0.5">Faculty Office / Department Cabin</div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'In-person'
                      ? 'bg-violet-500 text-white'
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    <ChevronRight size={18} />
                  </div>
                </button>

                {/* Phone call */}
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, meetingType: 'Phone call' }))}
                  className={`w-full p-4 rounded-xl flex items-center justify-between text-left transition-all ${
                    form.meetingType === 'Phone call'
                      ? 'bg-fuchsia-950/40 border-2 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.25)]'
                      : 'bg-[#151C2C]/80 hover:bg-[#1A2338] border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">Phone call</div>
                      <div className="text-xs text-slate-400 mt-0.5">Direct voice consultation via phone</div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'Phone call'
                      ? 'bg-fuchsia-500 text-white'
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    <ChevronRight size={18} />
                  </div>
                </button>

                {/* Virtual meeting */}
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, meetingType: 'Virtual meeting' }))}
                  className={`w-full p-4 rounded-xl flex items-center justify-between text-left transition-all ${
                    form.meetingType === 'Virtual meeting'
                      ? 'bg-emerald-950/40 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'bg-[#151C2C]/80 hover:bg-[#1A2338] border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Video size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">Virtual meeting</div>
                      <div className="text-xs text-slate-400 mt-0.5">Google Meet / Video conference link</div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'Virtual meeting'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>

              {/* Contextual location / contact details */}
              <div className="pt-1">
                {form.meetingType === 'In-person' && (
                  <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-violet-300 flex items-center gap-2">
                    <MapPin size={15} className="shrink-0 text-violet-400" />
                    <span>Meeting at faculty cabin: <strong className="text-white">{selectedFaculty?.department ? `${selectedFaculty.department} Department` : 'Campus Faculty Cabin'}</strong>. Cabin room number will be confirmed upon faculty approval.</span>
                  </div>
                )}
                {form.meetingType === 'Phone call' && (
                  <label className="block text-xs font-semibold text-slate-300 space-y-1">
                    <span>Contact Phone Number (Optional / to receive call):</span>
                    <input
                      type="tel"
                      name="meetingLocation"
                      value={form.meetingLocation}
                      onChange={change}
                      placeholder="+91 98765 43210"
                      className="field text-xs py-2"
                    />
                  </label>
                )}
                {form.meetingType === 'Virtual meeting' && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 flex items-center gap-2">
                    <Video size={15} className="shrink-0 text-emerald-400" />
                    <span>University Google Meet link will be automatically generated and shared in this portal once approved.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <label className="block text-sm font-semibold text-slate-300">
              Reason / Agenda for Meeting
              <textarea
                className="field mt-1.5 min-h-[90px]"
                name="reason"
                minLength={5}
                value={form.reason}
                onChange={change}
                required
                placeholder="What specific doubt, project review, or advice would you like to discuss?"
              />
            </label>

            {/* Feedback notification */}
            {msg && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${
                  isError
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-lime-500/10 border-lime-500/30 text-lime-300'
                }`}
              >
                {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                <span>{msg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-lime shadow-glow-lime w-full font-bold py-3 text-base flex items-center justify-center gap-2"
              disabled={!faculty.length || busy}
            >
              {busy ? (
                <>
                  <Sparkles size={18} className="animate-spin text-midnight" />
                  <span>Reserving Slot…</span>
                </>
              ) : (
                <>
                  <span>Book Consultation ({form.time ? formatTime12(form.time) : 'Select Slot'})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading font-bold text-lg text-white">Your Appointments</h2>
            <span className="text-xs font-mono text-slate-400">TOTAL: {items.length}</span>
          </div>

          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((a) => (
                <div
                  key={a._id}
                  className="card p-5 space-y-3 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        📅 {formatDate(a.date)} · ⏰ {formatTime12(a.time) || a.time}
                      </span>
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
                    <span className={`pill ${getStatusPillClass(a.status)}`}>
                      {a.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {a.reason}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Faculty: <strong className="text-slate-300">{a.faculty?.name || 'Faculty Member'}</strong>
                      {a.faculty?.department ? ` (${a.faculty.department})` : ''}
                    </p>
                  </div>

                  {a.query && (
                    <div className="text-xs text-violet-300 bg-violet-950/30 p-2.5 rounded-lg border border-violet-800/30 flex items-center gap-2">
                      <MessageSquare size={13} className="shrink-0" />
                      <span className="truncate">
                        Linked doubt: <strong>{a.query.title}</strong>
                      </span>
                    </div>
                  )}

                  {a.note && (
                    <div className="text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <strong className="text-cyan-400 block mb-0.5">Faculty Note:</strong>
                      &quot;{a.note}&quot;
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <Link
                      href={`/student/appointments/confirmed?id=${a._id}`}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={13} />
                      <span>View Pass</span>
                    </Link>

                    {['Pending', 'Rescheduled'].includes(a.status) && (
                      <button
                        onClick={() => cancel(a._id)}
                        disabled={cancellingId === a._id}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                      >
                        <XCircle size={14} />
                        <span>{cancellingId === a._id ? 'Cancelling…' : 'Cancel Request'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-8 text-center text-slate-400 space-y-2">
                <Calendar size={32} className="mx-auto text-slate-600" />
                <p className="text-sm">No appointments booked yet.</p>
                <p className="text-xs text-slate-500">
                  Select a faculty member and pick any available free slot to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Pass Modal (Mockup Style) */}
      {confirmedAppointment && (
        <AppointmentConfirmationModal
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
          onViewAppointment={() => setConfirmedAppointment(null)}
        />
      )}
    </div>
  );
}
