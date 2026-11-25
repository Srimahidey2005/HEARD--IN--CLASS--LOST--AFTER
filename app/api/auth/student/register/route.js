import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { attachSession, publicUser } from '@/lib/auth';
import { registrationError } from '@/lib/authHandlers';
import { dashboardFor } from '@/lib/portal';
import { isLpuEmail, normalizeEmail, LPU_EMAIL_MESSAGE, isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE } from '@/lib/validators';
import User from '@/models/User';

// Student self-registration. Only official @lpu.in addresses are accepted, and the role is always 'student'
// (it is never read from the request body).
const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').refine(isLpuEmail, LPU_EMAIL_MESSAGE),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters')
    .refine(isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE),
  registrationNumber: z.string().trim().min(5, 'Please enter your LPU registration number'),
  course: z.string().trim().min(2, 'Please enter your course'),
  semester: z.coerce.number({ invalid_type_error: 'Please select your semester' }).int().min(1, 'Please select your semester').max(12, 'Please select your semester'),
});

export async function POST(req) {
  try {
    let raw; try { raw = await req.json(); } catch { return NextResponse.json({ message: 'Invalid request body' }, { status: 400 }); }
    const body = schema.parse(raw);
    const email = normalizeEmail(body.email);
    await connectDB();
    if (await User.findOne({ $or: [{ email }, { registrationNumber: body.registrationNumber }] })) {
      return NextResponse.json({ message: 'Email or registration number already exists' }, { status: 409 });
    }
    const user = await User.create({
      name: body.name, email, registrationNumber: body.registrationNumber, course: body.course, semester: body.semester,
      password: await bcrypt.hash(body.password, 12), role: 'student',
    });
    const res = NextResponse.json({ user: publicUser(user), redirect: dashboardFor('student') }, { status: 201 });
    return await attachSession(res, user);
  } catch (e) { return registrationError(e, 'Student'); }
}
