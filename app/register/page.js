import Link from 'next/link';
import { GraduationCap, BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function RegisterChooserPage() {
  const portals = [
    [
      'student',
      'Student Account',
      'Register with your official @lpu.in email address, degree program, and semester.',
      GraduationCap
    ],
    [
      'faculty',
      'Faculty Account',
      'Register with your official faculty email, taught subjects, and departmental access code.',
      BookOpen
    ],
    [
      'admin',
      'Administrator Account',
      'Register as an institutional administrator with your official @admin.in email address and ID.',
      ShieldCheck
    ]
  ];

  return (
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
            Choose your institutional role to begin:
          </p>
        </div>

        <div className="space-y-3">
          {portals.map(([key, title, desc, Icon]) => (
            <Link
              key={key}
              href={`/register/${key}`}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] hover:border-[#A99AEF] transition-all group"
            >
              <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] shrink-0 text-[#A99AEF]">
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-[var(--text-primary)] text-base group-hover:text-[#A99AEF] transition-colors">{title}</h2>
                  <ArrowRight size={14} className="text-[var(--text-secondary)] group-hover:translate-x-1 group-hover:text-[#A99AEF] transition-all" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--border-card)] text-center text-xs text-[var(--text-secondary)]">
          <span>Already registered? </span>
          <Link href="/login" className="text-[#A99AEF] font-semibold hover:underline">
            Sign in to existing account
          </Link>
        </div>
      </div>
    </main>
  );
}
