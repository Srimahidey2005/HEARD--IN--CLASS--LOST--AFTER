"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageSquare,
  CalendarDays,
  Users,
  Inbox,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Layers,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import LogoutButton from './LogoutButton';

const ROLE_CONFIG = {
  student: {
    title: 'Student Portal',
    badge: 'STUDENT',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    icon: GraduationCap,
    links: [
      ['Dashboard', '/student', Home],
      ['Submit Query', '/student/submit-query', MessageSquare],
      ['My Queries', '/student/queries', Inbox],
      ['Appointments', '/student/appointments', CalendarDays],
    ]
  },
  faculty: {
    title: 'Faculty Portal',
    badge: 'FACULTY',
    badgeClass: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    icon: BookOpen,
    links: [
      ['Dashboard', '/faculty', Home],
      ['Assigned Queries', '/faculty/queries', Inbox],
      ['Appointments & Hours', '/faculty/appointments', CalendarDays],
    ]
  },
  admin: {
    title: 'Triage & Admin',
    badge: 'ADMIN',
    badgeClass: 'bg-lime-400/15 text-lime-400 border-lime-400/30',
    icon: ShieldCheck,
    links: [
      ['Overview & Triage', '/admin', Home],
      ['Manage Faculty', '/admin/faculty', Users],
    ]
  }
};

export default function DashboardShell({ user, children, role }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const RoleIcon = cfg.icon;

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F4F5FA] md:flex">
      {/* Mobile top navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#131b31] border-b border-white/10 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center font-black text-white text-sm shadow-glow">
            H
          </div>
          <span className="font-heading font-black text-lg tracking-tight">
            Heard in Class<span className="text-cyan-400">.</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-72 bg-[#131b31]/95 md:bg-[#131b31]/80 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-heading font-black text-lg tracking-tight text-white flex items-center gap-1">
                Heard in Class<span className="text-cyan-400">.</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Academic Hub
              </div>
            </div>
          </Link>

          {/* Portal badge */}
          <div className="mt-6 mb-6 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2">
              <RoleIcon size={16} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-300">{cfg.title}</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${cfg.badgeClass}`}>
              {cfg.badge}
            </span>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {cfg.links.map(([label, href, Icon]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`sidebar-link ${active ? 'active' : ''}`}
                >
                  <Icon size={18} className={active ? 'text-lime-400' : 'text-slate-400'} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-5 border-t border-white/10 mt-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-semibold text-sm text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              {user.registrationNumber && (
                <p className="text-[11px] font-mono text-cyan-400/90 mt-0.5">
                  Reg: {user.registrationNumber}
                </p>
              )}
              {role === 'student' && user.course && (
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {user.course}{user.semester ? ` · Sem ${user.semester}` : ''}
                </p>
              )}
              {role === 'faculty' && user.department && (
                <p className="text-[11px] text-violet-300 mt-0.5 truncate">
                  Dept of {user.department}
                </p>
              )}
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
