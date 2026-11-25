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
      <div className="relative w-full max-w-[480px] card p-6 sm:p-8 space-y-6 my-auto text-left">
        {/* Top bar with back arrow */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-all border border-[var(--border-card)]"
            title="Back to consultations"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-secondary)] uppercase">
            Consultation Pass
          </span>
        </div>

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
            Your appointment with the faculty has been successfully booked.
          </p>

          {/* Booking ID Pill with Copy button */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-card)] text-xs font-mono">
            <Calendar size={14} className="text-[#A99AEF]" />
            <span className="text-[var(--text-secondary)] font-semibold tracking-wider">
              Booking ID: <strong className="text-[var(--text-primary)]">{bookingId}</strong>
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-1 text-[var(--text-secondary)] hover:text-[#A99AEF] transition-colors p-1"
              title="Copy Booking ID"
            >
              {copied ? (
                <span className="text-[#A99AEF] font-sans text-[11px] font-bold">Copied!</span>
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        </div>

        {/* Faculty & Meeting Details Card */}
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
                  {facultyDept} • {facultySubjects}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30 shrink-0">
              <CheckCircle2 size={13} />
              Confirmed
            </span>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[var(--text-secondary)] flex items-center gap-2 shrink-0">
                <Calendar size={15} className="text-[#A99AEF]" />
                Date
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-right">
                {dateFormatted}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-[var(--text-secondary)] flex items-center gap-2 shrink-0">
                <Clock size={15} className="text-[#A99AEF]" />
                Time
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-right">
                {timeFormatted}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
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
                {mode}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-[var(--text-secondary)] flex items-center gap-2 shrink-0">
                <MapPin size={15} className="text-[#A99AEF]" />
                Location
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-right max-w-[240px] truncate">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next Notification Banner */}
        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[#A99AEF]/40 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-full bg-[#A99AEF]/20 text-[#A99AEF] mt-0.5 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">What&apos;s next?</div>
              <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                A reminder will be sent 30 minutes before your meeting.
              </div>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[#A99AEF]/15 border border-[#A99AEF]/30 flex items-center justify-center text-[#A99AEF] shrink-0">
            <Bell size={20} className="text-[#A99AEF]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* Primary: Add to Calendar */}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 text-black"
          >
            <CalendarPlus size={18} strokeWidth={2.5} className="text-black" />
            <span className="text-black font-bold">Add to Calendar</span>
          </a>

          {/* Secondary buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/student"
              className="btn btn-secondary py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <Home size={15} />
              <span>Go to Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={onViewAppointment || onClose}
              className="btn btn-secondary py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
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
