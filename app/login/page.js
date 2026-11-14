import Link from 'next/link';
import { GraduationCap, BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginChooserPage() {
  const portals = [
    [
      'student',
      'Student Portal',
      'Submit academic queries, track faculty responses, and schedule office hours.',
      GraduationCap,
      'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-400 hover:border-cyan-400'
    ],
    [
      'faculty',
      'Faculty Portal',
      'Review assigned queries, submit explanations, and manage consultation appointments.',
      BookOpen,
      'from-violet-500/20 to-purple-600/10 border-violet-500/30 text-violet-400 hover:border-violet-400'
    ],
    [
      'admin',
      'Administrator Console',
      'Academic triage engine, faculty subject mappings, and workload oversight.',
      ShieldCheck,
      'from-lime-500/20 to-emerald-600/10 border-lime-500/30 text-lime-400 hover:border-lime-400'
    ]
  ];

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-[#0B1020] relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="card p-8 md:p-10 w-full max-w-lg border border-white/10 shadow-card relative z-10 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center font-black text-white text-sm shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles size={16} />
            </div>
            <span className="font-heading font-black text-xl tracking-tight text-white">
              Heard in Class<span className="text-cyan-400">.</span>
            </span>
          </Link>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-white mt-6 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Select your dedicated institutional portal to authenticate:
          </p>
        </div>

        <div className="space-y-3">
          {portals.map(([key, title, desc, Icon, colorClass]) => (
            <Link
              key={key}
              href={`/login/${key}`}
              className={`flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r border transition-all hover:scale-[1.01] ${colorClass}`}
            >
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-white text-base">{title}</h2>
                  <ArrowRight size={14} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <span>Need a new account? </span>
          <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
