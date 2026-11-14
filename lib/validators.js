// Pure validation helpers shared by the browser (forms, lib/dataService.js) and the API routes,
// so both sides always apply exactly the same rules. No server-only imports here.

export const LPU_EMAIL_DOMAIN = 'lpu.in';
export const LPU_EMAIL_MESSAGE = 'Please use your official LPU email address (name@lpu.in).';
export const APPOINTMENT_REQUIRED_MESSAGE = 'facultyId, date, time and reason (min 5 chars) are required';

export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

// Exact domain match: rejects name@lpu.in.evil.com, name@mail.lpu.in, name@notlpu.in, etc.
export const isLpuEmail = (email) => /^[a-z0-9._%+-]+@lpu\.in$/.test(normalizeEmail(email));

export const isObjectId = (value) => typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value);

export const isDateString = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
};

export const isTimeString = (value) => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

// Dates are stored as UTC midnight. One day of slack avoids rejecting "today" for users ahead of UTC.
const isPastDate = (value) => value < new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export function validateSlot({ date, time } = {}) {
  if (!isDateString(date)) return { error: 'Please choose a valid date.' };
  if (!isTimeString(time)) return { error: 'Please choose a valid time.' };
  if (isPastDate(date)) return { error: 'The date cannot be in the past.' };
  return { value: { date, time } };
}

export const MEETING_TYPES = ['In-person', 'Phone call', 'Virtual meeting'];

// Validates an appointment request. `facultyId` must be a real ObjectId string.
export function validateAppointmentInput(input = {}) {
  const facultyId = typeof input.facultyId === 'string' ? input.facultyId.trim() : '';
  const date = typeof input.date === 'string' ? input.date.trim() : '';
  const time = typeof input.time === 'string' ? input.time.trim() : '';
  const reason = typeof input.reason === 'string' ? input.reason.trim() : '';
  const queryId = typeof input.queryId === 'string' ? input.queryId.trim() : '';
  const meetingType = MEETING_TYPES.includes(input.meetingType) ? input.meetingType : 'In-person';
  const meetingLocation = typeof input.meetingLocation === 'string' ? input.meetingLocation.trim().slice(0, 200) : '';

  if (!facultyId || !date || !time || reason.length < 5) return { error: APPOINTMENT_REQUIRED_MESSAGE };
  if (!isObjectId(facultyId)) return { error: 'The selected faculty member is invalid. Please reselect and try again.' };
  if (queryId && !isObjectId(queryId)) return { error: 'The linked query is invalid.' };
  const slot = validateSlot({ date, time });
  if (slot.error) return slot;
  return { value: { facultyId, date, time, reason, queryId: queryId || null, meetingType, meetingLocation } };
}

// ---- Office hours (faculty availability) ----
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Appointment dates are stored as UTC midnight, so the weekday is also read in UTC.
export const dayOfWeek = (date) => DAYS[new Date(`${date}T00:00:00.000Z`).getUTCDay()];

export const describeAvailability = (list = []) => list.map((s) => `${s.day} ${s.start}–${s.end}`).join(', ');

export function validateAvailability(list) {
  if (!Array.isArray(list) || list.length > 28) return { error: 'Office hours must be a list of at most 28 slots.' };
  const out = [];
  for (const s of list) {
    const day = typeof s?.day === 'string' ? s.day.trim() : '';
    const start = typeof s?.start === 'string' ? s.start.trim() : '';
    const end = typeof s?.end === 'string' ? s.end.trim() : '';
    if (!DAYS.includes(day)) return { error: 'Each office-hour slot needs a valid weekday.' };
    if (!isTimeString(start) || !isTimeString(end)) return { error: 'Each office-hour slot needs a valid start and end time.' };
    if (start >= end) return { error: `Office hours on ${day}: the end time must be after the start time.` };
    if (!out.some((o) => o.day === day && o.start === start && o.end === end)) out.push({ day, start, end });
  }
  return { value: out };
}

// If the faculty member has published office hours, a requested slot must fall inside one of them.
// With no published hours, any slot may be requested.
export function checkAvailability(availability = [], date, time) {
  if (!availability.length) return { ok: true };
  const day = dayOfWeek(date);
  const ok = availability.some((s) => s.day === day && time >= s.start && time < s.end);
  return ok ? { ok: true } : { ok: false, message: `This faculty member holds office hours on: ${describeAvailability(availability)}. ${day} ${time} is outside those hours.` };
}

export const QUERY_CATEGORIES = [
  'Academic Doubt',
  'Assignment',
  'Examination',
  'Attendance',
  'Course Material',
  'Administrative Request',
  'Administrative',
  'Other'
];

export const QUERY_PRIORITIES = ['Low', 'Medium', 'Normal', 'High', 'Urgent'];
export const PRIORITY_RANK = { Urgent: 4, High: 3, Medium: 2, Normal: 2, Low: 1 };
export const OPEN_STATUSES = ['Pending', 'Submitted', 'Assigned', 'In Progress'];
export const CLOSED_STATUSES = ['Answered', 'Resolved', 'Closed', 'Cancelled'];
export const ALL_QUERY_STATUSES = ['Pending', 'Submitted', 'Assigned', 'In Progress', 'Answered', 'Resolved', 'Closed', 'Cancelled'];
export const APPOINTMENT_STATUSES = ['Pending', 'Approved', 'Rejected', 'Rescheduled', 'Cancelled', 'Completed'];
