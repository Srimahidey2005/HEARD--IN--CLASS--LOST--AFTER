import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import Query from '@/models/Query';
import User from '@/models/User';
import { z } from 'zod';
<<<<<<< HEAD
import { categorizeQuery, triageQuery, validatePreferredFaculty } from '@/lib/triage';
=======
import { categorizeQuery, triageQuery } from '@/lib/triage';
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
import { QUERY_CATEGORIES, QUERY_PRIORITIES } from '@/lib/validators';

const schema = z.object({
  course: z.string().trim().min(2, 'Course is required'),
  section: z.string().trim().optional(),
  semester: z.coerce.number({ invalid_type_error: 'Please select your semester' }).int().min(1, 'Please select your semester').max(12, 'Please select your semester'),
  subject: z.string().trim().min(2, 'Subject is required'),
  title: z.string().trim().min(4, 'Title must be at least 4 characters'),
  description: z.string().trim().min(10, 'Please add at least 10 characters of context'),
  category: z.string().optional(),
  priority: z.enum(QUERY_PRIORITIES).default('Medium'),
<<<<<<< HEAD
  preferredFacultyId: z.string().trim().optional(),
  preferredTeacherId: z.string().trim().optional(),
=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
  attachmentName: z.string().optional(),
  attachmentUrl: z.string().optional()
});

<<<<<<< HEAD
// Module 1 + 3: the query is saved and routed to a qualified faculty member.
// If student specifies an eligible preferred teacher, assign directly.
// Otherwise, route automatically using the existing multi-tier triage service.
=======
// Module 1 + 3: the query is saved as Pending, categorized (automatically unless the student picked one), then routed
// to a qualified faculty member by subject/course mapping, which moves it to Assigned.
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
export async function POST(req) {
  const { user, error } = await requireUser(['student']);
  if (error) return error;

  try {
    let raw;
    try { raw = await req.json(); } catch { return NextResponse.json({ message: 'Invalid request body' }, { status: 400 }); }

    const body = schema.parse(raw);
    const picked = body.category && body.category !== 'Auto' ? body.category : null;
    if (picked && !QUERY_CATEGORIES.includes(picked)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    await connectDB();

<<<<<<< HEAD
    const preferredId = body.preferredFacultyId || body.preferredTeacherId || '';
    let validatedTeacher = null;
    if (preferredId) {
      const validation = await validatePreferredFaculty(preferredId, {
        subject: body.subject,
        course: body.course,
        section: body.section
      });
      if (!validation.ok) {
        return NextResponse.json({ message: validation.error }, { status: 400 });
      }
      validatedTeacher = validation.faculty;
    }

=======
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
    const priorityNormalized = body.priority === 'Normal' ? 'Medium' : body.priority;
    const detectedCategory = picked || categorizeQuery(body);

    const hex = Math.random().toString(36).slice(2, 8).toUpperCase();
    const referenceId = `QRY-${hex}`;

    const query = new Query({
      referenceId,
      course: body.course,
      section: body.section || '',
      semester: body.semester,
      subject: body.subject,
      title: body.title,
      description: body.description,
      priority: priorityNormalized,
      category: detectedCategory,
      student: user.id,
<<<<<<< HEAD
      faculty: validatedTeacher ? validatedTeacher._id : null,
      preferredFaculty: validatedTeacher ? validatedTeacher._id : null,
      status: validatedTeacher ? 'Assigned' : 'Pending',
=======
      faculty: null,
      status: 'Pending',
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
      attachment: {
        name: body.attachmentName || '',
        url: body.attachmentUrl || ''
      }
    });

    await query.save();

    // Keep student profile track synchronized with latest submitted query track
    await User.findByIdAndUpdate(user.id, {
      $set: { course: body.course, semester: body.semester, ...(body.section ? { section: body.section } : {}) }
    }).catch(() => null);

<<<<<<< HEAD
    // If no preferred teacher was selected, triage automatically with existing logic
    if (!validatedTeacher) {
      await triageQuery(query);
    }
=======
    // Triage and route to qualified faculty
    await triageQuery(query);
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2

    const populated = await Query.findById(query._id)
      .populate('student', 'name email registrationNumber course semester section')
      .populate('faculty', 'name email department courses subjects sections')
      .populate('answeredBy', 'name')
      .lean();

    return NextResponse.json({ query: populated }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.issues?.[0]?.message || e.message }, { status: 400 });
  }
}

export async function GET() {
  const { user, error } = await requireUser(['student', 'faculty', 'admin']);
  if (error) return error;

  try {
    await connectDB();
    const filter =
      user.role === 'student'
        ? { student: user.id }
        : user.role === 'faculty'
        ? { $or: [{ faculty: user.id }, { faculty: null }] }
        : {};
    const queries = await Query.find(filter)
      .populate('student', 'name email registrationNumber course semester section')
      .populate('faculty', 'name email department courses subjects sections')
      .populate('answeredBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ queries });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
