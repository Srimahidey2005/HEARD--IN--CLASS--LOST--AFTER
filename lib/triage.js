// Module 3 – Triage service: categorise a query and route it to the most suitable faculty member.
import User from '@/models/User';
import Query from '@/models/Query';

export const normalizeMapping = (s) =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[\-_()\/,]/g, ' ')
    .replace(/\s+/g, ' ');

// Dictionary of common academic acronyms and abbreviations mapped to standard canonical subject names
export const SUBJECT_ALIASES = {
  'dsa': 'data structures',
  'data structures': 'data structures',
  'data structure': 'data structures',
  'data structures and algorithms': 'data structures',
  'data structures & algorithms': 'data structures',
  'os': 'operating systems',
  'operating systems': 'operating systems',
  'operating system': 'operating systems',
  'dbms': 'database management systems',
  'database': 'database management systems',
  'databases': 'database management systems',
  'database management systems': 'database management systems',
  'cn': 'computer networks',
  'networks': 'computer networks',
  'computer networks': 'computer networks',
  'computer networking': 'computer networks',
  'math': 'mathematics',
  'maths': 'mathematics',
  'mathematics': 'mathematics',
  'discrete math': 'mathematics',
  'java': 'java programming',
  'java programming': 'java programming',
  'core java': 'java programming',
  'advanced java': 'java programming',
  'web': 'web development',
  'web dev': 'web development',
  'web development': 'web development',
  'full stack': 'web development',
  'fullstack': 'web development',
  'python': 'python programming',
  'python programming': 'python programming',
  'ai': 'artificial intelligence',
  'artificial intelligence': 'artificial intelligence',
  'ml': 'machine learning',
  'machine learning': 'machine learning',
  'aiml': 'artificial intelligence',
  'c': 'c programming',
  'cpp': 'c++ programming',
  'c++': 'c++ programming',
  'software engineering': 'software engineering',
  'se': 'software engineering'
};

export function canonicalSubject(s) {
  const norm = normalizeMapping(s);
  return SUBJECT_ALIASES[norm] || norm;
}

// Ordered rules; the category with the most keyword hits wins, ties go to the earlier rule.
const RULES = [
  ['Examination', /\b(exams?|examinations?|tests?|quiz(?:zes)?|mid-?terms?|end-?terms?|viva|marks|grades?|results?|re-?evaluation|question paper|syllabus|hall ticket)\b/g],
  ['Assignment', /\b(assignments?|homework|submissions?|submit|deadlines?|projects?|labs?|practicals?|reports?|extension)\b/g],
  ['Attendance', /\b(attendance|shortage|duty leave|medical leave|biometric|absent|present|percentage|condonation)\b/g],
  ['Course Material', /\b(notes|slides?|ppts?|lecture notes|textbooks?|reference books?|materials?|recordings?|drive link|study material|resources?|handouts?)\b/g],
  ['Administrative Request', /\b(bonafide|leave|fees?|certificates?|registration|timetable|time table|noc|permission|id card|hostel|scholarship|backlogs?|admission|clearance)\b/g],
  ['Administrative', /\b(administrative|office|desk|admin)\b/g],
  ['Academic Doubt', /\b(doubts?|concepts?|explain|understand|difference|how|why|what is|algorithms?|theorems?|proof|examples?|derive|clarify|confused)\b/g],
];

export function categorizeQuery({ title = '', description = '' } = {}) {
  const text = `${title} ${description}`.toLowerCase();
  let best = 'Academic Doubt', top = 0;
  for (const [category, re] of RULES) {
    const hits = (text.match(re) || []).length;
    if (hits > top) { best = category; top = hits; }
  }
  return best;
}

export const teachesSubject = (faculty, subject) => {
  const targetNorm = normalizeMapping(subject);
  const targetCanon = canonicalSubject(subject);
  return (faculty.subjects || []).some((s) => {
    const norm = normalizeMapping(s);
    const canon = canonicalSubject(s);
    return (
      norm === targetNorm ||
      canon === targetCanon ||
      (norm.length >= 3 && targetNorm.includes(norm)) ||
      (targetNorm.length >= 3 && norm.includes(targetNorm)) ||
      (canon.length >= 4 && targetCanon.includes(canon)) ||
      (targetCanon.length >= 4 && canon.includes(targetCanon))
    );
  });
};

// Route by section, course, and subject mapping. Among faculty who teach the subject, prefer (in order):
// 1. One specifically assigned to the student's Section (e.g. "K22AB" or "Section A")
// 2. One assigned to the student's course (e.g. "BTech CSE")
// 3. One whose department appears in the course name
// 4. One with the fewest open queries
// 5. Seniority
export async function pickFaculty({ subject, course, section }) {
  const all = await User.find({ role: 'faculty' }).lean();
  if (!all.length) return null;

  // 1. First priority candidate pool: Faculty explicitly teaching this subject
  let candidates = all.filter((f) => teachesSubject(f, subject));

  // 2. Intelligent Fallback: If no faculty explicitly lists this specific subject alias,
  // find faculty mapped to the student's Course or Section
  if (!candidates.length) {
    candidates = all.filter((f) => {
      const courseMatch = (f.courses || []).some((c) => {
        const cNorm = normalizeMapping(c);
        const scNorm = normalizeMapping(course);
        return (
          cNorm === scNorm ||
          (cNorm.length >= 3 && scNorm.includes(cNorm)) ||
          (scNorm.length >= 3 && cNorm.includes(scNorm))
        );
      });
      const sectionMatch =
        section &&
        (f.sections || []).some((s) => normalizeMapping(s) === normalizeMapping(section));
      return courseMatch || sectionMatch;
    });
  }

  // 3. Final Fallback: Distribute to active faculty so no query is ever stranded unassigned
  if (!candidates.length) {
    candidates = all;
  }

  const normSection = normalizeMapping(section);

  const scored = await Promise.all(candidates.map(async (f) => {
    // 1. Direct Subject Match
    const subjectMatch = teachesSubject(f, subject) ? 1 : 0;

    // 2. Section mapping match
    const sectionMatch = normSection && (f.sections || []).some((sec) => {
      const sNorm = normalizeMapping(sec);
      return (
        sNorm === normSection ||
        (sNorm.length >= 2 && normSection.includes(sNorm)) ||
        (normSection.length >= 2 && sNorm.includes(normSection))
      );
    }) ? 1 : 0;

    // 3. Course mapping match
    const courseMatch = (f.courses || []).some((c) => {
      const cNorm = normalizeMapping(c);
      const studentCourseNorm = normalizeMapping(course);
      return (
        cNorm === studentCourseNorm ||
        (cNorm.length >= 3 && studentCourseNorm.includes(cNorm)) ||
        (cNorm.length >= 3 &&
          cNorm
            .split(' ')
            .filter((w) => w.length >= 3)
            .every((w) => studentCourseNorm.includes(w)))
      );
    }) ? 1 : 0;

    // 4. Dept match & 5. Current workload
    const deptMatch = f.department && normalizeMapping(course).includes(normalizeMapping(f.department)) ? 1 : 0;
    const load = await Query.countDocuments({ faculty: f._id, status: { $in: ['Assigned', 'In Progress'] } });

    return {
      f,
      subject: subjectMatch,
      section: sectionMatch,
      course: courseMatch,
      dept: deptMatch,
      load
    };
  }));

  // Sort order: Subject Match > Section Match > Course Match > Dept Match > Load Balance > CreatedAt
  scored.sort((a, b) =>
    b.subject - a.subject ||
    b.section - a.section ||
    b.course - a.course ||
    b.dept - a.dept ||
    a.load - b.load ||
    new Date(a.f.createdAt || 0) - new Date(b.f.createdAt || 0)
  );

  return scored[0].f;
}

// Triage a freshly saved Pending query: assign it if a matching faculty member exists.
export async function triageQuery(query) {
  const faculty = await pickFaculty({
    subject: query.subject,
    course: query.course,
    section: query.section
  });
  if (faculty) {
    query.faculty = faculty._id;
    query.status = 'Assigned';
    await query.save();
  }
  return query;
}

// When a new faculty member is mapped to subjects or existing queries are re-triaged,
// pick up queries that had nobody to go to.
export async function routeWaitingQueries(faculty = null) {
  const filter = { faculty: null, status: { $in: ['Pending', 'Submitted'] } };
  const waiting = await Query.find(filter);
  let assigned = 0;
  for (const q of waiting) {
    await triageQuery(q);
    if (q.faculty) assigned++;
  }
  return assigned;
}
