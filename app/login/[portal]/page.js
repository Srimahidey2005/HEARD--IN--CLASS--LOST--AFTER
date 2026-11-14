import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
import { PORTALS, dashboardFor } from '@/lib/portal';
import { Sparkles, ShieldCheck, GraduationCap, BookOpen, LogOut } from 'lucide-react';

const COPY = {
  student: {
    title: 'Student Sign In',
    hint: 'Authenticate with your official institutional @lpu.in address.',
    icon: GraduationCap,
    badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40'
  },
  faculty: {
    title: 'Faculty Sign In',
    hint: 'Access your assigned course queries and manage office hours.',
    icon: BookOpen,
    badgeColor: 'text-violet-400 bg-violet-950/40 border-violet-800/40'
  },
  admin: {
    title: 'Administrator Console',
    hint: 'Institutional triage, faculty mappings and system oversight.',
    icon: ShieldCheck,
    badgeColor: 'text-lime-400 bg-lime-950/40 border-lime-800/40'
  },
};

export default async function RoleLoginPage({ params }) {
  const { portal } = await params;
  if (!PORTALS.includes(portal)) notFound();

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {}

  if (user?.role === portal) {
    redirect(dashboardFor(user.role));
  }

  const { title, hint, icon: Icon, badgeColor } = COPY[portal];

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
              {portal.toUpperCase()} PORTAL
            </span>
            <Icon size={18} className="text-slate-400" />
          </div>

          <h1 className="font-heading text-2xl font-extrabold text-white mt-2 tracking-tight">
            {title}
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{hint}</p>

          {user && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-2">
              <p>
                ⚡ You are currently authenticated as <strong>{user.name}</strong> ({user.role.toUpperCase()}: {user.email}). Sign in below to switch accounts, or:
              </p>
              <a
                href={`/api/auth/logout?redirect=/login/${portal}`}
                className="btn btn-secondary text-xs text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/30 border-rose-500/30 w-full justify-center py-2 flex items-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Sign out of current account</span>
              </a>
            </div>
          )}
        </div>

        <AuthForm portal={portal} mode="login" />

        <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-slate-400">
          {portal !== 'admin' && (
            <p>
              New {portal}?{' '}
              <Link href={`/register/${portal}`} className="text-cyan-400 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          )}
          <p>
            Wrong portal?{' '}
            <Link href="/login" className="text-violet-400 font-semibold hover:underline">
              Choose another portal
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
