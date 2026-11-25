import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { attachSession, publicUser } from '@/lib/auth';
import { registrationError } from '@/lib/authHandlers';
import { dashboardFor } from '@/lib/portal';
import { isAdminEmail, normalizeEmail, ADMIN_EMAIL_MESSAGE, isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE } from '@/lib/validators';
import User from '@/models/User';

// Administrator self-registration schema.
// Only official @admin.in addresses are accepted (rejects @gmail.com, @student.in, @faculty.in, etc.).
// The role is always hardcoded as 'admin' to prevent role escalation.
const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .refine(isAdminEmail, ADMIN_EMAIL_MESSAGE),
  registrationNumber: z.string().trim().min(3, 'Please enter your Administrator ID (e.g. ADM-101)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters')
    .refine(isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE),
  confirmPassword: z.string().min(8, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match. Please re-enter.',
  path: ['confirmPassword']
});

export async function POST(req) {
  try {
    let raw;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const body = schema.parse(raw);
    const email = normalizeEmail(body.email);

    // Double-check exact @admin.in domain
    if (!isAdminEmail(email)) {
      return NextResponse.json({ message: ADMIN_EMAIL_MESSAGE }, { status: 400 });
    }

    await connectDB();

    // Check for existing account by email or Administrator ID
    const existing = await User.findOne({
      $or: [
        { email },
        { registrationNumber: body.registrationNumber }
      ]
    });

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json({ message: 'An account with this administrator email already exists.' }, { status: 409 });
      }
      return NextResponse.json({ message: 'This Administrator ID is already assigned to another account.' }, { status: 409 });
    }

    // Securely hash password and create user with strictly 'admin' role
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      name: body.name,
      email,
      registrationNumber: body.registrationNumber,
      department: 'Academic Administration',
      courses: [],
      subjects: [],
      sections: [],
      password: hashedPassword,
      role: 'admin'
    });

    const res = NextResponse.json(
      {
        user: publicUser(user),
        redirect: dashboardFor('admin'),
        message: 'Administrator account registered successfully!'
      },
      { status: 201 }
    );

    return await attachSession(res, user);
  } catch (e) {
    return registrationError(e, 'Admin');
  }
}
