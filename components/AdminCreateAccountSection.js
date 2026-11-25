"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  KeyRound
} from 'lucide-react';

export default function AdminCreateAccountSection() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // 1-Click Instant Administrator Authentication for seeded admin
  async function quickSignIn() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@heardinclass.edu',
          password: 'Admin@12345'
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      setMsg('Authenticated as System Administrator! Redirecting to Command Center…');
      router.push(data.redirect || '/admin');
      router.refresh();
    } catch (err) {
      setMsg(err.message || 'Could not authenticate administrator.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 pt-1">
      {/* 1. Visible, Direct "Create Administrator Account" Button */}
      <Link
        href="/register/admin"
        className="btn btn-primary w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-black transition-all"
      >
        <UserPlus size={17} className="text-black" />
        <span className="text-black font-bold">Create Administrator Account (@admin.in)</span>
        <ArrowRight size={15} className="text-black" />
      </Link>

      {/* 2. Quick Demo/Test Login Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full text-center text-[11px] text-[var(--text-secondary)] hover:text-[#A99AEF] flex items-center justify-center gap-1.5 transition-colors font-medium py-1"
        >
          <KeyRound size={13} />
          <span>{open ? 'Hide Demo Admin Credentials' : 'Need quick access? Use pre-configured admin'}</span>
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {open && (
          <div className="mt-2 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A99AEF]">
                Ready Institutional Admin
              </span>
              <span className="text-[10px] text-[#A99AEF] font-mono font-bold">Active in DB</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[var(--bg-main)] p-2.5 rounded-xl border border-[var(--border-card)]">
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px]">Email</span>
                <span className="text-[var(--text-primary)] font-bold truncate block">admin@heardinclass.edu</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px]">Password</span>
                <span className="text-[var(--text-primary)] font-bold block">Admin@12345</span>
              </div>
            </div>

            <button
              type="button"
              onClick={quickSignIn}
              disabled={busy}
              className="btn btn-secondary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <Sparkles size={14} className="animate-spin text-[#A99AEF]" />
                  <span>Signing In…</span>
                </>
              ) : (
                <>
                  <KeyRound size={14} className="text-[#A99AEF]" />
                  <span>1-Click Auto Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {msg && (
              <p className="text-[11px] text-[#A99AEF] font-semibold text-center mt-1">
                {msg}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
