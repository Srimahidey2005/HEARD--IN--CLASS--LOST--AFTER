"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Sparkles,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resolvedRole, setResolvedRole] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setBusy(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setSuccess(data.message || 'Password reset successfully!');
      setResolvedRole(data.role || 'student');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setBusy(false);
    }
  }

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

          <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold text-[#A99AEF] uppercase tracking-wider">
            <KeyRound size={14} />
            <span>Account Security Recovery</span>
          </div>

          <h1 className="font-heading text-2xl font-extrabold text-[var(--text-primary)] mt-1.5 tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-[var(--text-secondary)] text-xs mt-1 leading-relaxed">
            Enter your official university email and choose a secure new password for your account.
          </p>
        </div>

        {success ? (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[#A99AEF]/30 text-[var(--text-primary)] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#A99AEF]">
                <CheckCircle2 size={18} />
                <span>Password Reset Complete!</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {success}
              </p>
            </div>

            <Link
              href={resolvedRole ? `/login/${resolvedRole}` : '/login'}
              className="btn btn-primary w-full text-xs font-bold py-3 text-center flex items-center justify-center gap-2"
            >
              <span>Sign In with New Password</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <label className="block text-xs font-semibold text-[var(--text-primary)]">
              Official University Email
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  className="field pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@lpu.in"
                  required
                />
              </div>
            </label>

            <label className="block text-xs font-semibold text-[var(--text-primary)]">
              New Password (min. 8 characters)
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="field pl-10 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <label className="block text-xs font-semibold text-[var(--text-primary)]">
              Confirm New Password
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="field pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="btn btn-primary w-full text-xs font-bold py-3 mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={15} />
              <span>{busy ? 'Updating Password…' : 'Save New Password'}</span>
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <Link href="/login" className="hover:text-[var(--text-primary)] transition-colors">
            ← Back to Sign In
          </Link>
          <Link href="/register" className="text-[#A99AEF] hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
