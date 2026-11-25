import Link from 'next/link';
<<<<<<< HEAD
import { GraduationCap, BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
=======
import { GraduationCap, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2

export default function RegisterChooserPage() {
  const portals = [
    [
      'student',
      'Student Account',
      'Register with your official @lpu.in email address, degree program, and semester.',
<<<<<<< HEAD
      GraduationCap
=======
      GraduationCap,
      'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-400 hover:border-cyan-400'
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
    ],
    [
      'faculty',
      'Faculty Account',
      'Register with your official faculty email, taught subjects, and departmental access code.',
<<<<<<< HEAD
      BookOpen
    ],
    [
      'admin',
      'Administrator Account',
      'Register as an institutional administrator with your official @admin.in email address and ID.',
      ShieldCheck
=======
      BookOpen,
      'from-violet-500/20 to-purple-600/10 border-violet-500/30 text-violet-400 hover:border-violet-400'
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
    ]
  ];

  return (
<<<<<<< HEAD
    <main className="min-h-screen grid place-items-center p-6 bg-[var(--bg-main)] relative">
      <div className="card p-8 md:p-10 w-full max-w-lg shadow-card relative z-10 space-y-6">
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

        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1.5">
=======
    <main className="min-h-screen grid place-items-center p-6 bg-[#0B1020] relative overflow-hidden">
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
            Create Your Account
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            Choose your institutional role to begin:
          </p>
        </div>

        <div className="space-y-3">
<<<<<<< HEAD
          {portals.map(([key, title, desc, Icon]) => (
            <Link
              key={key}
              href={`/register/${key}`}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] hover:border-[#A99AEF] transition-all group"
            >
              <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] shrink-0 text-[#A99AEF]">
=======
          {portals.map(([key, title, desc, Icon, colorClass]) => (
            <Link
              key={key}
              href={`/register/${key}`}
              className={`flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r border transition-all hover:scale-[1.01] ${colorClass}`}
            >
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
<<<<<<< HEAD
                  <h2 className="font-heading font-bold text-[var(--text-primary)] text-base group-hover:text-[#A99AEF] transition-colors">{title}</h2>
                  <ArrowRight size={14} className="text-[var(--text-secondary)] group-hover:translate-x-1 group-hover:text-[#A99AEF] transition-all" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{desc}</p>
=======
                  <h2 className="font-heading font-bold text-white text-base">{title}</h2>
                  <ArrowRight size={14} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{desc}</p>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
              </div>
            </Link>
          ))}
        </div>

<<<<<<< HEAD
        <div className="pt-4 border-t border-[var(--border-card)] text-center text-xs text-[var(--text-secondary)]">
          <span>Already registered? </span>
          <Link href="/login" className="text-[#A99AEF] font-semibold hover:underline">
=======
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
            Sign in to existing account
          </Link>
        </div>
      </div>
    </main>
  );
}
