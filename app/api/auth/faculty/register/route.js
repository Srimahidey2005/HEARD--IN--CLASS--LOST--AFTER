import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { attachSession, publicUser } from '@/lib/auth';
import { registrationError, toList } from '@/lib/authHandlers';
import { dashboardFor } from '@/lib/portal';
import { routeWaitingQueries } from '@/lib/triage';
import { normalizeEmail, isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE } from '@/lib/validators';
import User from '@/models/User';

// Faculty self-registration is OFF unless FACULTY_REGISTRATION_CODE is set in .env.local. When it is on, the
// code (shared by the administrator) is required, so students cannot create faculty accounts. The role is
// always 'faculty'. Administrators can still create faculty from Admin -> Create faculty.
const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().toLowerCase().email('Please enter your official email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters')
    .refine(isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE),
  department: z.string().trim().min(2, 'Please enter your department'),
  courses: z.array(z.string()).min(1, 'Add at least one course you are assigned to'),
  subjects: z.array(z.string()).min(1, 'Add at least one subject you teach'),
  accessCode: z.string().min(1, 'Faculty access code is required'),
});

const sameCode = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export async function POST(req) {
  const expected = process.env.FACULTY_REGISTRATION_CODE;
  if (!expected) return NextResponse.json({ message: 'Faculty self-registration is disabled. Please ask the administrator to create your account.' }, { status: 403 });
  try {
    let raw; try { raw = await req.json(); } catch { return NextResponse.json({ message: 'Invalid request body' }, { status: 400 }); }
    const body = schema.parse({ ...raw, courses: toList(raw?.courses), subjects: toList(raw?.subjects) });
    if (!sameCode(body.accessCode, expected)) return NextResponse.json({ message: 'Invalid faculty access code' }, { status: 403 });
    const email = normalizeEmail(body.email);
    await connectDB();
    if (await User.findOne({ email })) return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    const user = await User.create({
      name: body.name, email, department: body.department, courses: body.courses, subjects: body.subjects,
      password: await bcrypt.hash(body.password, 12), role: 'faculty',
    });
    await routeWaitingQueries(user);
    const res = NextResponse.json({ user: publicUser(user), redirect: dashboardFor('faculty') }, { status: 201 });
    return await attachSession(res, user);
  } catch (e) { return registrationError(e, 'Faculty'); }
}
