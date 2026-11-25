"use client";

<<<<<<< HEAD
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
=======
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
  Eye,
  GraduationCap,
  BookOpen,
  Filter
} from 'lucide-react';
import AppointmentConfirmationModal from '@/components/AppointmentConfirmationModal';
import { ACADEMIC_PROGRAMS, parseCourseString } from '@/lib/courses';
=======
  Eye
} from 'lucide-react';
import AppointmentConfirmationModal from '@/components/AppointmentConfirmationModal';
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2

export default function AppointmentsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading appointments workspace…</div>}>
      <StudentAppointmentsPage />
    </Suspense>
  );
}

<<<<<<< HEAD
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

=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
function StudentAppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preFacultyId = searchParams.get('facultyId') || '';

  const upcomingWorkingDays = useMemo(() => getUpcomingWorkingDays(5), []);

  const [items, setItems] = useState([]);
  const [faculty, setFaculty] = useState([]);
<<<<<<< HEAD
  const hasInitializedBranch = useRef(false);

  // Discipline, Branch & Subject Selection
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering (CSE)');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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

<<<<<<< HEAD
      // Auto-initialize branch & course from student profile if available
      if (f?.currentUser?.course && !hasInitializedBranch.current) {
        const parsed = parseCourseString(f.currentUser.course);
        if (parsed.selectedCourse) setSelectedCourse(parsed.selectedCourse);
        if (parsed.selectedBranch) setSelectedBranch(parsed.selectedBranch);
        hasInitializedBranch.current = true;
      }

=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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

<<<<<<< HEAD
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
=======
  const selectedFaculty =
    faculty.find((x) => String(x._id) === String(form.facultyId)) ||
    faculty[0] ||
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A99AEF] font-bold mb-1">
          <Sparkles size={14} />
          Office Hours &amp; Timetable Consultations
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Academic Appointments
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed max-w-3xl">
=======
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
          <Sparkles size={14} />
          Office Hours &amp; Timetable Consultations
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Academic Appointments
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-3xl">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          Browse faculty timetable availability, inspect their real-time free consultation slots, and book 1-on-1 academic meetings with instant clash prevention.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form (7 cols) */}
        <div className="lg:col-span-7 card p-6 md:p-8 space-y-6">
<<<<<<< HEAD
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-card)]">
            <div className="p-2.5 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Book Consultation Slot</h2>
              <p className="text-xs text-[var(--text-secondary)]">Slots are dynamically updated in accordance with the faculty timetable.</p>
=======
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">Book Consultation Slot</h2>
              <p className="text-xs text-slate-400">Slots are dynamically updated in accordance with the faculty timetable.</p>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
<<<<<<< HEAD
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
=======
            {/* Faculty selection */}
            <label className="block text-sm font-semibold text-slate-300">
              Select Faculty Member
              <select
                className="field mt-1.5"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                name="facultyId"
                value={selectedFaculty?._id || form.facultyId}
                onChange={change}
                required
              >
<<<<<<< HEAD
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
=======
                {faculty.map((x) => (
                  <option key={x._id} value={x._id}>
                    {x.name} {x.department ? `(${x.department})` : ''} · {(x.subjects || []).join(', ')}
                  </option>
                ))}
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
              </select>
            </label>

            {/* Faculty Availability & Free Slots Card (Mockup Style) */}
            {selectedFaculty ? (
<<<<<<< HEAD
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
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      {(selectedFaculty.subjects || []).join(', ') || 'Data Structures & Algorithms'}
                    </p>
                  </div>

<<<<<<< HEAD
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30 shrink-0">
=======
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0D2418] text-[#34D399] border border-[#059669]/30 shrink-0">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    Available
                  </span>
                </div>

                {/* Quick Date Selector Strip */}
<<<<<<< HEAD
                <div className="pt-2 border-t border-[var(--border-card)] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)]">Consultation Date:</span>
                    <label className="text-[#A99AEF] hover:text-[#C6B9FF] cursor-pointer flex items-center gap-1 font-mono text-[11px]">
=======
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Consultation Date:</span>
                    <label className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 font-mono text-[11px]">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
                            ? 'bg-[#A99AEF] text-black border border-[#A99AEF]'
                            : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-card)]'
=======
                            ? 'bg-violet-600 text-white shadow-glow border border-violet-400'
                            : 'bg-[#171F35] text-slate-300 hover:bg-[#1E294B] border border-white/10'
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        }`}
                      >
                        {d.display}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Slots Section */}
<<<<<<< HEAD
                <div className="space-y-3 pt-2 border-t border-[var(--border-card)]">
                  <div className="text-sm md:text-base font-extrabold text-[var(--text-primary)] tracking-tight">
=======
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-sm md:text-base font-extrabold text-white tracking-tight">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
                                  ? 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-card)] cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#A99AEF] text-black border-2 border-[#A99AEF]'
                                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-card)] hover:border-[#A99AEF]'
=======
                                  ? 'bg-white/[0.02] text-slate-600 border border-white/5 cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#1D1730] text-white border-2 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                                  : 'bg-[#1A2234] hover:bg-[#202B42] text-slate-200 border border-white/10 hover:border-white/20'
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                              }`}
                            >
                              <span>{slot.time12}</span>
                              {slot.isBooked && (
<<<<<<< HEAD
                                <span className="text-[10px] text-rose-500 font-sans no-underline font-semibold">
=======
                                <span className="text-[10px] text-rose-400 font-sans no-underline font-semibold">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                                  Booked
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
<<<<<<< HEAD
                      <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-secondary)] text-xs leading-relaxed space-y-2">
=======
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed space-y-2">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        <p>{facultySlotsData.message || 'No consultation slots available on this date. Please pick a working day.'}</p>
                        {facultySlotsData.isWeekend && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, date: getNextWorkingDateLocal() }))}
<<<<<<< HEAD
                            className="text-xs font-bold text-[#A99AEF] underline hover:text-[#C6B9FF] block"
=======
                            className="text-xs font-bold text-cyan-300 underline hover:text-cyan-200 block"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                          >
                            Switch to Monday, 16 November (Open Slots) →
                          </button>
                        )}
                      </div>
                    )
                  ) : (
<<<<<<< HEAD
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-secondary)] text-xs">
=======
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      Select an appointment date above to inspect {selectedFaculty.name}&apos;s free timetable slots.
                    </div>
                  )}

<<<<<<< HEAD
                  <p className="text-[11px] text-[var(--text-muted)] italic pt-1">
=======
                  <p className="text-[11px] text-slate-500 italic pt-1">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    Illustrative available slots. Actual availability must come from the faculty schedule.
                  </p>
                </div>

                {/* Footer: Selected slot display */}
<<<<<<< HEAD
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-card)] text-sm font-semibold">
                  <span className="text-[var(--text-secondary)]">Selected slot</span>
                  <span className="font-heading font-extrabold text-base md:text-lg text-[var(--text-primary)]">
=======
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm font-semibold">
                  <span className="text-slate-400">Selected slot</span>
                  <span className="font-heading font-extrabold text-base md:text-lg text-white">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    {form.time ? formatTime12(form.time) : 'None selected'}
                  </span>
                </div>
              </div>
            ) : (
<<<<<<< HEAD
              <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-center py-8 text-[var(--text-secondary)] text-xs space-y-2">
                <Clock size={24} className="mx-auto text-[var(--text-secondary)]" />
=======
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-center py-8 text-slate-400 text-xs space-y-2">
                <Clock size={24} className="mx-auto text-slate-500" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                <p>Loading faculty availability &amp; timetable slots…</p>
              </div>
            )}

<<<<<<< HEAD
            {/* Where Meetings Take Place (Location Card - Clean Black, White & Lavender) */}
            <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
                  Location
                </span>
                <h3 className="font-heading font-extrabold text-base md:text-lg text-[var(--text-primary)]">
=======
            {/* Where Meetings Take Place (Location Card - Mockup Style) */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  Location
                </span>
                <h3 className="font-heading font-extrabold text-base md:text-lg text-white">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'In-person'
<<<<<<< HEAD
                      ? 'bg-[#A99AEF] text-black font-bold'
                      : 'bg-[var(--bg-main)] text-[var(--text-secondary)]'
=======
                      ? 'bg-violet-500 text-white'
                      : 'bg-white/5 text-slate-400'
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'Phone call'
<<<<<<< HEAD
                      ? 'bg-[#A99AEF] text-black font-bold'
                      : 'bg-[var(--bg-main)] text-[var(--text-secondary)]'
=======
                      ? 'bg-fuchsia-500 text-white'
                      : 'bg-white/5 text-slate-400'
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    form.meetingType === 'Virtual meeting'
<<<<<<< HEAD
                      ? 'bg-[#A99AEF] text-black font-bold'
                      : 'bg-[var(--bg-main)] text-[var(--text-secondary)]'
=======
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 text-slate-400'
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                  }`}>
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>

              {/* Contextual location / contact details */}
              <div className="pt-1">
                {form.meetingType === 'In-person' && (
<<<<<<< HEAD
                  <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
                    <MapPin size={15} className="shrink-0 text-[#A99AEF]" />
                    <span>Meeting at faculty cabin: <strong className="text-[var(--text-primary)]">{selectedFaculty?.department ? `${selectedFaculty.department} Department` : 'Campus Faculty Cabin'}</strong>. Cabin room number will be confirmed upon faculty approval.</span>
                  </div>
                )}
                {form.meetingType === 'Phone call' && (
                  <label className="block text-xs font-semibold text-[var(--text-primary)] space-y-1">
=======
                  <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-violet-300 flex items-center gap-2">
                    <MapPin size={15} className="shrink-0 text-violet-400" />
                    <span>Meeting at faculty cabin: <strong className="text-white">{selectedFaculty?.department ? `${selectedFaculty.department} Department` : 'Campus Faculty Cabin'}</strong>. Cabin room number will be confirmed upon faculty approval.</span>
                  </div>
                )}
                {form.meetingType === 'Phone call' && (
                  <label className="block text-xs font-semibold text-slate-300 space-y-1">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
                  <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
                    <Video size={15} className="shrink-0 text-[#A99AEF]" />
=======
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 flex items-center gap-2">
                    <Video size={15} className="shrink-0 text-emerald-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    <span>University Google Meet link will be automatically generated and shared in this portal once approved.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
<<<<<<< HEAD
            <label className="block text-sm font-semibold text-[var(--text-primary)]">
=======
            <label className="block text-sm font-semibold text-slate-300">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'bg-[#A99AEF]/15 border-[#A99AEF]/30 text-[var(--text-primary)]'
                }`}
              >
                {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-[#A99AEF]" />}
=======
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-lime-500/10 border-lime-500/30 text-lime-300'
                }`}
              >
                {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                <span>{msg}</span>
              </div>
            )}

            <button
              type="submit"
<<<<<<< HEAD
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
=======
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
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                </>
              )}
            </button>
          </form>
        </div>

        {/* Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
<<<<<<< HEAD
            <h2 className="font-heading font-bold text-lg text-[var(--text-primary)]">Your Appointments</h2>
            <span className="text-xs font-mono text-[var(--text-secondary)]">TOTAL: {items.length}</span>
=======
            <h2 className="font-heading font-bold text-lg text-white">Your Appointments</h2>
            <span className="text-xs font-mono text-slate-400">TOTAL: {items.length}</span>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          </div>

          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((a) => (
                <div
                  key={a._id}
<<<<<<< HEAD
                  className="card p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono text-[#A99AEF] bg-[#A99AEF]/10 px-2 py-0.5 rounded border border-[#A99AEF]/30">
=======
                  className="card p-5 space-y-3 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                        📅 {formatDate(a.date)} · ⏰ {formatTime12(a.time) || a.time}
                      </span>
                      {(() => {
                        const mt = String(a.meetingType || '').toLowerCase();
                        if (mt.includes('phone')) {
                          return (
<<<<<<< HEAD
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-[var(--bg-elevated)] border-[var(--border-card)] text-[var(--text-secondary)] font-semibold">
                              <Phone size={11} className="text-[#A99AEF]" />
=======
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-fuchsia-950/40 border-fuchsia-500/40 text-fuchsia-300 font-semibold shadow-sm">
                              <Phone size={11} className="text-fuchsia-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                              <span>Phone call</span>
                            </span>
                          );
                        }
                        if (mt.includes('virtual') || mt.includes('meet') || mt.includes('video') || mt.includes('online')) {
                          return (
<<<<<<< HEAD
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-[var(--bg-elevated)] border-[var(--border-card)] text-[var(--text-secondary)] font-semibold">
                              <Video size={11} className="text-[#A99AEF]" />
=======
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-semibold shadow-sm">
                              <Video size={11} className="text-emerald-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                              <span>Virtual meet</span>
                            </span>
                          );
                        }
                        return (
<<<<<<< HEAD
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-[var(--bg-elevated)] border-[var(--border-card)] text-[var(--text-secondary)] font-semibold">
                            <MapPin size={11} className="text-[#A99AEF]" />
=======
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 bg-violet-950/40 border-violet-500/40 text-violet-300 font-semibold shadow-sm">
                            <MapPin size={11} className="text-violet-400" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                      {a.reason}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Faculty: <strong className="text-[var(--text-primary)]">{a.faculty?.name || 'Faculty Member'}</strong>
=======
                    <h3 className="font-semibold text-white text-sm">
                      {a.reason}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Faculty: <strong className="text-slate-300">{a.faculty?.name || 'Faculty Member'}</strong>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      {a.faculty?.department ? ` (${a.faculty.department})` : ''}
                    </p>
                  </div>

                  {a.query && (
<<<<<<< HEAD
                    <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-main)] p-2.5 rounded-lg border border-[var(--border-card)] flex items-center gap-2">
                      <MessageSquare size={13} className="shrink-0 text-[#A99AEF]" />
                      <span className="truncate">
                        Linked doubt: <strong className="text-[var(--text-primary)]">{a.query.title}</strong>
=======
                    <div className="text-xs text-violet-300 bg-violet-950/30 p-2.5 rounded-lg border border-violet-800/30 flex items-center gap-2">
                      <MessageSquare size={13} className="shrink-0" />
                      <span className="truncate">
                        Linked doubt: <strong>{a.query.title}</strong>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      </span>
                    </div>
                  )}

                  {a.note && (
<<<<<<< HEAD
                    <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-main)] p-2.5 rounded-lg border border-[var(--border-card)]">
                      <strong className="text-[#A99AEF] block mb-0.5">Faculty Note:</strong>
=======
                    <div className="text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <strong className="text-cyan-400 block mb-0.5">Faculty Note:</strong>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      &quot;{a.note}&quot;
                    </div>
                  )}

<<<<<<< HEAD
                  <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between gap-2">
                    <Link
                      href={`/student/appointments/confirmed?id=${a._id}`}
                      className="text-xs text-[#A99AEF] hover:text-[#C6B9FF] font-semibold flex items-center gap-1.5 transition-colors"
=======
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <Link
                      href={`/student/appointments/confirmed?id=${a._id}`}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                    >
                      <Eye size={13} />
                      <span>View Pass</span>
                    </Link>

                    {['Pending', 'Rescheduled'].includes(a.status) && (
                      <button
                        onClick={() => cancel(a._id)}
                        disabled={cancellingId === a._id}
<<<<<<< HEAD
                        className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1 font-semibold"
=======
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                      >
                        <XCircle size={14} />
                        <span>{cancellingId === a._id ? 'Cancelling…' : 'Cancel Request'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
<<<<<<< HEAD
              <div className="card p-8 text-center text-[var(--text-secondary)] space-y-2">
                <Calendar size={32} className="mx-auto text-[var(--text-secondary)]" />
                <p className="text-sm">No appointments booked yet.</p>
                <p className="text-xs text-[var(--text-muted)]">
=======
              <div className="card p-8 text-center text-slate-400 space-y-2">
                <Calendar size={32} className="mx-auto text-slate-600" />
                <p className="text-sm">No appointments booked yet.</p>
                <p className="text-xs text-slate-500">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
