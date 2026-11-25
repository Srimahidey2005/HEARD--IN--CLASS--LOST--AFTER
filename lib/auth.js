import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getSecretKey } from '@/lib/secret';
import { dashboardFor, loginFor } from '@/lib/portal';
import User from '@/models/User';

export const SESSION_COOKIE = 'p09_token';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export async function createToken(user) {
  return new SignJWT({ id: user._id.toString(), name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(getSecretKey());
}

// Signs the user in by attaching the HTTP-only session cookie to a response.
export async function attachSession(res, user) {
  res.cookies.set(SESSION_COOKIE, await createToken(user), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: SESSION_SECONDS,
  });
  return res;
}

export const publicUser = (u) => ({
  id: u._id.toString(), name: u.name, email: u.email, role: u.role,
  registrationNumber: u.registrationNumber || '', course: u.course || '', semester: u.semester || null,
  department: u.department || '', courses: u.courses || [], subjects: u.subjects || [],
});

// Raw JWT payload (cheap, no DB). Prefer getCurrentUser()/requireUser() when the data is displayed or trusted.
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, getSecretKey()); return payload; } catch { return null; }
}

// Authoritative logged-in user, read from MongoDB using the id in the signed token.
// The JWT only proves *who* the user is; role and profile always come from the database,
// so deleted or demoted users lose access immediately.
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.id || !mongoose.isValidObjectId(session.id)) return null;
  await connectDB();
  const u = await User.findById(session.id).select('-password').lean();
  return u ? publicUser(u) : null;
}

// API guard: validates the session AND the role on the server.
export async function requireUser(roles = []) {
  let user;
  try { user = await getCurrentUser(); }
  catch (e) { return { error: NextResponse.json({ message: e.message || 'Database unavailable' }, { status: 503 }) }; }
  if (!user) return { error: NextResponse.json({ message: 'Authentication required' }, { status: 401 }) };
  if (roles.length && !roles.includes(user.role)) return { error: NextResponse.json({ message: 'You are not authorized' }, { status: 403 }) };
  return { user };
}

// Page guard for portal layouts: signed-out or wrong role -> that portal's sign-in.
export async function requirePortalUser(role) {
  let user = null;
  try { user = await getCurrentUser(); } catch { user = null; }
  if (!user) redirect(loginFor(role));
  if (user.role !== role) redirect(loginFor(role));
  return user;
}
