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
import ThemeToggle from './ThemeToggle';

const ROLE_CONFIG = {
  student: {
    title: 'Student Portal',
    badge: 'STUDENT',
    badgeClass: 'bg-[var(--primary-soft)] text-[#A99AEF] border-[#A99AEF]/30',
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
    badgeClass: 'bg-[var(--primary-soft)] text-[#A99AEF] border-[#A99AEF]/30',
    icon: BookOpen,
    links: [
      ['Dashboard', '/faculty', Home],
      ['Assigned Queries', '/faculty/queries', Inbox],
      ['Appointments & Hours', '/faculty/appointments', CalendarDays],
    ]
  },
  admin: {
    title: 'Administrator Console',
    badge: 'ADMIN',
    badgeClass: 'bg-[var(--primary-soft)] text-[#A99AEF] border-[#A99AEF]/30',
    icon: ShieldCheck,
    links: [
      ['Overview', '/admin', Home],
      ['Faculty Management', '/admin/faculty', Users],
      ['Query Monitoring', '/admin#triage', Inbox],
    ]
  }
};

export default function DashboardShell({ user, children, role }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const RoleIcon = cfg.icon;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] md:flex transition-colors duration-200">
      {/* Mobile top navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--bg-card)] border-b border-[var(--border-card)] sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#A99AEF] flex items-center justify-center font-black text-black text-sm">
            H
          </div>
          <span className="font-heading font-black text-lg tracking-tight text-[var(--text-primary)]">
            Heard in Class<span className="text-[#A99AEF]">.</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-primary)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-card)] p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#A99AEF] flex items-center justify-center font-black text-black text-sm group-hover:scale-105 transition-transform">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="font-heading font-black text-lg tracking-tight text-[var(--text-primary)] flex items-center gap-1">
                Heard in Class<span className="text-[#A99AEF]">.</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                Academic Hub
              </div>
            </div>
          </Link>

          {/* Portal badge */}
          <div className="mt-6 mb-6 flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-elevated)]">
            <div className="flex items-center gap-2">
              <RoleIcon size={16} className="text-[#A99AEF]" />
              <span className="text-xs font-semibold text-[var(--text-primary)]">{cfg.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle className="scale-90" />
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${cfg.badgeClass}`}>
                {cfg.badge}
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {cfg.links.map(([label, href, Icon]) => {
              const active = pathname === href || (href.includes('#') && pathname === href.split('#')[0]);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`sidebar-link ${active ? 'active' : ''}`}
                >
                  <Icon
                    size={17}
                    className={active ? 'text-[#A99AEF]' : 'text-[var(--text-muted)]'}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-5 border-t border-[var(--border-card)] mt-6">
          <div className="flex items-start gap-3 mb-4 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)]">
            <div className="w-9 h-9 rounded-xl bg-[#A99AEF] text-black font-bold text-sm flex items-center justify-center shrink-0">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-sm text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
              {user.registrationNumber && (
                <p className="text-[10px] font-mono text-[#A99AEF] mt-0.5">
                  Reg: {user.registrationNumber}
                </p>
              )}
              {role === 'student' && user.course && (
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                  {user.course}{user.semester ? ` · Sem ${user.semester}` : ''}
                </p>
              )}
              {role === 'faculty' && user.department && (
                <p className="text-[11px] text-[#A99AEF] mt-0.5 truncate">
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
