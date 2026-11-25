"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  LogIn,
  UserPlus,
  Film
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function LandingNavbar({ onPlayIntro }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-main)]/95 border-b border-[var(--border-card)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#A99AEF] flex items-center justify-center font-black text-black group-hover:scale-105 transition-transform shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-heading font-black text-xl tracking-normal text-[var(--text-primary)] flex items-center gap-1">
              Heard in Class<span className="text-[#A99AEF]">.</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] font-bold uppercase">
              P09 · Academic Platform
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-[var(--text-secondary)]">
          <Link
            href="/student"
            className="px-3.5 py-2 rounded-xl hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all flex items-center gap-2"
          >
            <GraduationCap size={16} className="text-[#A99AEF]" />
            <span>Student Portal</span>
          </Link>
          <Link
            href="/faculty"
            className="px-3.5 py-2 rounded-xl hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all flex items-center gap-2"
          >
            <BookOpen size={16} className="text-[#A99AEF]" />
            <span>Faculty Portal</span>
          </Link>
          <Link
            href="/login/admin"
            className="px-3.5 py-2 rounded-xl hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all flex items-center gap-2"
          >
            <ShieldCheck size={16} className="text-[#A99AEF]" />
            <span>Admin Console</span>
          </Link>
          <a
            href="#features"
            className="px-3.5 py-2 rounded-xl hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
          >
            Features
          </a>
          <a
            href="#faq"
            className="px-3.5 py-2 rounded-xl hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Action Buttons & Theme Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onPlayIntro && (
            <button
              onClick={onPlayIntro}
              type="button"
              className="px-3 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-card)] transition-all flex items-center gap-1.5"
              title="Watch 7-second continuous anime intro"
            >
              <Film size={14} className="text-[#A99AEF]" />
              <span>7s Intro</span>
            </button>
          )}

          <ThemeToggle />

          <Link
            href="/login"
            className="btn btn-secondary px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </Link>
          <Link
            href="/register"
            className="btn px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <UserPlus size={15} />
            <span>Get Started</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-card)] bg-[var(--bg-card)] px-6 py-6 space-y-4 animate-fadeIn">
          <div className="space-y-1.5">
            <Link
              href="/student"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-primary)] text-sm font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap size={18} className="text-[#A99AEF]" />
                <span>Student Portal</span>
              </div>
              <ArrowRight size={14} className="text-[#A99AEF]" />
            </Link>

            <Link
              href="/faculty"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-primary)] text-sm font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen size={18} className="text-[#A99AEF]" />
                <span>Faculty Portal</span>
              </div>
              <ArrowRight size={14} className="text-[#A99AEF]" />
            </Link>

            <Link
              href="/login/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-primary)] text-sm font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#A99AEF]" />
                <span>Admin &amp; Triage</span>
              </div>
              <ArrowRight size={14} className="text-[#A99AEF]" />
            </Link>
          </div>

          <div className="pt-2 border-t border-[var(--border-card)] grid grid-cols-2 gap-2 text-sm font-bold text-[var(--text-secondary)]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-center hover:text-[var(--text-primary)]"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-center hover:text-[var(--text-primary)]"
            >
              FAQ
            </a>
          </div>

          <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)] font-semibold">Theme &amp; Video:</span>
            <div className="flex items-center gap-2">
              {onPlayIntro && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onPlayIntro();
                  }}
                  type="button"
                  className="px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)] rounded-lg border border-[var(--border-card)] bg-[var(--bg-elevated)] flex items-center gap-1.5"
                >
                  <Film size={14} className="text-[#A99AEF]" />
                  <span>Watch Intro</span>
                </button>
              )}
              <ThemeToggle showLabel={true} />
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-card)] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-secondary w-full py-2.5 text-center text-xs font-bold"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn w-full py-2.5 text-center text-xs font-bold"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
