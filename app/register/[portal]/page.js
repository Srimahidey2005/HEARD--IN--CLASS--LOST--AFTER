import Link from 'next/link';
<<<<<<< HEAD
import { notFound } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';
import { dashboardFor } from '@/lib/portal';
import { Sparkles, GraduationCap, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';
=======
import { notFound, redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
import { dashboardFor } from '@/lib/portal';
import { Sparkles, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2

export const dynamic = 'force-dynamic';

export default async function RegisterRolePage({ params }) {
  const { portal } = await params;
<<<<<<< HEAD
  if (portal !== 'student' && portal !== 'faculty' && portal !== 'admin') notFound();
=======
  if (portal !== 'student' && portal !== 'faculty') notFound();
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {}

<<<<<<< HEAD
  const facultyClosed = portal === 'faculty' && !process.env.FACULTY_REGISTRATION_CODE;
  const isStudent = portal === 'student';
  const isAdmin = portal === 'admin';
  const Icon = isStudent ? GraduationCap : isAdmin ? ShieldCheck : BookOpen;

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-[var(--bg-main)] relative">
      <div className="card p-8 md:p-10 w-full max-w-md shadow-card relative z-10 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#A99AEF] flex items-center justify-center font-bold text-black text-sm">
                <Sparkles size={16} />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
                Heard in Class<span className="text-[#A99AEF]">.</span>
              </span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-[#A99AEF]/15 border-[#A99AEF]/30 text-[#A99AEF]">
              {portal.toUpperCase()} ONBOARDING
            </span>
            <Icon size={18} className="text-[#A99AEF]" />
          </div>

          <h1 className="font-heading text-2xl font-extrabold text-[var(--text-primary)] mt-2 tracking-tight">
            {isAdmin
              ? 'Create Administrator Account'
              : isStudent
              ? 'Create Student Account'
              : 'Create Faculty Account'}
          </h1>
          <p className="text-[var(--text-secondary)] text-xs mt-1.5 leading-relaxed font-normal">
            {isAdmin
              ? 'Official administrator registration. Email address must use the @admin.in domain (e.g. abc@admin.in).'
              : isStudent
=======
  if (user && user.role === portal) redirect(dashboardFor(user.role));

  const facultyClosed = portal === 'faculty' && !process.env.FACULTY_REGISTRATION_CODE;
  const isStudent = portal === 'student';
  const Icon = isStudent ? GraduationCap : BookOpen;
  const badgeColor = isStudent
    ? 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40'
    : 'text-violet-400 bg-violet-950/40 border-violet-800/40';

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-[#0B1020] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="card p-8 md:p-10 w-full max-w-md border border-white/10 shadow-card relative z-10 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center font-black text-white text-sm shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles size={16} />
            </div>
            <span className="font-heading font-black text-xl tracking-tight text-white">
              Heard in Class<span className="text-cyan-400">.</span>
            </span>
          </Link>

          <div className="mt-6 flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
              {portal.toUpperCase()} ONBOARDING
            </span>
            <Icon size={18} className="text-slate-400" />
          </div>

          <h1 className="font-heading text-2xl font-extrabold text-white mt-2 tracking-tight">
            {isStudent ? 'Create Student Account' : 'Create Faculty Account'}
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            {isStudent
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
              ? 'Use your official @lpu.in email address and institutional registration number.'
              : 'Use your university credentials and departmental faculty registration access code.'}
          </p>
        </div>

<<<<<<< HEAD
        {user && (
          <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div>
              <p className="text-[var(--text-primary)] font-medium">
                Active session: <strong>{user.name}</strong> ({user.role})
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">You can register a new account below or return to dashboard.</p>
            </div>
            <Link
              href={dashboardFor(user.role)}
              className="px-3 py-1.5 rounded-xl bg-[#A99AEF] hover:bg-[#9785e7] text-black font-semibold text-[11px] shrink-0"
            >
              Dashboard →
            </Link>
          </div>
        )}

        {facultyClosed ? (
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-secondary)] text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <AlertCircle size={16} className="text-[#A99AEF]" />
=======
        {facultyClosed ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle size={16} />
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
              <span>Self-Registration Closed</span>
            </div>
            <p className="leading-relaxed">
              Faculty accounts must be created directly by the system administrator. Please request an account from your department coordinator.
            </p>
          </div>
        ) : (
          <AuthForm portal={portal} mode="register" />
        )}

<<<<<<< HEAD
        <div className="pt-2 border-t border-[var(--border-card)] text-xs text-[var(--text-secondary)] text-center">
          <span>Already registered? </span>
          <Link
            href={`/login/${portal}`}
            className="font-bold text-[#A99AEF] hover:underline"
          >
=======
        <div className="pt-2 border-t border-white/5 text-xs text-slate-400 text-center">
          <span>Already registered? </span>
          <Link href={`/login/${portal}`} className="text-cyan-400 font-semibold hover:underline">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            Sign in here
          </Link>
        </div>
      </div>
    </main>
  );
}
