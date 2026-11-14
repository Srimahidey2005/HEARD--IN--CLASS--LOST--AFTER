import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { toList } from '@/lib/authHandlers';
import { routeWaitingQueries } from '@/lib/triage';
import { normalizeEmail } from '@/lib/validators';
import User from '@/models/User';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter the faculty name'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password must be at most 72 characters'),
  department: z.string().trim().min(2, 'Department is required'),
  courses: z.array(z.string()).default([]),
  subjects: z.array(z.string()).min(1, 'Add at least one subject'),
  sections: z.array(z.string()).default([]),
});

export async function GET() {
  const { error } = await requireUser(['admin']);
  if (error) return error;
  try {
    await connectDB();
    const faculty = await User.find({ role: 'faculty' }).select('name email department courses subjects sections').sort({ name: 1 }).lean();
    return NextResponse.json({ faculty });
  } catch (e) { return NextResponse.json({ message: e.message }, { status: 500 }); }
}

export async function PATCH(req) {
  const { error } = await requireUser(['admin']);
  if (error) return error;
  try {
    let raw; try { raw = await req.json(); } catch { return NextResponse.json({ message: 'Invalid request body' }, { status: 400 }); }
    const facultyId = typeof raw?.facultyId === 'string' ? raw.facultyId.trim() : '';
    if (!/^[a-f0-9]{24}$/i.test(facultyId)) return NextResponse.json({ message: 'Select a valid faculty member' }, { status: 400 });
    const b = z.object({
      courses: z.array(z.string()),
      subjects: z.array(z.string()).min(1, 'Add at least one subject'),
      sections: z.array(z.string()).default([])
    }).parse({
      courses: toList(raw?.courses),
      subjects: toList(raw?.subjects),
      sections: toList(raw?.sections)
    });
    await connectDB();
    const user = await User.findOne({ _id: facultyId, role: 'faculty' });
    if (!user) return NextResponse.json({ message: 'Faculty not found' }, { status: 404 });
    user.courses = b.courses;
    user.subjects = b.subjects;
    user.sections = b.sections;
    await user.save();
    const routedQueries = await routeWaitingQueries(user);
    return NextResponse.json({
      faculty: {
        id: user._id.toString(),
        name: user.name,
        courses: user.courses,
        subjects: user.subjects,
        sections: user.sections
      },
      routedQueries
    });
  } catch (e) { return NextResponse.json({ message: e.issues?.[0]?.message || e.message }, { status: 400 }); }
}

// Admin only: create a faculty account with its department, assigned courses, subjects, and sections.
export async function POST(req) {
  const { error } = await requireUser(['admin']);
  if (error) return error;
  try {
    let raw; try { raw = await req.json(); } catch { return NextResponse.json({ message: 'Invalid request body' }, { status: 400 }); }
    const b = schema.parse({
      ...raw,
      courses: toList(raw?.courses),
      subjects: toList(raw?.subjects),
      sections: toList(raw?.sections)
    });
    const email = normalizeEmail(b.email);
    await connectDB();
    if (await User.findOne({ email })) return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    const user = await User.create({
      name: b.name,
      email,
      department: b.department,
      courses: b.courses,
      subjects: b.subjects,
      sections: b.sections,
      password: await bcrypt.hash(b.password, 12),
      role: 'faculty'
    });
    const routed = await routeWaitingQueries(user);
    return NextResponse.json({
      faculty: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        department: user.department,
        courses: user.courses,
        subjects: user.subjects,
        sections: user.sections
      },
      routedQueries: routed
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.issues?.[0]?.message || e.message }, { status: 400 });
  }
}
