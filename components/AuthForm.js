"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  isLpuEmail,
  isAdminEmail,
  normalizeEmail,
  LPU_EMAIL_MESSAGE,
  ADMIN_EMAIL_MESSAGE,
  checkPasswordStrength,
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE
} from '@/lib/validators';
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
  UserPlus,
  ShieldCheck,
  Check,
  CheckCircle2
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
    register: 'Create Administrator Account',
    emailPlaceholder: 'username@admin.in',
    tagline: 'Academic triage and platform administration'
  },
};

const EMPTY = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
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
  const strength = checkPasswordStrength(form.password);

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

    // Enforce official @admin.in email domain for administrators
    if (portal === 'admin') {
      if (register && !isAdminEmail(email)) {
        setError(ADMIN_EMAIL_MESSAGE);
        return;
      }
      if (!register && !isAdminEmail(email) && email !== 'admin@heardinclass.edu') {
        setError('Administrator login requires an official @admin.in email address (e.g. abc@admin.in).');
        return;
      }
      if (register) {
        if (!form.registrationNumber || form.registrationNumber.trim().length < 3) {
          setError('Please enter your Administrator ID (e.g. ADM-101, minimum 3 characters).');
          return;
        }
      }
    }

    // Enforce password strength requirements during account creation
    if (register) {
      if (!strength.isValid) {
        setError(PASSWORD_REQUIREMENTS_MESSAGE);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
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
        : portal === 'admin'
        ? {
            name: form.name.trim(),
            email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            registrationNumber: form.registrationNumber.trim()
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
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          Full Name
          <input
            className="field mt-1"
            name="name"
            value={form.name}
            onChange={change}
            required
            placeholder={portal === 'admin' ? 'e.g. Dr. Alex Vance' : 'e.g. John Doe'}
          />
        </label>
      )}

      {register && portal === 'student' && (
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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

      {register && portal === 'admin' && (
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          Administrator ID
          <input
            className="field mt-1 font-mono uppercase"
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={change}
            required
            placeholder="e.g. ADM-101"
          />
          <span className="text-[11px] text-[#A99AEF] font-medium mt-1 block">
            Official institutional administrator ID.
          </span>
        </label>
      )}

      {portal === 'admin' && !register && (
        <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#A99AEF] block">Authorized Admin Credential</span>
            <span className="text-[var(--text-primary)] font-mono font-bold text-xs">admin@heardinclass.edu</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                email: 'admin@heardinclass.edu',
                password: 'Admin@12345'
              }));
              setError('');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#A99AEF] text-black text-xs font-bold hover:bg-[#C6B9FF] transition-all shrink-0 flex items-center gap-1"
          >
            <span>Auto-Fill</span>
          </button>
        </div>
      )}

      <label className="block text-xs font-semibold text-[var(--text-secondary)]">
        {portal === 'faculty'
          ? 'Official University Email'
          : portal === 'admin'
          ? 'Administrator Email (@admin.in)'
          : 'Email Address'}
        <input
          className="field mt-1"
          name="email"
          type="email"
          value={form.email}
          onChange={change}
          required
          placeholder={labels.emailPlaceholder}
        />
        {portal === 'admin' && register && (
          <span className="text-[11px] text-[#A99AEF] font-medium mt-1 block">
            Only @admin.in addresses are accepted (e.g. abc@admin.in)
          </span>
        )}
      </label>

      {register && portal === 'student' && (
        <div className="space-y-3 p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)]">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#A99AEF] font-bold">
            <GraduationCap size={14} />
            <span>Academic Program &amp; Branch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Course Dropdown */}
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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

            {/* 2. Branch Dropdown */}
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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

          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-card)]">
              {selectedCourse === 'Other' && (
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
            Assigned Courses (comma separated)
            <input
              className="field mt-1"
              name="courses"
              value={form.courses}
              onChange={change}
              placeholder="BTech CSE, MCA"
            />
          </label>
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
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

      {register && portal === 'faculty' && (
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          Faculty Secret Access Code
          <input
            className="field mt-1"
            name="accessCode"
            type="password"
            value={form.accessCode}
            onChange={change}
            required
            placeholder="Faculty registration code (required)"
          />
        </label>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">Password</label>
          {!register && (
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#A99AEF] hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <input
          className="field mt-1"
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          required
          minLength={register ? 8 : 6}
          placeholder={register ? 'Must be 8+ chars (A-Z, a-z, 0-9, special)' : '••••••••'}
        />

        {register && form.password.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-2 mt-2 text-[11px] animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--text-primary)]">Password Requirements:</span>
              <span
                className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  strength.isValid
                    ? 'bg-[var(--primary-soft)] text-[#A99AEF] border border-[#A99AEF]/30'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                }`}
              >
                {strength.isValid ? 'STRONG PASSWORD ✓' : 'REQUIREMENTS PENDING'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  strength.hasMinLength ? 'text-[#A99AEF] font-semibold' : 'text-[var(--text-muted)]'
                }`}
              >
                <Check size={13} className={strength.hasMinLength ? 'text-[#A99AEF]' : 'opacity-30'} />
                <span>8+ Characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  strength.hasUpper ? 'text-[#A99AEF] font-semibold' : 'text-[var(--text-muted)]'
                }`}
              >
                <Check size={13} className={strength.hasUpper ? 'text-[#A99AEF]' : 'opacity-30'} />
                <span>Uppercase (A-Z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  strength.hasLower ? 'text-[#A99AEF] font-semibold' : 'text-[var(--text-muted)]'
                }`}
              >
                <Check size={13} className={strength.hasLower ? 'text-[#A99AEF]' : 'opacity-30'} />
                <span>Lowercase (a-z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  strength.hasNumber ? 'text-[#A99AEF] font-semibold' : 'text-[var(--text-muted)]'
                }`}
              >
                <Check size={13} className={strength.hasNumber ? 'text-[#A99AEF]' : 'opacity-30'} />
                <span>Numeric (0-9)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 col-span-2 transition-colors ${
                  strength.hasSpecial ? 'text-[#A99AEF] font-semibold' : 'text-[var(--text-muted)]'
                }`}
              >
                <Check size={13} className={strength.hasSpecial ? 'text-[#A99AEF]' : 'opacity-30'} />
                <span>Special character (!@#$%^&*...)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {register && (
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">Confirm Password</label>
          <input
            className="field mt-1"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={change}
            required
            minLength={8}
            placeholder="Re-enter your password"
          />

          {form.confirmPassword.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              {form.password === form.confirmPassword ? (
                <span className="text-[#A99AEF] flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Passwords match</span>
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} />
                  <span>Passwords do not match</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Direct Prompt to Create Account if email is not found */}
      {notRegisteredInfo && (
        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-primary)] text-xs space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <UserPlus size={18} className="text-[#A99AEF] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[var(--text-primary)] text-sm">Account Not Found</p>
              <p className="text-[var(--text-secondary)] mt-1 leading-relaxed">
                No registered {portal} account was found for <strong className="text-[var(--text-primary)]">{notRegisteredInfo.email}</strong>.
              </p>
            </div>
          </div>
          <Link
            href={notRegisteredInfo.registerUrl}
            className="btn w-full text-xs font-bold justify-center py-2.5 flex items-center gap-2 rounded-xl"
          >
            <span>Create {portal === 'student' ? 'Student' : portal === 'admin' ? 'Administrator' : 'Faculty'} Account with this Email</span>
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
        className="btn w-full font-bold flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl transition-all"
        disabled={busy}
      >
        {busy ? (
          <>
            <Sparkles size={16} className="animate-spin text-black" />
            <span>Processing…</span>
          </>
        ) : (
          <>
            <span>
              {register
                ? portal === 'admin'
                  ? 'Create Administrator Account'
                  : 'Create Account'
                : 'Sign In'}
            </span>
            <ArrowRight size={16} className="text-black" />
          </>
        )}
      </button>
    </form>
  );
}
