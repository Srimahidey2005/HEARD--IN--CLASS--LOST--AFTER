"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  CalendarPlus,
  Home,
  Eye,
  Info,
  Bell,
  MapPin,
  Phone,
  Video
} from 'lucide-react';
import {
  formatDateDisplay,
  formatTimeWindow,
  getGoogleCalendarUrl
} from '@/lib/timetable';

export default function AppointmentConfirmationModal({ appointment, onClose, onViewAppointment }) {
  const [copied, setCopied] = useState(false);

  if (!appointment) return null;

  const rawId = appointment._id ? String(appointment._id) : '';
  const bookingId = appointment.referenceId || `HCL-AP-${rawId.slice(-4).toUpperCase() || '0294'}`;

  const facultyName = appointment.faculty?.name || 'Faculty Member';
  const facultyDept = appointment.faculty?.department || 'CSE';
  const facultySubjects = Array.isArray(appointment.faculty?.subjects) && appointment.faculty.subjects.length
    ? appointment.faculty.subjects.join(', ')
    : 'Data Structures & Algorithms';

  const appointmentDate = appointment.date ? String(appointment.date).slice(0, 10) : '';
  const dateFormatted = appointmentDate ? formatDateDisplay(appointmentDate, true) : 'Friday, 16 November 2026';

  const timeSlot = appointment.time || '11:30';
  const timeFormatted = formatTimeWindow(timeSlot, 30);

  const mode = appointment.meetingType || 'In-person';
  const location = appointment.meetingLocation ||
    (mode === 'In-person'
      ? `${facultyDept} Faculty Cabin, Block B – Room 115`
      : mode === 'Virtual meeting'
      ? 'University Google Meet (link sent upon approval)'
      : 'Phone Consultation (+91 Academic Line)');

  const calendarUrl = getGoogleCalendarUrl({
    title: `Faculty Consultation with ${facultyName} (${facultyDept})`,
    date: appointmentDate,
    time: timeSlot,
    durationMinutes: 30,
    details: `Academic consultation session. Reason: ${appointment.reason || 'Doubt clearing and guidance'}. Booking ID: ${bookingId}`,
    location
  });

  const handleCopy = () => {
    navigator.clipboard?.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
<<<<<<< HEAD
      <div className="relative w-full max-w-[480px] card p-6 sm:p-8 space-y-6 my-auto text-left">
=======
      <div className="relative w-full max-w-[480px] bg-[#0E121E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto text-left">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
        {/* Top bar with back arrow */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
<<<<<<< HEAD
            className="w-9 h-9 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-all border border-[var(--border-card)]"
=======
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/5"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            title="Back to consultations"
          >
            <ArrowLeft size={18} />
          </button>
<<<<<<< HEAD
          <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-secondary)] uppercase">
=======
          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            Consultation Pass
          </span>
        </div>

<<<<<<< HEAD
        {/* Calendar & Checkmark Illustration (Clean Black, White & Lavender) */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div className="relative flex items-center justify-center">
            {/* Calendar icon card illustration */}
            <div className="relative w-20 h-20 rounded-2xl bg-[#A99AEF] p-2 flex flex-col justify-between border border-[#A99AEF]">
              {/* Binder rings */}
              <div className="flex justify-around items-center -mt-3.5">
                <span className="w-2.5 h-3.5 rounded-full bg-black/60 shadow-sm" />
                <span className="w-2.5 h-3.5 rounded-full bg-black/60 shadow-sm" />
                <span className="w-2.5 h-3.5 rounded-full bg-black/60 shadow-sm" />
              </div>
              {/* Calendar grid representation */}
              <div className="bg-black/15 rounded-lg p-1.5 grid grid-cols-3 gap-1">
                <div className="h-1.5 rounded bg-black/40" />
                <div className="h-1.5 rounded bg-black/40" />
                <div className="h-1.5 rounded bg-black/40" />
                <div className="h-1.5 rounded bg-black/30" />
                <div className="h-1.5 rounded bg-black/30" />
                <div className="h-1.5 rounded bg-black/30" />
              </div>
            </div>

            {/* Floating check badge */}
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#A99AEF] text-black flex items-center justify-center font-bold shadow-lg border-2 border-[var(--bg-card)]">
              <Check size={20} strokeWidth={3.5} />
            </div>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mt-5 text-center">
            Meeting Confirmed!
          </h2>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1.5 text-center leading-relaxed max-w-sm">
=======
        {/* 3D-styled Calendar & Checkmark Illustration */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div className="relative flex items-center justify-center">
            {/* Soft decorative glow */}
            <div className="absolute w-28 h-28 rounded-full bg-violet-600/25 blur-2xl" />

            {/* Calendar icon card illustration */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-glow p-2 flex flex-col justify-between border border-violet-400/40">
              {/* Binder rings */}
              <div className="flex justify-around items-center -mt-3.5">
                <span className="w-2.5 h-3.5 rounded-full bg-slate-300 border border-slate-700 shadow-sm" />
                <span className="w-2.5 h-3.5 rounded-full bg-slate-300 border border-slate-700 shadow-sm" />
                <span className="w-2.5 h-3.5 rounded-full bg-slate-300 border border-slate-700 shadow-sm" />
              </div>
              {/* Calendar grid representation */}
              <div className="bg-white/15 rounded-lg p-1.5 grid grid-cols-3 gap-1">
                <div className="h-1.5 rounded bg-white/70" />
                <div className="h-1.5 rounded bg-white/70" />
                <div className="h-1.5 rounded bg-white/70" />
                <div className="h-1.5 rounded bg-white/50" />
                <div className="h-1.5 rounded bg-white/50" />
                <div className="h-1.5 rounded bg-white/50" />
              </div>
            </div>

            {/* Floating green check badge */}
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#C6FF4D] text-[#0B1020] flex items-center justify-center font-bold shadow-lg border-2 border-[#0E121E]">
              <Check size={20} strokeWidth={3.5} />
            </div>

            {/* Sparkle highlights */}
            <span className="absolute -top-1 -right-2 text-yellow-300 text-xs animate-pulse">✦</span>
            <span className="absolute -bottom-1 -left-2 text-violet-300 text-xs">✦</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-5 text-center">
            Meeting Confirmed!
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 text-center leading-relaxed max-w-sm">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            Your appointment with the faculty has been successfully booked.
          </p>

          {/* Booking ID Pill with Copy button */}
<<<<<<< HEAD
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-card)] text-xs font-mono">
            <Calendar size={14} className="text-[#A99AEF]" />
            <span className="text-[var(--text-secondary)] font-semibold tracking-wider">
              Booking ID: <strong className="text-[var(--text-primary)]">{bookingId}</strong>
=======
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#171E30] border border-white/10 text-xs font-mono">
            <Calendar size={14} className="text-violet-400" />
            <span className="text-slate-300 font-semibold tracking-wider">
              Booking ID: <strong className="text-white">{bookingId}</strong>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            </span>
            <button
              type="button"
              onClick={handleCopy}
<<<<<<< HEAD
              className="ml-1 text-[var(--text-secondary)] hover:text-[#A99AEF] transition-colors p-1"
              title="Copy Booking ID"
            >
              {copied ? (
                <span className="text-[#A99AEF] font-sans text-[11px] font-bold">Copied!</span>
=======
              className="ml-1 text-slate-400 hover:text-cyan-300 transition-colors p-1"
              title="Copy Booking ID"
            >
              {copied ? (
                <span className="text-lime-400 font-sans text-[11px] font-bold">Copied!</span>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        </div>

        {/* Faculty & Meeting Details Card */}
<<<<<<< HEAD
        <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-4">
          {/* Faculty Header */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border-card)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30 flex items-center justify-center shrink-0">
                <User size={22} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-[var(--text-primary)]">
                  {facultyName}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
=======
        <div className="p-5 rounded-2xl bg-[#141A2B] border border-white/10 space-y-4 shadow-inner">
          {/* Faculty Header */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center justify-center shrink-0">
                <User size={22} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  {facultyName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                  {facultyDept} • {facultySubjects}
                </p>
              </div>
            </div>

<<<<<<< HEAD
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30 shrink-0">
=======
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-lime-500/15 text-lime-400 border border-lime-500/30 shrink-0">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
              <CheckCircle2 size={13} />
              Confirmed
            </span>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-start justify-between gap-2">
<<<<<<< HEAD
              <span className="text-[var(--text-secondary)] flex items-center gap-2 shrink-0">
                <Calendar size={15} className="text-[#A99AEF]" />
                Date
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-right">
=======
              <span className="text-slate-400 flex items-center gap-2 shrink-0">
                <Calendar size={15} className="text-slate-500" />
                Date
              </span>
              <span className="font-semibold text-white text-right">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                {dateFormatted}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
<<<<<<< HEAD
              <span className="text-[var(--text-secondary)] flex items-center gap-2 shrink-0">
                <Clock size={15} className="text-[#A99AEF]" />
                Time
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-right">
=======
              <span className="text-slate-400 flex items-center gap-2 shrink-0">
                <Clock size={15} className="text-slate-500" />
                Time
              </span>
              <span className="font-semibold text-white text-right">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                {timeFormatted}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
<<<<<<< HEAD
              <span className="text-[var(--text-secondary)] flex items-center gap-2 shrink-0">
                {mode === 'Phone call' ? (
                  <Phone size={15} className="text-[#A99AEF]" />
                ) : mode === 'Virtual meeting' ? (
                  <Video size={15} className="text-[#A99AEF]" />
                ) : (
                  <MapPin size={15} className="text-[#A99AEF]" />
                )}
                Mode
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-right">
=======
              <span className="text-slate-400 flex items-center gap-2 shrink-0">
                {mode === 'Phone call' ? (
                  <Phone size={15} className="text-slate-500" />
                ) : mode === 'Virtual meeting' ? (
                  <Video size={15} className="text-slate-500" />
                ) : (
                  <MapPin size={15} className="text-slate-500" />
                )}
                Mode
              </span>
              <span className="font-semibold text-white text-right">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                {mode}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
<<<<<<< HEAD
              <span className="text-[var(--text-secondary)] flex items-center gap-2 shrink-0">
                <MapPin size={15} className="text-[#A99AEF]" />
                Location
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-right max-w-[240px] truncate">
=======
              <span className="text-slate-400 flex items-center gap-2 shrink-0">
                <MapPin size={15} className="text-slate-500" />
                Location
              </span>
              <span className="font-semibold text-cyan-300 text-right max-w-[240px] truncate">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next Notification Banner */}
<<<<<<< HEAD
        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[#A99AEF]/40 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-full bg-[#A99AEF]/20 text-[#A99AEF] mt-0.5 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">What&apos;s next?</div>
              <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
=======
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/60 via-purple-950/40 to-indigo-950/40 border border-violet-500/30 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-full bg-violet-500/20 text-violet-300 mt-0.5 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">What&apos;s next?</div>
              <div className="text-[11px] sm:text-xs text-violet-200/80 mt-0.5 leading-relaxed">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                A reminder will be sent 30 minutes before your meeting.
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="w-10 h-10 rounded-2xl bg-[#A99AEF]/15 border border-[#A99AEF]/30 flex items-center justify-center text-[#A99AEF] shrink-0">
            <Bell size={20} className="text-[#A99AEF]" />
=======
          <div className="w-10 h-10 rounded-2xl bg-violet-600/25 border border-violet-500/30 flex items-center justify-center text-violet-300 shrink-0 shadow-sm">
            <Bell size={20} className="text-violet-300 animate-wiggle" />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* Primary: Add to Calendar */}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
<<<<<<< HEAD
            className="btn btn-primary w-full py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 text-black"
          >
            <CalendarPlus size={18} strokeWidth={2.5} className="text-black" />
            <span className="text-black font-bold">Add to Calendar</span>
=======
            className="w-full py-3.5 px-4 rounded-2xl bg-[#C6FF4D] hover:bg-[#B5F538] text-[#0B1020] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-glow-lime transition-all"
          >
            <CalendarPlus size={18} strokeWidth={2.5} />
            <span>Add to Calendar</span>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          </a>

          {/* Secondary buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/student"
<<<<<<< HEAD
              className="btn btn-secondary py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
=======
              className="py-3 px-3 rounded-xl bg-[#171F32] hover:bg-[#1E2842] text-slate-200 hover:text-white border border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            >
              <Home size={15} />
              <span>Go to Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={onViewAppointment || onClose}
<<<<<<< HEAD
              className="btn btn-secondary py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
=======
              className="py-3 px-3 rounded-xl bg-[#171F32] hover:bg-[#1E2842] text-slate-200 hover:text-white border border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            >
              <Eye size={15} />
              <span>View Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
