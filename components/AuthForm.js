"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isLpuEmail, normalizeEmail, LPU_EMAIL_MESSAGE } from '@/lib/validators';
import {
  ACADEMIC_PROGRAMS,
  formatCourseString
} from '@/lib/courses';
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  User,
  BookOpen,
  Layers,
  GraduationCap,
  UserPlus
} from 'lucide-react';

const LABELS = {
  student: {
    login: 'Sign in to Student Portal',
    register: 'Create Student Account',
    emailPlaceholder: 'name@lpu.in',
    tagline: 'Access doubts, faculty replies and office hours'
  },
  faculty: {
    login: 'Sign in to Faculty Portal',
    register: 'Create Faculty Account',
    emailPlaceholder: 'name@lpu.in',
    tagline: 'Manage assigned queries and consultation schedule'
  },
  admin: {
    login: 'Sign in to Admin Console',
    register: '',
    emailPlaceholder: 'admin@heardinclass.edu',
    tagline: 'Academic triage and platform administration'
  },
};

const EMPTY = {
  name: '',
  email: '',
  password: '',
  registrationNumber: '',
  semester: '4',
  department: 'CSE',
  courses: '',
  subjects: '',
  accessCode: ''
};

export default function AuthForm({ portal = 'student', mode = 'login' }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [notRegisteredInfo, setNotRegisteredInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  // Student Course & Branch state
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering (CSE)');
  const [customCourse, setCustomCourse] = useState('');
  const [customBranch, setCustomBranch] = useState('');

  // Auto-prefill email if passed in query string (e.g. from sign-in redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) {
        setForm((prev) => ({ ...prev, email: emailParam }));
      }
    }
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (notRegisteredInfo) setNotRegisteredInfo(null);
  };

  const register = mode === 'register';
  const labels = LABELS[portal];

  const currentProg = ACADEMIC_PROGRAMS.find((p) => p.course === selectedCourse) || ACADEMIC_PROGRAMS[0];
  const availableBranches = currentProg ? currentProg.branches : ['Other'];

  const handleCourseChange = (newCourse) => {
    setSelectedCourse(newCourse);
    const prog = ACADEMIC_PROGRAMS.find((p) => p.course === newCourse);
    if (prog) {
      setSelectedBranch(prog.defaultBranch);
    } else {
      setSelectedBranch('General Specialization');
    }
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    setNotRegisteredInfo(null);
    const email = normalizeEmail(form.email);

    // Enforce official LPU email domain for students
    if (portal === 'student' && !isLpuEmail(email)) {
      setError(LPU_EMAIL_MESSAGE);
      return;
    }

    setBusy(true);
    try {
      const studentFormattedCourse = formatCourseString({
        selectedCourse,
        selectedBranch,
        customCourse,
        customBranch
      });

      const payload = !register
        ? { email, password: form.password }
        : portal === 'student'
        ? {
            name: form.name.trim(),
            email,
            password: form.password,
            registrationNumber: form.registrationNumber.trim(),
            course: studentFormattedCourse,
            semester: Number(form.semester)
          }
        : {
            name: form.name.trim(),
            email,
            password: form.password,
            department: form.department.trim(),
            courses: form.courses,
            subjects: form.subjects,
            accessCode: form.accessCode
          };

      const response = await fetch(`/api/auth/${portal}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error('Server returned an unexpected response. Please try again.');
      }

      // If the email is not registered, guide user directly to account creation
      if (data.notRegistered) {
        setNotRegisteredInfo({
          email: data.email || email,
          registerUrl: data.registerUrl || `/register/${portal}?email=${encodeURIComponent(email)}`,
          message: data.message
        });
        setError('');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || `Request failed (HTTP ${response.status}).`);
      }

      if (!data.redirect) {
        throw new Error('Missing account redirect information.');
      }

      router.push(data.redirect);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {register && (
        <label className="block text-xs font-semibold text-slate-300">
          Full Name
          <input
            className="field mt-1"
            name="name"
            value={form.name}
            onChange={change}
            required
            placeholder="e.g. John Doe"
          />
        </label>
      )}

      {register && portal === 'student' && (
        <label className="block text-xs font-semibold text-slate-300">
          Official Registration Number
          <input
            className="field mt-1"
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={change}
            required
            placeholder="e.g. 12204589"
          />
        </label>
      )}

      <label className="block text-xs font-semibold text-slate-300">
        {portal === 'faculty' ? 'Official University Email' : 'Email Address'}
        <input
          className="field mt-1"
          name="email"
          type="email"
          value={form.email}
          onChange={change}
          required
          placeholder={labels.emailPlaceholder}
        />
      </label>

      {register && portal === 'student' && (
        <div className="space-y-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            <GraduationCap size={14} />
            <span>Academic Program &amp; Branch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Course Dropdown */}
            <label className="block text-xs font-semibold text-slate-300">
              1. Course / Degree
              <select
                className="field mt-1"
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
                required
              >
                {ACADEMIC_PROGRAMS.map((prog) => (
                  <option key={prog.course} value={prog.course}>
                    {prog.label}
                  </option>
                ))}
              </select>
            </label>

            {/* 2. Branch Dropdown (Changes dynamically with selected course) */}
            <label className="block text-xs font-semibold text-slate-300">
              2. Branch / Specialization
              <select
                className="field mt-1"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
              >
                {availableBranches.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-300">
            3. Current Semester
            <select
              className="field mt-1"
              name="semester"
              value={form.semester}
              onChange={change}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => (
                <option key={x} value={x}>Semester {x}</option>
              ))}
            </select>
          </label>

          {/* Conditional inputs for 'Other' */}
          {(selectedCourse === 'Other' || selectedBranch === 'Other') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
              {selectedCourse === 'Other' && (
                <label className="block text-xs font-semibold text-slate-300">
                  Custom Course Name
                  <input
                    className="field mt-1"
                    value={customCourse}
                    onChange={(e) => setCustomCourse(e.target.value)}
                    placeholder="e.g. Integrated M.Sc"
                    required
                  />
                </label>
              )}
              {selectedBranch === 'Other' && (
                <label className="block text-xs font-semibold text-slate-300">
                  Custom Branch Name
                  <input
                    className="field mt-1"
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    placeholder="e.g. Nanotechnology"
                    required
                  />
                </label>
              )}
            </div>
          )}
        </div>
      )}

      {register && portal === 'faculty' && (
        <>
          <label className="block text-xs font-semibold text-slate-300">
            Department
            <input
              className="field mt-1"
              name="department"
              value={form.department}
              onChange={change}
              required
              placeholder="e.g. CSE"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Assigned Courses (comma separated)
            <input
              className="field mt-1"
              name="courses"
              value={form.courses}
              onChange={change}
              placeholder="BTech CSE, MCA"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Subjects Taught (comma separated)
            <input
              className="field mt-1"
              name="subjects"
              value={form.subjects}
              onChange={change}
              required
              placeholder="e.g. Data Structures, Operating Systems"
            />
          </label>
        </>
      )}

      {register && (
        <label className="block text-xs font-semibold text-slate-300">
          Faculty Secret Access Code
          <input
            className="field mt-1"
            name="accessCode"
            type="password"
            value={form.accessCode}
            onChange={change}
            placeholder={portal === 'faculty' ? 'Faculty registration code (required)' : 'Leave blank for students'}
          />
        </label>
      )}

      <label className="block text-xs font-semibold text-slate-300">
        Password
        <input
          className="field mt-1"
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          required
          minLength={6}
          placeholder="••••••••"
        />
      </label>

      {/* Direct Prompt to Create Account if email is not found */}
      {notRegisteredInfo && (
        <div className="p-4 rounded-xl bg-violet-950/60 border border-violet-500/40 text-white text-xs space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <UserPlus size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-cyan-300 text-sm">Account Not Found</p>
              <p className="text-slate-300 mt-1 leading-relaxed">
                No registered {portal} account was found for <strong className="text-white">{notRegisteredInfo.email}</strong>.
              </p>
            </div>
          </div>
          <Link
            href={notRegisteredInfo.registerUrl}
            className="btn btn-lime text-xs font-bold w-full justify-center py-2.5 flex items-center gap-2 shadow-glow-lime"
          >
            <span>Create {portal === 'student' ? 'Student' : 'Faculty'} Account with this Email</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-lime w-full font-bold flex items-center justify-center gap-2 py-3 mt-2 shadow-glow-lime"
        disabled={busy}
      >
        {busy ? (
          <>
            <Sparkles size={16} className="animate-spin text-midnight" />
            <span>Processing…</span>
          </>
        ) : (
          <>
            <span>{register ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={16} className="text-midnight" />
          </>
        )}
      </button>
    </form>
  );
}
