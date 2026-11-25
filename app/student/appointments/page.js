"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Eye,
  GraduationCap,
  BookOpen,
  Filter
} from 'lucide-react';
import AppointmentConfirmationModal from '@/components/AppointmentConfirmationModal';
import { ACADEMIC_PROGRAMS, parseCourseString } from '@/lib/courses';

export default function AppointmentsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading appointments workspace…</div>}>
      <StudentAppointmentsPage />
    </Suspense>
  );
}

function matchesBranch(f, selectedBranch = '', selectedCourse = '') {
  const bNorm = String(selectedBranch || '').toLowerCase();
  const cNorm = String(selectedCourse || '').toLowerCase();
  const dept = String(f.department || '').toLowerCase();
  const fCourses = (f.courses || []).map((c) => String(c).toLowerCase());

  const isCse =
    bNorm.includes('cse') ||
    bNorm.includes('computer science') ||
    bNorm.includes('information technology') ||
    bNorm.includes('it') ||
    bNorm.includes('software');

  const isBusiness =
    bNorm.includes('mba') ||
    bNorm.includes('bba') ||
    bNorm.includes('management') ||
    bNorm.includes('finance') ||
    bNorm.includes('human resource') ||
    bNorm.includes('commerce') ||
    cNorm.includes('mba') ||
    cNorm.includes('bba') ||
    cNorm.includes('b.com') ||
    cNorm.includes('m.com');

  const isMech = bNorm.includes('mech') || bNorm.includes('automobile');
  const isCivil = bNorm.includes('civil') || bNorm.includes('struct');
  const isEce = bNorm.includes('electronics') || bNorm.includes('ece') || bNorm.includes('electrical');

  if (isCse) {
    // Strictly exclude non-CSE departments (Finance, Management, HR, Mechanical, Civil, etc.)
    if (
      dept.includes('mba') ||
      dept.includes('bba') ||
      dept.includes('management') ||
      dept.includes('finance') ||
      dept.includes('mechanical') ||
      dept.includes('civil') ||
      dept.includes('msc')
    ) {
      return false;
    }
    return (
      dept.includes('cse') ||
      dept.includes('computer') ||
      dept.includes('it') ||
      fCourses.some((c) =>
        c.includes('cse') ||
        c.includes('btech') ||
        c.includes('b.tech') ||
        c.includes('bca') ||
        c.includes('mca') ||
        c.includes('computer')
      )
    );
  }

  if (isBusiness) {
    return (
      dept.includes('mba') ||
      dept.includes('bba') ||
      dept.includes('management') ||
      dept.includes('finance') ||
      dept.includes('commerce') ||
      fCourses.some((c) =>
        c.includes('mba') ||
        c.includes('bba') ||
        c.includes('b.com') ||
        c.includes('m.com') ||
        c.includes('finance')
      )
    );
  }

  if (isMech) {
    return (
      dept.includes('mech') ||
      dept.includes('automobile') ||
      fCourses.some((c) => c.includes('mech') || c.includes('automobile'))
    );
  }

  if (isCivil) {
    return (
      dept.includes('civil') ||
      dept.includes('struct') ||
      fCourses.some((c) => c.includes('civil') || c.includes('struct'))
    );
  }

  if (isEce) {
    return (
      dept.includes('ece') ||
      dept.includes('electronics') ||
      dept.includes('electrical') ||
      fCourses.some((c) => c.includes('ece') || c.includes('electronics'))
    );
  }

  return (
    dept.includes(bNorm) ||
    bNorm.includes(dept) ||
    fCourses.some((c) => c.includes(cNorm) || cNorm.includes(c))
  );
}

function matchesSubject(f, selectedSubject) {
  if (!selectedSubject || selectedSubject === 'ALL') return true;
  const sNorm = String(selectedSubject).toLowerCase().trim();
  return (f.subjects || []).some((sub) => {
    const subNorm = String(sub).toLowerCase().trim();
    return subNorm.includes(sNorm) || sNorm.includes(subNorm);
  });
}

function StudentAppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preFacultyId = searchParams.get('facultyId') || '';

  const upcomingWorkingDays = useMemo(() => getUpcomingWorkingDays(5), []);

  const [items, setItems] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const hasInitializedBranch = useRef(false);

  // Discipline, Branch & Subject Selection
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering (CSE)');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

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

      // Auto-initialize branch & course from student profile if available
      if (f?.currentUser?.course && !hasInitializedBranch.current) {
        const parsed = parseCourseString(f.currentUser.course);
        if (parsed.selectedCourse) setSelectedCourse(parsed.selectedCourse);
        if (parsed.selectedBranch) setSelectedBranch(parsed.selectedBranch);
        hasInitializedBranch.current = true;
      }

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

  // Active program & branches list
  const currentProg =
    ACADEMIC_PROGRAMS.find((p) => p.course === selectedCourse) ||
    ACADEMIC_PROGRAMS[0];
  const availableBranches = currentProg ? currentProg.branches : ['Other'];

  const handleCourseChange = (newCourse) => {
    setSelectedCourse(newCourse);
    const prog = ACADEMIC_PROGRAMS.find((p) => p.course === newCourse);
    if (prog) {
      setSelectedBranch(prog.defaultBranch);
    } else {
      setSelectedBranch('General Specialization');
    }
    setSelectedSubject('ALL');
  };

  const handleBranchChange = (newBranch) => {
    setSelectedBranch(newBranch);
    setSelectedSubject('ALL');
  };

  // 1. Filter faculty belonging strictly to the selected branch and course
  const branchFaculty = useMemo(() => {
    return faculty.filter((f) => matchesBranch(f, selectedBranch, selectedCourse));
  }, [faculty, selectedBranch, selectedCourse]);

  // 2. Derive available subjects dynamically from the branch faculty
  const availableSubjects = useMemo(() => {
    const subs = new Set();
    branchFaculty.forEach((f) => {
      (f.subjects || []).forEach((s) => {
        if (s && s.trim()) subs.add(s.trim());
      });
    });
    return Array.from(subs).sort();
  }, [branchFaculty]);

  // 3. Filter faculty further by selected subject
  const filteredFaculty = useMemo(() => {
    if (!selectedSubject || selectedSubject === 'ALL') {
      return branchFaculty;
    }
    const matched = branchFaculty.filter((f) => matchesSubject(f, selectedSubject));
    return matched.length > 0 ? matched : branchFaculty;
  }, [branchFaculty, selectedSubject]);

  // 4. Ensure form.facultyId stays in sync with filteredFaculty
  useEffect(() => {
    if (!filteredFaculty.length) return;
    const currentStillValid = filteredFaculty.some((x) => String(x._id) === String(form.facultyId));
    if (!currentStillValid) {
      setForm((prev) => ({ ...prev, facultyId: filteredFaculty[0]._id }));
    }
  }, [filteredFaculty, form.facultyId]);

  const selectedFaculty =
    filteredFaculty.find((x) => String(x._id) === String(form.facultyId)) ||
    filteredFaculty[0] ||
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
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A99AEF] font-bold mb-1">
          <Sparkles size={14} />
          Office Hours &amp; Timetable Consultations
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Academic Appointments
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed max-w-3xl">
          Browse faculty timetable availability, inspect their real-time free consultation slots, and book 1-on-1 academic meetings with instant clash prevention.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form (7 cols) */}
        <div className="lg:col-span-7 card p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-card)]">
            <div className="p-2.5 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Book Consultation Slot</h2>
              <p className="text-xs text-[var(--text-secondary)]">Slots are dynamically updated in accordance with the faculty timetable.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Academic Discipline & Subject Filter */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-card)]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A99AEF] font-bold">
                  <GraduationCap size={16} />
                  <span>Academic Discipline &amp; Subject Specialization</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
                  {filteredFaculty.length} {filteredFaculty.length === 1 ? 'Faculty Member' : 'Faculty Members'} Available
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {/* 1. Degree / Program */}
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-secondary)] mb-1">
                    <BookOpen size={13} className="text-[#A99AEF]" />
                    <span>1. Degree / Program</span>
                  </span>
                  <select
                    className="field text-xs py-2"
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                  >
                    {ACADEMIC_PROGRAMS.map((prog) => (
                      <option key={prog.course} value={prog.course}>
                        {prog.course}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 2. Branch / Track */}
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-secondary)] mb-1">
                    <Filter size={13} className="text-[#A99AEF]" />
                    <span>2. Branch / Specialization</span>
                  </span>
                  <select
                    className="field text-xs py-2"
                    value={selectedBranch}
                    onChange={(e) => handleBranchChange(e.target.value)}
                  >
                    {availableBranches.map((br) => (
                      <option key={br} value={br}>
                        {br}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 3. Subject Filter */}
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-secondary)] mb-1">
                    <BookOpen size={13} className="text-[#A99AEF]" />
                    <span>3. Subject / Doubt Topic</span>
                  </span>
                  <select
                    className="field text-xs py-2"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="ALL">All Subjects in Branch ({availableSubjects.length})</option>
                    {availableSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Filtering Reassurance Notice */}
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-main)] border border-[var(--border-card)] px-3 py-2 rounded-xl">
                <CheckCircle2 size={13} className="text-[#A99AEF] shrink-0" />
                <span>
                  Showing verified faculty teaching in <strong className="text-[var(--text-primary)]">{selectedBranch}</strong>. Other degrees (e.g. Finance, Human Resources, Civil) are filtered out.
                </span>
              </div>
            </div>

            {/* Faculty selection */}
            <label className="block text-sm font-semibold text-[var(--text-primary)]">
              <div className="flex items-center justify-between mb-1.5">
                <span>Select Faculty Member</span>
                <span className="text-xs font-normal text-[var(--text-secondary)]">
                  {selectedSubject !== 'ALL' ? (
                    <span className="text-[#A99AEF] font-mono">Specialist in {selectedSubject}</span>
                  ) : (
                    <span>Branch: {selectedBranch.includes('CSE') ? 'CSE' : selectedBranch}</span>
                  )}
                </span>
              </div>
              <select
                className="field mt-1"
                name="facultyId"
                value={selectedFaculty?._id || form.facultyId}
                onChange={change}
                required
              >
                {filteredFaculty.length > 0 ? (
                  filteredFaculty.map((x) => (
                    <option key={x._id} value={x._id}>
                      {x.name} ({x.department || 'CSE'}) · {(x.subjects || []).join(', ')}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No faculty available for this branch &amp; subject combination
                  </option>
                )}
              </select>
            </label>

            {/* Faculty Availability & Free Slots Card (Mockup Style) */}
            {selectedFaculty ? (
              <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Faculty availability
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      {selectedFaculty.name} ({selectedFaculty.department || 'CSE'})
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-0.5">
                      {(selectedFaculty.subjects || []).join(', ') || 'Data Structures & Algorithms'}
                    </p>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30 shrink-0">
                    Available
                  </span>
                </div>

                {/* Quick Date Selector Strip */}
                <div className="pt-2 border-t border-[var(--border-card)] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)]">Consultation Date:</span>
                    <label className="text-[#A99AEF] hover:text-[#C6B9FF] cursor-pointer flex items-center gap-1 font-mono text-[11px]">
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
                            ? 'bg-[#A99AEF] text-black border border-[#A99AEF]'
                            : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-card)]'
                        }`}
                      >
                        {d.display}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Slots Section */}
                <div className="space-y-3 pt-2 border-t border-[var(--border-card)]">
                  <div className="text-sm md:text-base font-extrabold text-[var(--text-primary)] tracking-tight">
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
                                  ? 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-card)] cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#A99AEF] text-black border-2 border-[#A99AEF]'
                                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-card)] hover:border-[#A99AEF]'
                              }`}
                            >
                              <span>{slot.time12}</span>
                              {slot.isBooked && (
                                <span className="text-[10px] text-rose-500 font-sans no-underline font-semibold">
                                  Booked
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-secondary)] text-xs leading-relaxed space-y-2">
                        <p>{facultySlotsData.message || 'No consultation slots available on this date. Please pick a working day.'}</p>
                        {facultySlotsData.isWeekend && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, date: getNextWorkingDateLocal() }))}
                            className="text-xs font-bold text-[#A99AEF] underline hover:text-[#C6B9FF] block"
                          >
                            Switch to Monday, 16 November (Open Slots) →
                          </button>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-secondary)] text-xs">
                      Select an appointment date above to inspect {selectedFaculty.name}&apos;s free timetable slots.
                    </div>
                  )}

                  <p className="text-[11px] text-[var(--text-muted)] italic pt-1">
                    Illustrative available slots. Actual availability must come from the faculty schedule.
                  </p>
                </div>

                {/* Footer: Selected slot display */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-card)] text-sm font-semibold">
                  <span className="text-[var(--text-secondary)]">Selected slot</span>
                  <span className="font-heading font-extrabold text-base md:text-lg text-[var(--text-primary)]">
                    {form.time ? formatTime12(form.time) : 'None selected'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-center py-8 text-[var(--text-secondary)] text-xs space-y-2">
                <Clock size={24} className="mx-auto text-[var(--text-secondary)]" />
                <p>Loading faculty availability &amp; timetable slots…</p>
              </div>
            )}

            {/* Where Meetings Take Place (Location Card - Clean Black, White & Lavender) */}
            <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
                  Location
                </span>
                <h3 className="font-heading font-extrabold text-base md:text-lg text-[var(--text-primary)]">
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
                      ? 'bg-[#A99AEF]/15 border-2 border-[#A99AEF]'
                      : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-card)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#A99AEF]/15 border border-[#A99AEF]/30 flex items-center justify-center text-[#A99AEF] shrink-0">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-base">In-person</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">Faculty Office / Department Cabin</div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'In-person'
                      ? 'bg-[#A99AEF] text-black font-bold'
                      : 'bg-[var(--bg-main)] text-[var(--text-secondary)]'
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
                      ? 'bg-[#A99AEF]/15 border-2 border-[#A99AEF]'
                      : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-card)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#A99AEF]/15 border border-[#A99AEF]/30 flex items-center justify-center text-[#A99AEF] shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-base">Phone call</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">Direct voice consultation via phone</div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'Phone call'
                      ? 'bg-[#A99AEF] text-black font-bold'
                      : 'bg-[var(--bg-main)] text-[var(--text-secondary)]'
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
                      ? 'bg-[#A99AEF]/15 border-2 border-[#A99AEF]'
                      : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-card)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#A99AEF]/15 border border-[#A99AEF]/30 flex items-center justify-center text-[#A99AEF] shrink-0">
                      <Video size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-base">Virtual meeting</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">Google Meet / Video conference link</div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'Virtual meeting'
                      ? 'bg-[#A99AEF] text-black font-bold'
                      : 'bg-[var(--bg-main)] text-[var(--text-secondary)]'
                  }`}>
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>

              {/* Contextual location / contact details */}
              <div className="pt-1">
                {form.meetingType === 'In-person' && (
                  <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
                    <MapPin size={15} className="shrink-0 text-[#A99AEF]" />
                    <span>Meeting at faculty cabin: <strong className="text-[var(--text-primary)]">{selectedFaculty?.department ? `${selectedFaculty.department} Department` : 'Campus Faculty Cabin'}</strong>. Cabin room number will be confirmed upon faculty approval.</span>
                  </div>
                )}
                {form.meetingType === 'Phone call' && (
                  <label className="block text-xs font-semibold text-[var(--text-primary)] space-y-1">
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
                  <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
                    <Video size={15} className="shrink-0 text-[#A99AEF]" />
                    <span>University Google Meet link will be automatically generated and shared in this portal once approved.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'bg-[#A99AEF]/15 border-[#A99AEF]/30 text-[var(--text-primary)]'
                }`}
              >
                {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-[#A99AEF]" />}
                <span>{msg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
              disabled={!filteredFaculty.length || busy}
            >
              {busy ? (
                <>
                  <Sparkles size={18} className="animate-spin text-black" />
                  <span className="text-black font-bold">Reserving Slot…</span>
                </>
              ) : (
                <>
                  <span className="text-black font-bold">Book Consultation ({form.time ? formatTime12(form.time) : 'Select Slot'})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Your Appointments</h2>
            <span className="text-xs font-mono text-[var(--text-secondary)]">TOTAL: {items.length}</span>
          </div>

          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((a) => (
                <div
                  key={a._id}
                  className="card p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono text-[#A99AEF] bg-[#A99AEF]/10 px-2 py-0.5 rounded border border-[#A99AEF]/30">
                        📅 {formatDate(a.date)} · ⏰ {formatTime12(a.time) || a.time}
                      </span>
                      {(() => {
                        const mt = String(a.meetingType || '').toLowerCase();
                        if (mt.includes('phone')) {
                          return (
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-[var(--bg-elevated)] border-[var(--border-card)] text-[var(--text-secondary)] font-semibold">
                              <Phone size={11} className="text-[#A99AEF]" />
                              <span>Phone call</span>
                            </span>
                          );
                        }
                        if (mt.includes('virtual') || mt.includes('meet') || mt.includes('video') || mt.includes('online')) {
                          return (
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-[var(--bg-elevated)] border-[var(--border-card)] text-[var(--text-secondary)] font-semibold">
                              <Video size={11} className="text-[#A99AEF]" />
                              <span>Virtual meet</span>
                            </span>
                          );
                        }
                        return (
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-[var(--bg-elevated)] border-[var(--border-card)] text-[var(--text-secondary)] font-semibold">
                            <MapPin size={11} className="text-[#A99AEF]" />
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
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                      {a.reason}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Faculty: <strong className="text-[var(--text-primary)]">{a.faculty?.name || 'Faculty Member'}</strong>
                      {a.faculty?.department ? ` (${a.faculty.department})` : ''}
                    </p>
                  </div>

                  {a.query && (
                    <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-main)] p-2.5 rounded-lg border border-[var(--border-card)] flex items-center gap-2">
                      <MessageSquare size={13} className="shrink-0 text-[#A99AEF]" />
                      <span className="truncate">
                        Linked doubt: <strong className="text-[var(--text-primary)]">{a.query.title}</strong>
                      </span>
                    </div>
                  )}

                  {a.note && (
                    <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-main)] p-2.5 rounded-lg border border-[var(--border-card)]">
                      <strong className="text-[#A99AEF] block mb-0.5">Faculty Note:</strong>
                      &quot;{a.note}&quot;
                    </div>
                  )}

                  <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between gap-2">
                    <Link
                      href={`/student/appointments/confirmed?id=${a._id}`}
                      className="text-xs text-[#A99AEF] hover:text-[#C6B9FF] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={13} />
                      <span>View Pass</span>
                    </Link>

                    {['Pending', 'Rescheduled'].includes(a.status) && (
                      <button
                        onClick={() => cancel(a._id)}
                        disabled={cancellingId === a._id}
                        className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1 font-semibold"
                      >
                        <XCircle size={14} />
                        <span>{cancellingId === a._id ? 'Cancelling…' : 'Cancel Request'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-8 text-center text-[var(--text-secondary)] space-y-2">
                <Calendar size={32} className="mx-auto text-[var(--text-secondary)]" />
                <p className="text-sm">No appointments booked yet.</p>
                <p className="text-xs text-[var(--text-muted)]">
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
