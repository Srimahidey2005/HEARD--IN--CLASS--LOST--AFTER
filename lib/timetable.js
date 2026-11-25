// Faculty Timetable and Free Slot generation utilities.
// Slices faculty office hours into bookable 30-minute consultation slots,
// checks existing appointment bookings for real-time clash prevention,
// and formats 12-hour AM/PM chips matching the academic UI.

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DEFAULT_WEEKDAY_SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30'
];

export const DEFAULT_SATURDAY_SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00'
];

/**
 * Returns the nearest upcoming working date (Monday-Friday) in local timezone as "YYYY-MM-DD"
 */
export function getNextWorkingDateLocal() {
  const d = new Date();
  const day = d.getDay(); // 0 is Sun, 6 is Sat
  if (day === 6) {
    d.setDate(d.getDate() + 2); // Sat -> Mon
  } else if (day === 0) {
    d.setDate(d.getDate() + 1); // Sun -> Mon
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dayStr = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

/**
 * Returns a list of upcoming academic working days for quick selection chips
 */
export function getUpcomingWorkingDays(count = 5) {
  const list = [];
  const cur = new Date();
  // If weekend, start from next Monday
  const day = cur.getDay();
  if (day === 6) cur.setDate(cur.getDate() + 2);
  else if (day === 0) cur.setDate(cur.getDate() + 1);

  while (list.length < count) {
    const curDay = cur.getDay();
    if (curDay !== 0) { // Exclude Sunday
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const dStr = String(cur.getDate()).padStart(2, '0');
      const iso = `${y}-${m}-${dStr}`;
      const dayName = DAYS_OF_WEEK[curDay].slice(0, 3);
      const monthName = MONTH_NAMES[cur.getMonth()].slice(0, 3);
      list.push({
        date: iso,
        dayName,
        dayNum: cur.getDate(),
        monthName,
        display: `${dayName}, ${cur.getDate()} ${monthName}`
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return list;
}

/**
 * Converts 24-hour "HH:MM" string to 12-hour "hh:mm AM/PM"
 */
export function formatTime12(time24 = '') {
  if (!time24 || typeof time24 !== 'string' || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const formattedHour = String(h12).padStart(2, '0');
  const formattedMinute = String(m).padStart(2, '0');
  return `${formattedHour}:${formattedMinute} ${period}`;
}

/**
 * Formats 24h start time into "02:00 PM – 02:30 PM (30 min)"
 */
export function formatTimeWindow(time24 = '', durationMinutes = 30) {
  if (!time24 || typeof time24 !== 'string' || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;

  const startTotalMinutes = h * 60 + m;
  const endTotalMinutes = startTotalMinutes + durationMinutes;

  const endH = Math.floor(endTotalMinutes / 60) % 24;
  const endM = endTotalMinutes % 60;
  const end24 = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

  return `${formatTime12(time24)} – ${formatTime12(end24)} (${durationMinutes} min)`;
}

/**
 * Generates a Google Calendar event creation link
 */
export function getGoogleCalendarUrl({ title, date, time, durationMinutes = 30, details = '', location = '' }) {
  if (!date || !time) return '#';
  const cleanDate = String(date).slice(0, 10).replace(/-/g, '');
  const [hStr, mStr] = String(time).split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return '#';

  const startStr = `${cleanDate}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;

  const endTotalM = h * 60 + m + durationMinutes;
  const endH = Math.floor(endTotalM / 60) % 24;
  const endM = endTotalM % 60;
  const endStr = `${cleanDate}T${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Academic Consultation',
    dates: `${startStr}/${endStr}`,
    details: details || '',
    location: location || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Formats "YYYY-MM-DD" into "16 November" (or "Monday, 16 November")
 */
export function formatDateDisplay(dateStr = '', withDay = false) {
  if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('-')) return dateStr;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const dayName = DAYS_OF_WEEK[dateObj.getUTCDay()];
  const monthName = MONTH_NAMES[m - 1] || '';
  const dayNum = d;

  if (withDay) {
    return `${dayName}, ${dayNum} ${monthName}`;
  }
  return `${dayNum} ${monthName}`;
}

/**
 * Returns weekday name for "YYYY-MM-DD"
 */
export function getWeekday(dateStr = '') {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return DAYS_OF_WEEK[dateObj.getUTCDay()];
}

/**
 * Slices a [start, end] window into 30-minute consultation slots
 */
export function generateSlotsFromWindow(startTime, endTime, intervalMinutes = 30) {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let currentMinutes = startH * 60 + startM;
  const stopMinutes = endH * 60 + endM;

  const slots = [];
  while (currentMinutes + intervalMinutes <= stopMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const time24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    slots.push(time24);
    currentMinutes += intervalMinutes;
  }
  return slots;
}

/**
 * Generates slots for a specific faculty member on a given date,
 * checking clash against existing approved/pending appointments.
 */
export function getFacultySlotsForDate({
  faculty,
  date,
  existingAppointments = [],
  currentStudentId = null
}) {
  if (!faculty || !date) {
    return {
      slots: [],
      isOffDay: false,
      isWeekend: false,
      message: 'Please select a date to view available consultation slots.'
    };
  }

  const weekday = getWeekday(date);
  const isWeekend = weekday === 'Saturday' || weekday === 'Sunday';

  const availability = Array.isArray(faculty.availability) ? faculty.availability : [];

  let candidateTimes24 = [];

  if (availability.length > 0) {
    // Faculty has custom office hours
    const dayWindows = availability.filter((slot) => slot.day === weekday);
    if (dayWindows.length === 0) {
      const activeDays = Array.from(new Set(availability.map((s) => s.day))).join(', ');
      return {
        slots: [],
        isOffDay: true,
        isWeekend,
        message: `${faculty.name} is not available on ${weekday}s. Published working days: ${activeDays}.`
      };
    }

    for (const win of dayWindows) {
      if (win.start && win.end) {
        candidateTimes24.push(...generateSlotsFromWindow(win.start, win.end, 30));
      }
    }
  } else {
    // Open schedule / default academic hours
    if (weekday === 'Sunday') {
      return {
        slots: [],
        isOffDay: true,
        isWeekend: true,
        weekday,
        message: 'Campus academic consultations are closed on Sundays. Please choose Monday–Saturday.'
      };
    }
    if (weekday === 'Saturday') {
      candidateTimes24 = [...DEFAULT_SATURDAY_SLOTS];
    } else {
      candidateTimes24 = [...DEFAULT_WEEKDAY_SLOTS];
    }
  }

  // De-duplicate and sort chronological
  candidateTimes24 = Array.from(new Set(candidateTimes24)).sort();

  // Normalize IDs for comparison
  const targetFacultyId = String(faculty._id || faculty.id || '');
  const studentIdStr = currentStudentId ? String(currentStudentId) : null;

  // Filter existing active appointments on this date for this faculty
  const dateAppointments = existingAppointments.filter((a) => {
    const aFacultyId = String(a.faculty?._id || a.faculty || '');
    const aDate = String(a.date || '').slice(0, 10);
    const activeStatus = ['Pending', 'Approved', 'Rescheduled'].includes(a.status);
    return aFacultyId === targetFacultyId && aDate === date && activeStatus;
  });

  const slots = candidateTimes24.map((time24) => {
    const clash = dateAppointments.find((a) => a.time === time24);
    const isBooked = !!clash;
    const bookedByMe =
      isBooked && studentIdStr && String(clash.student?._id || clash.student || '') === studentIdStr;

    return {
      time24,
      time12: formatTime12(time24),
      isBooked,
      bookedByMe,
      clashStatus: clash?.status || null
    };
  });

  return {
    slots,
    isOffDay: false,
    isWeekend: false,
    weekday,
    message: ''
  };
}
