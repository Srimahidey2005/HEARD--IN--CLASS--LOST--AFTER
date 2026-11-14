// Browser-side data layer: every call goes to the real API routes (MongoDB). No mock data, no localStorage.
import { validateAppointmentInput, validateSlot } from './validators.js';

async function request(url, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      credentials: 'same-origin',
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; }
  catch { throw new Error(`Unexpected server response (HTTP ${res.status}).`); }
  if (!res.ok) throw new Error(data.message || `Request failed (HTTP ${res.status}).`);
  return data;
}

export async function getFaculty() {
  return (await request('/api/faculty')).faculty;
}

export async function getAppointments() {
  return (await request('/api/appointments')).appointments;
}

export async function getAppointment(id) {
  return (await request(`/api/appointments/${id}`)).appointment;
}

// The payload is checked with the same rules as the API, so the user gets the exact reason before any request is sent.
// The student id is never sent: the server takes it from the signed-in session.
export async function createAppointment({ facultyId, date, time, reason, queryId, meetingType, meetingLocation } = {}) {
  const { value, error } = validateAppointmentInput({ facultyId, date, time, reason, queryId, meetingType, meetingLocation });
  if (error) throw new Error(error);
  const payload = {
    facultyId: value.facultyId,
    date: value.date,
    time: value.time,
    reason: value.reason,
    meetingType: value.meetingType,
    meetingLocation: value.meetingLocation
  };
  if (value.queryId) payload.queryId = value.queryId;
  return (await request('/api/appointments', { method: 'POST', body: payload })).appointment;
}

export async function setAppointmentStatus(id, status) {
  return (await request(`/api/appointments/${id}`, { method: 'PATCH', body: { status } })).appointment;
}

export async function rescheduleAppointment(id, { date, time, note }) {
  const { error } = validateSlot({ date, time });
  if (error) throw new Error(error);
  return (await request(`/api/appointments/${id}`, { method: 'PATCH', body: { status: 'Rescheduled', date, time, note: note || '' } })).appointment;
}

export async function updateAvailability(availability) {
  return (await request('/api/faculty', { method: 'PATCH', body: { availability } })).availability;
}

// Faculty schedules a consultation for a student's query; it is saved as Approved and shows in the student's portal.
export async function scheduleConsultation({ queryId, date, time, note }) {
  const { error } = validateSlot({ date, time });
  if (error) throw new Error(error);
  return (await request('/api/appointments', { method: 'POST', body: { queryId, date, time, note: note || '' } })).appointment;
}

export async function createQuery(payload) {
  return (await request('/api/queries', { method: 'POST', body: payload })).query;
}

export async function getQueries() {
  return (await request('/api/queries')).queries;
}

export async function getQuery(id) {
  return (await request(`/api/queries/${id}`)).query;
}

export async function updateQuery(id, body) {
  return (await request(`/api/queries/${id}`, { method: 'PATCH', body })).query;
}

export async function cancelQuery(id) {
  return (await request(`/api/queries/${id}`, { method: 'PATCH', body: { status: 'Cancelled' } })).query;
}

// Appointment dates are stored as UTC midnight, so they must be shown in UTC.
export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Today's date as YYYY-MM-DD in the user's local timezone (for <input type="date" min>).
export function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
