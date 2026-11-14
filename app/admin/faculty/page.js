"use client";

import { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  GraduationCap
} from 'lucide-react';

const EMPTY = {
  name: '',
  email: '',
  password: '',
  department: 'CSE',
  courses: 'BTech CSE',
  subjects: 'Data Structures, Operating Systems',
  sections: 'K22AB, Section A, K22CD'
};

export default function AdminFacultyPage() {
  const [f, setF] = useState(EMPTY);
  const [msg, setMsg] = useState('');
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function c(e) {
    setF({ ...f, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setBad(false);
    setBusy(true);

    try {
      const r = await fetch('/api/admin/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f)
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setMsg(d.message || 'Could not create faculty account.');
        setBad(true);
      } else {
        setMsg(
          `Faculty account created successfully for ${d.faculty?.name}!${
            d.routedQueries
              ? ` ${d.routedQueries} previously waiting ${d.routedQueries === 1 ? 'query was' : 'queries were'} automatically routed to them.`
              : ''
          }`
        );
        setF({ ...EMPTY, courses: '', subjects: '' });
        setRefreshKey((x) => x + 1);
      }
    } catch {
      setMsg('Network error. Please try again.');
      setBad(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-400 font-bold mb-1">
          <Sparkles size={14} />
          Academic Personnel Directory
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Faculty &amp; Subject Mappings
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-3xl">
          Register verified faculty members, define their academic departments, and map the specific subjects and courses they teach. Our automatic triage engine uses these mappings to instantly route student queries.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create Faculty (6 cols) */}
        <div className="lg:col-span-6 card p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-lime-500/15 text-lime-400 border border-lime-500/30">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">Create Faculty Account</h2>
              <p className="text-xs text-slate-400">Generates login credentials with role: faculty.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300">
              Faculty Full Name
              <input
                className="field mt-1.5"
                name="name"
                value={f.name}
                onChange={c}
                required
                placeholder="e.g. Dr. Ramesh Sharma"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-300">
              Official University Email
              <input
                className="field mt-1.5"
                type="email"
                name="email"
                value={f.email}
                onChange={c}
                required
                placeholder="e.g. ramesh.sharma@lpu.in"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-300">
              Temporary Password (min. 8 characters)
              <input
                className="field mt-1.5"
                type="password"
                minLength={8}
                name="password"
                value={f.password}
                onChange={c}
                required
                placeholder="••••••••"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-300">
              Academic Department
              <input
                className="field mt-1.5"
                name="department"
                value={f.department}
                onChange={c}
                required
                placeholder="e.g. CSE, Mathematics, Mechanical"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-300">
              Assigned Courses (comma separated)
              <input
                className="field mt-1.5"
                name="courses"
                value={f.courses}
                onChange={c}
                placeholder="e.g. BTech CSE, MCA, BCA"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-300">
              Subjects Taught (comma separated)
              <input
                className="field mt-1.5"
                name="subjects"
                value={f.subjects}
                onChange={c}
                required
                placeholder="e.g. Data Structures, Operating Systems, Algorithms"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-300">
              Assigned Sections (comma separated)
              <input
                className="field mt-1.5"
                name="sections"
                value={f.sections}
                onChange={c}
                placeholder="e.g. K22AB, Section A, K22CD"
              />
            </label>

            {msg && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                  bad
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-lime-500/10 border-lime-500/30 text-lime-300'
                }`}
              >
                {bad ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                <span>{msg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-lime shadow-glow-lime w-full font-bold py-3 text-xs"
              disabled={busy}
            >
              {busy ? 'Creating Account…' : 'Create Faculty Account'}
            </button>
          </form>
        </div>

        {/* Right Column: Update Existing Mappings (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <FacultyMappingsEditor refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}

function FacultyMappingsEditor({ refreshKey }) {
  const [faculty, setFaculty] = useState([]);
  const [id, setId] = useState('');
  const [courses, setCourses] = useState('');
  const [subjects, setSubjects] = useState('');
  const [sections, setSections] = useState('');
  const [msg, setMsg] = useState('');
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/admin/faculty');
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || 'Could not load faculty list');
        setFaculty(d.faculty || []);
        if (d.faculty?.length && !id) {
          setId(d.faculty[0]._id);
          setCourses((d.faculty[0].courses || []).join(', '));
          setSubjects((d.faculty[0].subjects || []).join(', '));
          setSections((d.faculty[0].sections || []).join(', '));
        }
      } catch (e) {
        setMsg(e.message || 'Error fetching faculty');
        setBad(true);
      }
    })();
  }, [refreshKey]);

  function select(e) {
    const value = e.target.value;
    const f = faculty.find((x) => x._id === value);
    setId(value);
    setCourses((f?.courses || []).join(', '));
    setSubjects((f?.subjects || []).join(', '));
    setSections((f?.sections || []).join(', '));
    setMsg('');
    setBad(false);
  }

  async function save() {
    setBusy(true);
    setMsg('');
    setBad(false);
    try {
      const r = await fetch('/api/admin/faculty', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facultyId: id, courses, subjects, sections })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || 'Could not update faculty mappings');
      setMsg(
        `Subject & section mappings saved!${
          d.routedQueries
            ? ` ${d.routedQueries} previously unassigned ${
                d.routedQueries === 1 ? 'query was' : 'queries were'
              } automatically routed to them.`
            : ''
        }`
      );
      setFaculty((list) =>
        list.map((f) =>
          f._id === id
            ? { ...f, courses: d.faculty.courses, subjects: d.faculty.subjects, sections: d.faculty.sections }
            : f
        )
      );
    } catch (e) {
      setMsg(e.message);
      setBad(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
          <BookOpen size={20} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg text-white">Update Subject Mappings</h2>
          <p className="text-xs text-slate-400">
            Saving mappings triggers automatic triage re-evaluation for unassigned queries.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-xs font-semibold text-slate-300">
          Select Faculty Member
          <select
            className="field mt-1.5"
            value={id}
            onChange={select}
            required
          >
            <option value="" disabled>Select faculty</option>
            {faculty.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.email}) · Dept: {f.department || 'CSE'}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-semibold text-slate-300">
          Assigned Courses (comma separated)
          <input
            className="field mt-1.5"
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            placeholder="e.g. BTech CSE, MCA"
          />
        </label>

        <label className="block text-xs font-semibold text-slate-300">
          Subjects Taught (comma separated)
          <input
            className="field mt-1.5"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            required
            placeholder="e.g. Data Structures, Operating Systems"
          />
        </label>

        <label className="block text-xs font-semibold text-slate-300">
          Assigned Sections (comma separated)
          <input
            className="field mt-1.5"
            value={sections}
            onChange={(e) => setSections(e.target.value)}
            placeholder="e.g. K22AB, Section A, K22CD"
          />
        </label>

        {msg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
              bad
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-lime-500/10 border-lime-500/30 text-lime-300'
            }`}
          >
            {bad ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            <span>{msg}</span>
          </div>
        )}

        <button
          type="button"
          className="btn btn-secondary text-xs font-bold w-full py-3"
          disabled={busy || !faculty.length || !id}
          onClick={save}
        >
          {busy ? 'Saving Mappings…' : 'Save Subject Mappings'}
        </button>
      </div>

      {/* Directory of Current Mappings */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Active Faculty Directory ({faculty.length})
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {faculty.map((fac) => (
            <div
              key={fac._id}
              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                fac._id === id
                  ? 'bg-violet-950/20 border-violet-500/40'
                  : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{fac.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{fac.department}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{fac.email}</p>
              <div className="flex gap-1 flex-wrap pt-0.5">
                {(fac.subjects || []).map((s) => (
                  <span
                    key={s}
                    className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-cyan-300 font-mono"
                  >
                    {s}
                  </span>
                ))}
                {(fac.sections || []).map((sec) => (
                  <span
                    key={sec}
                    className="px-1.5 py-0.5 rounded bg-violet-950/40 border border-violet-800/40 text-[10px] text-violet-300 font-mono"
                  >
                    Sec: {sec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
