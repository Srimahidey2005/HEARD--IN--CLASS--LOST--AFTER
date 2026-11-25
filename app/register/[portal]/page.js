import Link from 'next/link';
import { notFound } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';
import { dashboardFor } from '@/lib/portal';
import { Sparkles, GraduationCap, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RegisterRolePage({ params }) {
  const { portal } = await params;
  if (portal !== 'student' && portal !== 'faculty' && portal !== 'admin') notFound();

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {}

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
              ? 'Use your official @lpu.in email address and institutional registration number.'
              : 'Use your university credentials and departmental faculty registration access code.'}
          </p>
        </div>

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
              <span>Self-Registration Closed</span>
            </div>
            <p className="leading-relaxed">
              Faculty accounts must be created directly by the system administrator. Please request an account from your department coordinator.
            </p>
          </div>
        ) : (
          <AuthForm portal={portal} mode="register" />
        )}

        <div className="pt-2 border-t border-[var(--border-card)] text-xs text-[var(--text-secondary)] text-center">
          <span>Already registered? </span>
          <Link
            href={`/login/${portal}`}
            className="font-bold text-[#A99AEF] hover:underline"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </main>
  );
}
