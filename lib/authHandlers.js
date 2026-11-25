import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { attachSession, publicUser } from '@/lib/auth';
import { dashboardFor } from '@/lib/portal';
import { rateLimit, rateLimitReset, clientIp } from '@/lib/rateLimit';
import { isLpuEmail, isAdminEmail, normalizeEmail, LPU_EMAIL_MESSAGE, ADMIN_EMAIL_MESSAGE } from '@/lib/validators';
import User from '@/models/User';

const reply = (message, status) => NextResponse.json({ message }, { status });

// Compared when the email is unknown so response time does not reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const WRONG_PORTAL = {
  student: 'This is the Student Portal. Faculty and admin accounts must sign in from their own portal.',
  faculty: 'This is the Faculty Portal. Student and admin accounts must sign in from their own portal.',
  admin: 'This is the Admin Portal. Student and faculty accounts must sign in from their own portal.',
};

// Shared sign-in for the three portals. The account's role must match the portal it signs in to.
export async function handleLogin(req, portal) {
  let body;
  try { body = await req.json(); } catch { return reply('Invalid request body', 400); }
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!email || !password) return reply('Email and password are required', 400);
  if (portal === 'student' && !isLpuEmail(email)) return reply(LPU_EMAIL_MESSAGE, 400);
  if (portal === 'admin' && !isAdminEmail(email) && email !== 'admin@heardinclass.edu') {
    return reply('Administrator login requires an official @admin.in email address (e.g. abc@admin.in).', 400);
  }

  const key = `login:${portal}:${clientIp(req)}:${email}`;
  const limit = rateLimit(key);
  if (!limit.ok) return reply(`Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minute(s).`, 429);

  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: `No ${portal} account found for "${email}". Would you like to create one?`,
          notRegistered: true,
          email,
          registerUrl: `/register/${portal}?email=${encodeURIComponent(email)}`
        },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply('Incorrect password. Please verify your credentials and try again.', 401);
    }

    if (user.role !== portal) return reply(WRONG_PORTAL[portal], 403);
    rateLimitReset(key);
    const res = NextResponse.json({ user: publicUser(user), redirect: dashboardFor(user.role) });
    return await attachSession(res, user);
  } catch (e) {
    console.error(`${portal} sign-in failed:`, e);
    return reply(e.message || 'Sign-in failed. Please try again.', 503);
  }
}

// Turns a Zod/Mongo error into a JSON response.
export function registrationError(e, label) {
  if (e?.code === 11000) return reply('Email or registration number already exists', 409);
  const message = e?.issues?.[0]?.message;
  if (!message) console.error(`${label} registration failed:`, e);
  return reply(message || e?.message || 'Registration failed. Please try again.', message ? 400 : 500);
}

// "DSA, OS" or ["DSA","OS"] -> ["DSA","OS"] (trimmed, de-duplicated, case-insensitive)
export function toList(value) {
  const raw = Array.isArray(value) ? value : String(value ?? '').split(',');
  const seen = new Set();
  return raw.map((x) => String(x).trim()).filter((x) => x && !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase()));
}
