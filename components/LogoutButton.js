"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      // fallback
      window.location.href = '/login';
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={busy}
      className={`flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition-colors w-full px-3 py-2 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 ${className}`}
      title="Sign out of your session"
    >
      <LogOut size={16} className={busy ? 'animate-spin' : ''} />
      <span>{busy ? 'Signing out…' : 'Sign out'}</span>
    </button>
  );
}
