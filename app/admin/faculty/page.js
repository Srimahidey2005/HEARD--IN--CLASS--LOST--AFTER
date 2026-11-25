"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  GraduationCap,
  ArrowLeft,
  ChevronRight,
  ShieldCheck
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
          `Faculty account provisioned successfully for ${d.faculty?.name}!${
            d.routedQueries
              ? ` ${d.routedQueries} previously waiting ${d.routedQueries === 1 ? 'doubt was' : 'doubts were'} automatically routed.`
              : ''
          }`
        );
        setF({ ...EMPTY, name: '', email: '', password: '', courses: '', subjects: '', sections: '' });
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
    <div className="space-y-10 pb-12">
      {/* Top Header */}
      <div className="card p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="btn btn-secondary inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Command Center</span>
            </Link>
            <span className="text-xs font-mono uppercase tracking-widest text-[#A99AEF] font-bold">
              · Academic Personnel
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
            Faculty Directory &amp; Mappings
          </h1>
          <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-normal">
            Provision verified instructor credentials, configure academic departments, and map courses, subjects, and section assignments for automatic doubt triage.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="px-4 py-2 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-primary)] font-mono text-xs font-bold border border-[var(--border-card)]">
            Module 02 · Administration
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create Faculty (6 cols) */}
        <div className="lg:col-span-6 card p-7 md:p-9 space-y-6">
          <div className="flex items-center gap-3.5 pb-5 border-b border-[var(--border-card)]">
            <div className="p-3 rounded-2xl bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Provision Faculty Account</h2>
              <p className="text-xs text-[var(--text-secondary)]">Creates institutional credentials with role: faculty.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Faculty Full Name
              </label>
              <input
                className="field text-xs md:text-sm"
                name="name"
                value={f.name}
                onChange={c}
                required
                placeholder="e.g. Dr. Ramesh Sharma"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Official University Email (@lpu.in)
              </label>
              <input
                className="field text-xs md:text-sm"
                type="email"
                name="email"
                value={f.email}
                onChange={c}
                required
                placeholder="e.g. ramesh.sharma@lpu.in"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Temporary Password (min. 8 characters)
              </label>
              <input
                className="field text-xs md:text-sm"
                type="password"
                minLength={8}
                name="password"
                value={f.password}
                onChange={c}
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Academic Department
              </label>
              <input
                className="field text-xs md:text-sm"
                name="department"
                value={f.department}
                onChange={c}
                required
                placeholder="e.g. CSE, Mathematics, Mechanical"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Assigned Degree Courses (comma separated)
              </label>
              <input
                className="field text-xs md:text-sm"
                name="courses"
                value={f.courses}
                onChange={c}
                placeholder="e.g. BTech CSE, MCA, BCA"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Subjects Taught (comma separated)
              </label>
              <input
                className="field text-xs md:text-sm"
                name="subjects"
                value={f.subjects}
                onChange={c}
                required
                placeholder="e.g. Data Structures, Operating Systems, Algorithms"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Assigned Class Sections (comma separated)
              </label>
              <input
                className="field text-xs md:text-sm"
                name="sections"
                value={f.sections}
                onChange={c}
                placeholder="e.g. K22AB, Section A, K22CD"
              />
            </div>

            {msg && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border animate-fadeIn ${
                  bad
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                    : 'bg-[#A99AEF]/15 border-[#A99AEF]/30 text-[var(--text-primary)]'
                }`}
              >
                {bad ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-[#A99AEF]" />}
                <span>{msg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full py-4 rounded-2xl text-black font-bold text-xs md:text-sm mt-2"
              disabled={busy}
            >
              {busy ? 'Provisioning Account…' : 'Create & Provision Faculty Account'}
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
                d.routedQueries === 1 ? 'doubt was' : 'doubts were'
              } automatically routed.`
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
    <section className="card p-7 md:p-9 space-y-6">
      <div className="flex items-center gap-3.5 pb-5 border-b border-[var(--border-card)]">
        <div className="p-3 rounded-2xl bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
          <BookOpen size={22} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Update Subject Mappings</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Saving mappings re-triggers automated triage routing for waiting doubts.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
            Select Faculty Member
          </label>
          <select
            className="field text-xs md:text-sm"
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
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
            Assigned Degree Courses (comma separated)
          </label>
          <input
            className="field text-xs md:text-sm"
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            placeholder="e.g. BTech CSE, MCA"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
            Subjects Taught (comma separated)
          </label>
          <input
            className="field text-xs md:text-sm"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            required
            placeholder="e.g. Data Structures, Operating Systems"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
            Assigned Class Sections (comma separated)
          </label>
          <input
            className="field text-xs md:text-sm"
            value={sections}
            onChange={(e) => setSections(e.target.value)}
            placeholder="e.g. K22AB, Section A, K22CD"
          />
        </div>

        {msg && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border animate-fadeIn ${
              bad
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                : 'bg-[#A99AEF]/15 border-[#A99AEF]/30 text-[var(--text-primary)]'
            }`}
          >
            {bad ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-[#A99AEF]" />}
            <span>{msg}</span>
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary w-full py-4 rounded-2xl text-black font-bold text-xs md:text-sm mt-2"
          disabled={busy || !faculty.length || !id}
          onClick={save}
        >
          {busy ? 'Saving Mappings…' : 'Save Subject & Section Mappings'}
        </button>
      </div>

      {/* Directory of Current Mappings */}
      <div className="pt-6 border-t border-[var(--border-card)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Active Faculty Roster ({faculty.length})
          </h3>
          <span className="text-[11px] font-mono text-[#A99AEF]">Auto-Routing Active</span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {faculty.map((fac) => (
            <div
              key={fac._id}
              className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                fac._id === id
                  ? 'bg-[var(--bg-elevated)] border-[#A99AEF]'
                  : 'bg-[var(--bg-main)] border-[var(--border-card)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-[var(--text-primary)] text-sm">{fac.name}</span>
                <span className="text-[11px] text-[#A99AEF] font-mono font-bold px-2 py-0.5 rounded-full bg-[#A99AEF]/15 border border-[#A99AEF]/30">
                  {fac.department}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] truncate">{fac.email}</p>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {(fac.subjects || []).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-[10px] text-[var(--text-secondary)] font-mono"
                  >
                    {s}
                  </span>
                ))}
                {(fac.sections || []).map((sec) => (
                  <span
                    key={sec}
                    className="px-2.5 py-0.5 rounded-full bg-[#A99AEF]/15 border border-[#A99AEF]/30 text-[10px] text-[#A99AEF] font-mono font-bold"
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
