// Pure validation helpers shared by the browser (forms, lib/dataService.js) and the API routes,
// so both sides always apply exactly the same rules. No server-only imports here.

export const LPU_EMAIL_DOMAIN = 'lpu.in';
export const LPU_EMAIL_MESSAGE = 'Please use your official LPU email address (name@lpu.in).';
<<<<<<< HEAD
export const ADMIN_EMAIL_DOMAIN = 'admin.in';
export const ADMIN_EMAIL_MESSAGE = 'Administrator email must use the @admin.in domain (e.g. abc@admin.in).';
export const APPOINTMENT_REQUIRED_MESSAGE = 'facultyId, date, time and reason (min 5 chars) are required';

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Password must be at least 8 characters long and contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one numeric digit (0-9), and one special character (e.g. !@#$%^&*).';

export function checkPasswordStrength(password = '') {
  const p = typeof password === 'string' ? password : '';
  const hasMinLength = p.length >= 8;
  const hasUpper = /[A-Z]/.test(p);
  const hasLower = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecial = /[^A-Za-z0-9]/.test(p);
  const isValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  return {
    isValid,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    error: isValid ? null : PASSWORD_REQUIREMENTS_MESSAGE
  };
}

export const isStrongPassword = (password) => checkPasswordStrength(password).isValid;

=======
export const APPOINTMENT_REQUIRED_MESSAGE = 'facultyId, date, time and reason (min 5 chars) are required';

>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

// Exact domain match: rejects name@lpu.in.evil.com, name@mail.lpu.in, name@notlpu.in, etc.
export const isLpuEmail = (email) => /^[a-z0-9._%+-]+@lpu\.in$/.test(normalizeEmail(email));

<<<<<<< HEAD
// Exact domain match for Administrator: only @admin.in allowed. Rejects @gmail.com, @student.in, @faculty.in, etc.
export const isAdminEmail = (email) => /^[a-z0-9._%+-]+@admin\.in$/i.test(normalizeEmail(email));

=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
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
<<<<<<< HEAD

// ---- Subject & Faculty Eligibility Helpers ----
export const normalizeMapping = (s) =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[\-_()\/,]/g, ' ')
    .replace(/\s+/g, ' ');

export const SUBJECT_ALIASES = {
  'dsa': 'data structures',
  'data structures': 'data structures',
  'data structure': 'data structures',
  'data structures and algorithms': 'data structures',
  'data structures & algorithms': 'data structures',
  'os': 'operating systems',
  'operating systems': 'operating systems',
  'operating system': 'operating systems',
  'dbms': 'database management systems',
  'database': 'database management systems',
  'databases': 'database management systems',
  'database management systems': 'database management systems',
  'cn': 'computer networks',
  'networks': 'computer networks',
  'computer networks': 'computer networks',
  'computer networking': 'computer networks',
  'math': 'engineering mathematics',
  'maths': 'engineering mathematics',
  'mathematics': 'engineering mathematics',
  'engineering math': 'engineering mathematics',
  'engineering mathematics': 'engineering mathematics',
  'discrete math': 'discrete mathematics',
  'discrete mathematics': 'discrete mathematics',
  'calculus': 'calculus & linear algebra',
  'calculus & linear algebra': 'calculus & linear algebra',
  'linear algebra': 'calculus & linear algebra',
  'probability & statistics': 'probability & statistics',
  'statistics': 'probability & statistics',
  'java': 'java programming',
  'java programming': 'java programming',
  'core java': 'java programming',
  'advanced java': 'java programming',
  'web': 'web development',
  'web dev': 'web development',
  'web development': 'web development',
  'full stack': 'web development',
  'fullstack': 'web development',
  'python': 'python programming',
  'python programming': 'python programming',
  'ai': 'artificial intelligence',
  'artificial intelligence': 'artificial intelligence',
  'ml': 'machine learning',
  'machine learning': 'machine learning',
  'aiml': 'artificial intelligence',
  'c': 'c programming',
  'c programming': 'c programming',
  'cpp': 'c++ programming',
  'c++': 'c++ programming',
  'c++ programming': 'c++ programming',
  'software engineering': 'software engineering',
  'se': 'software engineering',
  'cloud': 'cloud computing',
  'cloud computing': 'cloud computing',
  'cyber security': 'cyber security',
  'cybersecurity': 'cyber security',
  'digital electronics': 'digital electronics',
  'signals and systems': 'signals and systems',
  'signals & systems': 'signals and systems',
  'microprocessors': 'microprocessors & microcontrollers',
  'microprocessors & microcontrollers': 'microprocessors & microcontrollers',
  'vlsi': 'vlsi design',
  'vlsi design': 'vlsi design',
  'finance': 'financial accounting',
  'financial accounting': 'financial accounting',
  'corporate finance': 'financial accounting',
  'human resource': 'human resource management',
  'human resource management': 'human resource management',
  'hr': 'human resource management',
  'business analytics': 'business analytics',
  'fluid mechanics': 'fluid mechanics',
  'thermodynamics': 'thermodynamics',
  'structural analysis': 'structural analysis',
  'structural engineering': 'structural analysis'
};

export function canonicalSubject(s) {
  const norm = normalizeMapping(s);
  return SUBJECT_ALIASES[norm] || norm;
}

export const teachesSubject = (faculty, subject) => {
  if (!faculty || !subject) return false;
  const targetNorm = normalizeMapping(subject);
  const targetCanon = canonicalSubject(subject);
  return (faculty.subjects || []).some((s) => {
    const norm = normalizeMapping(s);
    const canon = canonicalSubject(s);
    return (
      norm === targetNorm ||
      canon === targetCanon ||
      (norm.length >= 3 && targetNorm.includes(norm)) ||
      (targetNorm.length >= 3 && norm.includes(targetNorm)) ||
      (canon.length >= 4 && targetCanon.includes(canon)) ||
      (targetCanon.length >= 4 && canon.includes(targetCanon))
    );
  });
};

export function isSectionMatch(faculty, section) {
  if (!section || !Array.isArray(faculty?.sections) || faculty.sections.length === 0) return false;
  const normSection = normalizeMapping(section);
  return faculty.sections.some((sec) => {
    const sNorm = normalizeMapping(sec);
    return (
      sNorm === normSection ||
      (sNorm.length >= 2 && normSection.includes(sNorm)) ||
      (normSection.length >= 2 && sNorm.includes(normSection))
    );
  });
}

export function isCourseMatch(faculty, course) {
  if (!course || !Array.isArray(faculty?.courses) || faculty.courses.length === 0) return false;
  const studentCourseNorm = normalizeMapping(course);
  return faculty.courses.some((c) => {
    const cNorm = normalizeMapping(c);
    return (
      cNorm === studentCourseNorm ||
      (cNorm.length >= 3 && studentCourseNorm.includes(cNorm)) ||
      (studentCourseNorm.length >= 3 && cNorm.includes(studentCourseNorm)) ||
      (cNorm.length >= 3 &&
        cNorm
          .split(' ')
          .filter((w) => w.length >= 3)
          .every((w) => studentCourseNorm.includes(w)))
    );
  });
}

export function checkFacultyEligibility(faculty, { subject, course, section } = {}) {
  if (!faculty) {
    return { eligible: false, reason: 'Faculty record not found.' };
  }
  if (faculty.role && faculty.role !== 'faculty') {
    return { eligible: false, reason: 'Selected user is not an active faculty member.' };
  }

  // 1. Direct or canonical subject match
  if (subject && teachesSubject(faculty, subject)) {
    const secMatch = isSectionMatch(faculty, section);
    const crsMatch = isCourseMatch(faculty, course);
    return {
      eligible: true,
      isSectionMatch: secMatch,
      isCourseMatch: crsMatch,
      badge: secMatch ? 'Section Instructor' : crsMatch ? 'Course Faculty' : 'Subject Faculty'
    };
  }

  // If the subject is a known canonical subject (or aliased), the teacher MUST teach it.
  // Never allow unrelated teachers to be assigned to predefined subjects.
  const normSubject = normalizeMapping(subject);
  const isKnownSubject = Boolean(SUBJECT_ALIASES[normSubject]);
  if (isKnownSubject) {
    return {
      eligible: false,
      reason: `${faculty.name || 'Selected teacher'} is not mapped to teach "${subject}".`
    };
  }

  // 2. Intelligent Fallback ONLY for custom/unmapped subjects (not in standard alias catalog):
  // allow faculty mapped to student's course or section (consistent with pickFaculty in triage.js)
  const secMatch = isSectionMatch(faculty, section);
  const crsMatch = isCourseMatch(faculty, course);
  if (secMatch || crsMatch) {
    return {
      eligible: true,
      isSectionMatch: secMatch,
      isCourseMatch: crsMatch,
      badge: secMatch ? 'Section Instructor' : 'Department Faculty'
    };
  }

  return {
    eligible: false,
    reason: `${faculty.name || 'Selected teacher'} is not mapped to teach "${subject}".`
  };
}

export function isFacultyEligible(faculty, criteria = {}) {
  return checkFacultyEligibility(faculty, criteria).eligible;
}

export function getEligibleFacultyList(facultyList = [], { subject, course, section } = {}) {
  if (!Array.isArray(facultyList) || !facultyList.length) return [];

  // 1. Try subject-based matching first
  if (subject) {
    const subjectMatches = facultyList.filter((f) => teachesSubject(f, subject));
    if (subjectMatches.length > 0) {
      return subjectMatches
        .map((f) => {
          const secMatch = isSectionMatch(f, section);
          const crsMatch = isCourseMatch(f, course);
          return {
            ...f,
            isSectionMatch: secMatch,
            isCourseMatch: crsMatch,
            badge: secMatch ? 'Section Instructor' : crsMatch ? 'Course Faculty' : 'Subject Faculty'
          };
        })
        .sort((a, b) => {
          if (b.isSectionMatch !== a.isSectionMatch) return (b.isSectionMatch ? 1 : 0) - (a.isSectionMatch ? 1 : 0);
          if (b.isCourseMatch !== a.isCourseMatch) return (b.isCourseMatch ? 1 : 0) - (a.isCourseMatch ? 1 : 0);
          return (a.name || '').localeCompare(b.name || '');
        });
    }
  }

  // 2. Fallback for custom subjects or subjects without explicit alias:
  // Show faculty mapped to student's section or course
  const fallbackMatches = facultyList.filter((f) => isSectionMatch(f, section) || isCourseMatch(f, course));
  if (fallbackMatches.length > 0) {
    return fallbackMatches
      .map((f) => {
        const secMatch = isSectionMatch(f, section);
        const crsMatch = isCourseMatch(f, course);
        return {
          ...f,
          isSectionMatch: secMatch,
          isCourseMatch: crsMatch,
          badge: secMatch ? 'Section Instructor' : 'Department Faculty'
        };
      })
      .sort((a, b) => {
        if (b.isSectionMatch !== a.isSectionMatch) return (b.isSectionMatch ? 1 : 0) - (a.isSectionMatch ? 1 : 0);
        return (a.name || '').localeCompare(b.name || '');
      });
  }

  // 3. If no mapping exists at all for a custom subject/course, return all active faculty
  return facultyList.map((f) => ({
    ...f,
    isSectionMatch: false,
    isCourseMatch: false,
    badge: 'Faculty Member'
  }));
}

=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
