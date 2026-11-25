import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import Query from '@/models/Query';
import User from '@/models/User';
import { teachesSubject } from '@/lib/triage';
import { isObjectId, QUERY_CATEGORIES, QUERY_PRIORITIES, ALL_QUERY_STATUSES } from '@/lib/validators';

const populateQuery = (q) =>
  q.populate('student', 'name email registrationNumber course semester')
   .populate('faculty', 'name email department courses subjects')
   .populate('answeredBy', 'name email');

// GET /api/queries/:id
export async function GET(req, { params }) {
  const { user, error } = await requireUser(['student', 'faculty', 'admin']);
  if (error) return error;

  try {
    const { id } = await params;
    if (!isObjectId(id)) return NextResponse.json({ message: 'Invalid query id' }, { status: 400 });

    await connectDB();
    const q = await populateQuery(Query.findById(id)).lean();
    if (!q) return NextResponse.json({ message: 'Query not found' }, { status: 404 });

    // Authorization checks
    if (user.role === 'student' && q.student?._id?.toString() !== user.id) {
      return NextResponse.json({ message: 'Access denied: not your query' }, { status: 403 });
    }
    if (user.role === 'faculty' && q.faculty?._id?.toString() !== user.id) {
      return NextResponse.json({ message: 'Access denied: query not assigned to you' }, { status: 403 });
    }

    return NextResponse.json({ query: q });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

// PATCH /api/queries/:id
export async function PATCH(req, { params }) {
  const { user, error } = await requireUser(['student', 'faculty', 'admin']);
  if (error) return error;

  try {
    const { id } = await params;
    if (!isObjectId(id)) return NextResponse.json({ message: 'Invalid query id' }, { status: 400 });

    let body;
    try { body = await req.json(); } catch { return NextResponse.json({ message: 'Invalid request body' }, { status: 400 }); }

    const { status, priority, category, facultyId } = body || {};
    const response = typeof body?.response === 'string' ? body.response.trim() : undefined;

    if (status && !ALL_QUERY_STATUSES.includes(status)) {
      return NextResponse.json({ message: 'Invalid query status' }, { status: 400 });
    }
    if (priority && !QUERY_PRIORITIES.includes(priority)) {
      return NextResponse.json({ message: 'Invalid priority' }, { status: 400 });
    }
    if (category && !QUERY_CATEGORIES.includes(category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    await connectDB();
    const q = await Query.findById(id);
    if (!q) return NextResponse.json({ message: 'Query not found' }, { status: 404 });

    // 1. Student permissions: Can cancel/close their own query if not yet completed/answered
    if (user.role === 'student') {
      if (q.student.toString() !== user.id) {
        return NextResponse.json({ message: 'Not your query' }, { status: 403 });
      }
      if (status !== 'Cancelled' && status !== 'Closed') {
        return NextResponse.json({ message: 'Students can only cancel or close their own queries' }, { status: 403 });
      }
      if (['Answered', 'Resolved', 'Closed', 'Cancelled'].includes(q.status)) {
        return NextResponse.json({ message: `Cannot cancel a query that is already ${q.status.toLowerCase()}` }, { status: 409 });
      }
      q.status = status;
      await q.save();
      const updated = await populateQuery(Query.findById(q._id)).lean();
      return NextResponse.json({ query: updated });
    }

    // 2. Faculty permissions: Can answer, mark In Progress, Answered, Resolved, Closed, change priority, category
    if (user.role === 'faculty') {
      if (q.faculty && q.faculty.toString() !== user.id) {
        return NextResponse.json({ message: 'This query is assigned to another faculty member' }, { status: 403 });
      }
      // If query had no faculty assigned yet, answering it claims it for this faculty member
      if (!q.faculty) {
        q.faculty = user.id;
      }
      if (facultyId !== undefined) {
        return NextResponse.json({ message: 'Faculty cannot reassign queries' }, { status: 403 });
      }
    }

    // 3. Admin permissions: Reassign faculty
    if (facultyId !== undefined) {
      if (user.role !== 'admin') {
        return NextResponse.json({ message: 'Only an administrator can reassign queries' }, { status: 403 });
      }
      if (!isObjectId(facultyId)) return NextResponse.json({ message: 'Invalid faculty id' }, { status: 400 });
      const f = await User.findOne({ _id: facultyId, role: 'faculty' }).select('_id name subjects');
      if (!f) return NextResponse.json({ message: 'Faculty not found' }, { status: 404 });
      if (!teachesSubject(f, q.subject)) {
        return NextResponse.json({ message: `${f.name} is not mapped to teach "${q.subject}"` }, { status: 400 });
      }
      q.faculty = f._id;
      if (['Pending', 'Submitted'].includes(q.status)) q.status = 'Assigned';
    }

    // Faculty or Admin responses
    if (response !== undefined && response.length > 0) {
      if (response.length < 2) return NextResponse.json({ message: 'Response is too short' }, { status: 400 });
      q.response = response;
      q.answeredBy = user.id;
      q.respondedAt = new Date();
      q.status = status || 'Answered';
    } else if (status) {
      if (['Answered', 'Resolved'].includes(status) && !q.response) {
        return NextResponse.json({ message: `Write a response before marking this query as ${status}` }, { status: 400 });
      }
      q.status = status;
      if (['Resolved', 'Closed'].includes(status) && !q.respondedAt && q.response) {
        q.respondedAt = new Date();
      }
    }

    if (priority) q.priority = priority === 'Normal' ? 'Medium' : priority;
    if (category) q.category = category;

    await q.save();
    const updated = await populateQuery(Query.findById(q._id)).lean();
    return NextResponse.json({ query: updated });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
