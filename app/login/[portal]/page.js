import Link from 'next/link';
import { notFound } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import AdminCreateAccountSection from '@/components/AdminCreateAccountSection';
import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';
import { PORTALS, dashboardFor } from '@/lib/portal';
import {
  Sparkles,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  LogOut,
  UserPlus,
  ArrowRight,
  UserCheck,
  KeyRound,
  RotateCcw
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const COPY = {
  student: {
    title: 'Student Sign In',
    hint: 'Authenticate with your official institutional @lpu.in address.',
    icon: GraduationCap,
  },
  faculty: {
    title: 'Faculty Sign In',
    hint: 'Access your assigned course queries and manage office hours.',
    icon: BookOpen,
  },
  admin: {
    title: 'Administrator Console',
    hint: 'Institutional triage, faculty mappings and system oversight.',
    icon: ShieldCheck,
  },
};

export default async function RoleLoginPage({ params, searchParams }) {
  const { portal } = await params;
  if (!PORTALS.includes(portal)) notFound();

  const sParams = (await searchParams) || {};
  const isSwitching = sParams.switch === 'true';

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {}

  const { title, hint, icon: Icon } = COPY[portal];
  const isAdmin = portal === 'admin';
  const hasMatchingRole = user && user.role === portal;

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
              {portal.toUpperCase()} PORTAL
            </span>
            <Icon size={18} className="text-[#A99AEF]" />
          </div>

          <h1 className="font-heading text-2xl font-extrabold text-[var(--text-primary)] mt-2 tracking-tight">
            {hasMatchingRole && !isSwitching
              ? `${title} — Active Session`
              : title}
          </h1>
          <p className="text-[var(--text-secondary)] text-xs mt-1.5 leading-relaxed font-normal">
            {hasMatchingRole && !isSwitching
              ? `You are currently authenticated as an ${portal}. Choose an option below:`
              : hint}
          </p>
        </div>

        {/* If user has an active session of this role and is NOT explicitly switching, show choice options */}
        {hasMatchingRole && !isSwitching ? (
          <div className="space-y-4 animate-fadeIn">
            {/* Active User Capsule */}
            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A99AEF] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A99AEF]" />
                  Signed In As {user.role.toUpperCase()}
                </span>
                {user.registrationNumber && (
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    ID: {user.registrationNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-11 h-11 rounded-xl bg-[#A99AEF]/15 border border-[#A99AEF]/30 flex items-center justify-center text-[#A99AEF] font-bold text-base">
                  {user.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="font-bold text-[var(--text-primary)] text-sm truncate">{user.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate font-mono">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Action Option 1: Continue to Portal */}
            <Link
              href={dashboardFor(user.role)}
              className="btn btn-primary w-full py-3.5 px-5 rounded-2xl text-black text-sm font-bold flex items-center justify-center gap-2"
            >
              <UserCheck size={18} className="text-black" />
              <span>Continue to {isAdmin ? 'Admin Console' : `${portal.toUpperCase()} Dashboard`}</span>
              <ArrowRight size={16} className="text-black" />
            </Link>

            {/* Action Option 2: Sign In with Another Account */}
            <Link
              href={`/login/${portal}?switch=true`}
              className="btn btn-secondary w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <KeyRound size={15} className="text-[#A99AEF]" />
              <span>Sign In with a Different Account</span>
            </Link>

            {/* Action Option 3: Create Account */}
            <Link
              href={`/register/${portal}`}
              className="btn btn-secondary w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <UserPlus size={15} className="text-[#A99AEF]" />
              <span>Create New {isAdmin ? 'Administrator' : portal.toUpperCase()} Account</span>
            </Link>

            {/* Action Option 4: Sign Out */}
            <a
              href={`/api/auth/logout?redirect=/login/${portal}`}
              className="w-full py-2.5 px-4 rounded-xl text-xs text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center gap-1.5 transition-all text-center block"
            >
              <LogOut size={14} />
              <span>Sign out completely</span>
            </a>
          </div>
        ) : (
          /* Normal Sign-In Form or Switch Account Form */
          <>
            {user && (
              <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-xs space-y-2">
                <p className="text-[var(--text-primary)]">
                  Currently authenticated as <strong>{user.name}</strong> ({user.role.toUpperCase()}: {user.email}).
                </p>
                <div className="flex items-center gap-2">
                  {hasMatchingRole && isSwitching && (
                    <Link
                      href={`/login/${portal}`}
                      className="text-xs text-[#A99AEF] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw size={12} />
                      <span>Back to active session</span>
                    </Link>
                  )}
                  <a
                    href={`/api/auth/logout?redirect=/login/${portal}`}
                    className="text-xs text-rose-500 hover:underline ml-auto font-semibold flex items-center gap-1"
                  >
                    <LogOut size={12} />
                    <span>Sign out</span>
                  </a>
                </div>
              </div>
            )}

            <AuthForm portal={portal} mode="login" />

            <div className="pt-2 border-t border-[var(--border-card)] space-y-3 text-xs text-[var(--text-secondary)]">
              {portal === 'admin' ? (
                <AdminCreateAccountSection />
              ) : (
                <p>
                  New {portal}?{' '}
                  <Link href={`/register/${portal}`} className="text-[#A99AEF] font-semibold hover:underline">
                    Create an account
                  </Link>
                </p>
              )}

              <p>
                Wrong portal?{' '}
                <Link href="/login" className="text-[#A99AEF] font-semibold hover:underline">
                  Choose another portal
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
