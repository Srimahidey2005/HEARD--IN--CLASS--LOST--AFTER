import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { normalizeEmail, isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE } from '@/lib/validators';
import User from '@/models/User';

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(72, 'Password cannot exceed 72 characters')
    .refine(isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
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

    const { email, newPassword } = schema.parse(raw);
    const cleanEmail = normalizeEmail(email);

    await connectDB();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json({
        message: 'No registered institutional account was found for this email address.'
      }, { status: 404 });
    }

    // Hash the new password securely
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
      role: user.role
    }, { status: 200 });
  } catch (err) {
    if (err?.issues?.[0]?.message) {
      return NextResponse.json({ message: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: err.message || 'Failed to reset password. Please try again.' }, { status: 500 });
  }
}
