<<<<<<< HEAD
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LandingNavbar from '@/components/LandingNavbar';
import CinematicIntro from '@/components/CinematicIntro';
import {
  MessageSquare,
=======
import Link from 'next/link';
import {
  MessageSquare,
  Route,
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Layers,
<<<<<<< HEAD
  Phone,
  Video,
  MapPin,
  ChevronRight,
  HelpCircle,
  Award,
  BarChart3,
  Film
} from 'lucide-react';

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const forceIntro = params.get('intro') === '1';
      const seen = sessionStorage.getItem('intro_viewed_session');
      if (forceIntro || !seen) {
        setShowIntro(true);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] relative flex flex-col justify-between transition-colors duration-200">
      {/* 7-Second Continuous Animated Intro */}
      {showIntro && (
        <CinematicIntro
          autoStart={true}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Navigation Bar */}
      <LandingNavbar onPlayIntro={() => setShowIntro(true)} />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-16 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[var(--primary-soft)] border border-[var(--border-card)] text-[var(--text-primary)] text-xs sm:text-sm font-mono font-bold tracking-wider">
          <Zap size={16} className="text-[#A99AEF] shrink-0" />
          <span>ACADEMIC INTELLIGENCE ENGINE · SECTION-BASED FACULTY ROUTING</span>
        </div>

        <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-black tracking-normal leading-[1.08] text-[var(--text-primary)] max-w-5xl mx-auto">
          Heard in Class, <br />
          <span className="text-[#A99AEF]">
            Resolved &amp; Answered.
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto font-medium">
          A unified academic communication platform. Submit doubts with course and section matching, receive official faculty explanations, and book 1-on-1 office-hour consultations without lost messages.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/student"
            className="btn px-8 py-4 text-base font-bold flex items-center gap-2.5 rounded-xl hover:scale-[1.02] transition-transform"
          >
            <GraduationCap size={20} />
            <span>Open Student Portal</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/faculty"
            className="btn btn-secondary px-8 py-4 text-base font-bold flex items-center gap-2.5 rounded-xl hover:scale-[1.02] transition-transform"
          >
            <BookOpen size={20} className="text-[#A99AEF]" />
            <span>Faculty Portal</span>
          </Link>

          <Link
            href="/login/admin"
            className="btn btn-secondary px-8 py-4 text-base font-bold flex items-center gap-2.5 rounded-xl hover:scale-[1.02] transition-transform"
          >
            <ShieldCheck size={20} className="text-[#A99AEF]" />
            <span>Admin Console</span>
          </Link>

          <button
            onClick={() => setShowIntro(true)}
            type="button"
            className="btn btn-secondary px-6 py-4 text-base font-bold flex items-center gap-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Film size={18} className="text-[#A99AEF]" />
            <span>7s Intro Video</span>
          </button>
        </div>

        {/* Institutional Trust markers */}
        <div className="flex items-center justify-center gap-8 pt-4 text-sm font-semibold text-[var(--text-secondary)] flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#A99AEF]" />
            <span>Verified @lpu.in Accounts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#A99AEF]" />
            <span>Section &amp; Course Mapping</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#A99AEF]" />
            <span>Zero Lost Academic Queries</span>
=======
  ChevronRight
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1020] text-[#F4F5FA] relative overflow-hidden">
      {/* Background neon ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-[-150px] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[-100px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-glow">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-heading font-black text-xl tracking-tight text-white flex items-center gap-1">
              Heard in Class<span className="text-cyan-400">.</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
              P09 · Academic Communication Platform
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn btn-lime text-xs font-bold px-4 py-2 shadow-glow-lime"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
            <Zap size={14} className="text-cyan-400" />
            <span>CENTRALIZED FACULTY–STUDENT ACADEMIC HUB</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Heard in Class, <br />
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-lime-400 bg-clip-text text-transparent">
              Resolved After.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Never let academic doubts get lost in scattered messages. Our automated triage engine maps student queries to qualified faculty by course and subject, delivers timely clarifications, and synchronizes 1-on-1 office-hour appointments.
          </p>

          {/* Quick CTA cluster */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link
              href="/student"
              className="btn btn-lime shadow-glow-lime px-6 py-3.5 text-sm font-bold flex items-center gap-2"
            >
              <GraduationCap size={18} className="text-midnight" />
              <span>Student Portal</span>
              <ArrowRight size={16} className="text-midnight" />
            </Link>

            <Link
              href="/faculty"
              className="btn btn-secondary px-6 py-3.5 text-sm font-bold flex items-center gap-2"
            >
              <BookOpen size={18} className="text-violet-400" />
              <span>Faculty Portal</span>
            </Link>

            <Link
              href="/admin"
              className="btn btn-secondary px-5 py-3.5 text-sm font-bold flex items-center gap-2"
            >
              <ShieldCheck size={18} className="text-lime-400" />
              <span>Admin &amp; Triage</span>
            </Link>
          </div>

          {/* Institutional Trust markers */}
          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-lime-400" />
              <span>Verified @lpu.in Accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-cyan-400" />
              <span>Intelligent Workload Balancing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-violet-400" />
              <span>Zero Lost Messages</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Workflow Showcase */}
        <div className="lg:col-span-5">
          <div className="card p-6 md:p-8 space-y-6 border border-white/10 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-cyan-400">Integrated Pipeline</p>
                <h3 className="font-heading font-bold text-xl text-white">Three Unified Modules</h3>
              </div>
              <span className="pill pill-answered">LIVE ENGINE</span>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '01',
                  module: 'Module 1 · Query Service',
                  title: 'Student Submits Doubt',
                  desc: 'Structured submission with course, semester, subject, priority, and context.',
                  color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30'
                },
                {
                  step: '02',
                  module: 'Module 3 · Triage Engine',
                  title: 'Intelligent Faculty Routing',
                  desc: 'Heuristic keyword categorization, alias matching (e.g. DSA $\\to$ Data Structures), and fair workload balancing.',
                  color: 'text-violet-400 border-violet-500/30 bg-violet-950/30'
                },
                {
                  step: '03',
                  module: 'Module 2 · Response Service',
                  title: 'Faculty Clarification & Resolution',
                  desc: 'Qualified faculty member submits detailed response and marks progress.',
                  color: 'text-lime-400 border-lime-500/30 bg-lime-950/30'
                },
                {
                  step: '04',
                  module: 'Module 3 · Appointment Service',
                  title: 'Office-Hour Consultation',
                  desc: 'Student books 1-on-1 slot from published office hours with clash prevention.',
                  color: 'text-indigo-300 border-indigo-500/30 bg-indigo-950/30'
                }
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-4 items-start"
                >
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center font-mono font-bold text-sm shrink-0 ${item.color}`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      {item.module}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-white mt-0.5">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Role Portal Cards Grid */}
      <section id="portals" className="max-w-7xl mx-auto px-6 py-16 relative z-10 space-y-10 w-full">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#A99AEF] font-bold">
            TAILORED EXPERIENCES FOR CAMPUS ROLES
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-normal">
            Integrated Academic Portals
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium leading-relaxed">
            Select your portal to experience dedicated features engineered for students, educators, and administrators.
=======
      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-white/5 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            ARCHITECTED FOR INSTITUTIONAL SCALE
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Communication Architecture
          </h2>
          <p className="text-slate-400 text-sm">
            Built from the ground up for strict role separation, fair query distribution, and academic accountability.
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
<<<<<<< HEAD
          {/* Student Card */}
          <div className="card p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] flex items-center justify-center border border-[var(--border-card)]">
                <GraduationCap size={24} />
              </div>
              <div>
                <span className="text-xs font-mono text-[#A99AEF] uppercase tracking-widest font-bold">PORTAL 01</span>
                <h3 className="font-heading font-black text-2xl text-[var(--text-primary)] mt-1">Student Academic Portal</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Submit queries with degree program, semester, and section selection. Track live answers from your assigned instructor and book 1-on-1 consultations.
              </p>
              <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2.5 pt-3 border-t border-[var(--border-card)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Section-based faculty matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Real-time doubt progress &amp; resolution</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Instant Consultation Pass generation</span>
                </li>
              </ul>
            </div>

            <Link
              href="/student"
              className="btn w-full text-sm font-bold py-3.5 text-center flex items-center justify-center gap-2 mt-4 rounded-xl"
            >
              <span>Access Student Portal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Faculty Card */}
          <div className="card p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] flex items-center justify-center border border-[var(--border-card)]">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="text-xs font-mono text-[#A99AEF] uppercase tracking-widest font-bold">PORTAL 02</span>
                <h3 className="font-heading font-black text-2xl text-[var(--text-primary)] mt-1">Faculty Teaching Hub</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Manage assigned course doubts in a priority queue. Submit verified academic explanations, manage consultation office hours, and prevent double-booking.
              </p>
              <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2.5 pt-3 border-t border-[var(--border-card)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Auto-routed queries by subject &amp; section</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Weekly office hour slot publishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Approve, reschedule, or complete meetings</span>
                </li>
              </ul>
            </div>

            <Link
              href="/faculty"
              className="btn btn-secondary w-full text-sm font-bold py-3.5 text-center flex items-center justify-center gap-2 mt-4 rounded-xl"
            >
              <span>Access Faculty Portal</span>
              <ArrowRight size={16} className="text-[#A99AEF]" />
            </Link>
          </div>

          {/* Admin Card */}
          <div className="card p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] flex items-center justify-center border border-[var(--border-card)]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="text-xs font-mono text-[#A99AEF] uppercase tracking-widest font-bold">PORTAL 03</span>
                <h3 className="font-heading font-black text-2xl text-[var(--text-primary)] mt-1">Admin &amp; Triage Console</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Configure faculty subject and section mappings, monitor campus-wide query resolution rates, balance faculty workloads, and ensure zero unassigned doubts.
              </p>
              <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2.5 pt-3 border-t border-[var(--border-card)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Dynamic faculty mapping directory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Live workload balance oversight</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />
                  <span>Manual triage re-assignment controls</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login/admin"
              className="btn btn-secondary w-full text-sm font-bold py-3.5 text-center flex items-center justify-center gap-2 mt-4 rounded-xl"
            >
              <span>Open Admin Console</span>
              <ArrowRight size={16} className="text-[#A99AEF]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-[var(--border-card)] space-y-12 w-full">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#A99AEF] font-bold">
            HIGH PERFORMANCE ARCHITECTURE
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-normal">
            Built for Academic Precision
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium leading-relaxed">
            Everything you need for timely doubt resolution, clash-free appointment booking, and academic accountability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] w-fit">
              <Zap size={22} />
            </div>
            <h4 className="font-heading font-black text-lg text-[var(--text-primary)]">Heuristic Triage Engine</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Maps academic acronyms (e.g. DSA &rarr; Data Structures) and balances open queries across qualified teaching instructors automatically.
            </p>
          </div>

          <div className="card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] w-fit">
              <Users size={22} />
            </div>
            <h4 className="font-heading font-black text-lg text-[var(--text-primary)]">Section-Level Precision</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Students select their exact class section (e.g. K22AB, Section A) so queries route directly to the teacher taking their lectures.
            </p>
          </div>

          <div className="card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] w-fit">
              <CalendarCheck size={22} />
            </div>
            <h4 className="font-heading font-black text-lg text-[var(--text-primary)]">Dynamic 30-Min Slots</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Slices faculty office hours into bookable chips with automatic clash prevention and real-time MongoDB transaction safety.
            </p>
          </div>

          <div className="card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] w-fit">
              <Phone size={22} />
            </div>
            <h4 className="font-heading font-black text-lg text-[var(--text-primary)]">Flexible Meeting Modes</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Full support for In-person, Phone call, and Virtual meetings with minimal status badges and Google Calendar integration.
            </p>
          </div>

          <div className="card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] w-fit">
              <Award size={22} />
            </div>
            <h4 className="font-heading font-black text-lg text-[var(--text-primary)]">Consultation Pass</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Generates an official digital booking confirmation pass with copyable booking ID, faculty cabin location, and calendar links.
            </p>
          </div>

          <div className="card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--primary-soft)] text-[#A99AEF] w-fit">
              <ShieldCheck size={22} />
            </div>
            <h4 className="font-heading font-black text-lg text-[var(--text-primary)]">Account Recovery &amp; Security</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Institutional email verification, bcrypt password hashing, and instant self-service password reset functionality.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-16 relative z-10 border-t border-[var(--border-card)] space-y-8 w-full">
        <div className="text-center space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#A99AEF] font-bold">
            COMMON QUESTIONS
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-normal">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="card p-6 space-y-2.5">
            <h4 className="font-heading font-black text-[var(--text-primary)] text-base sm:text-lg flex items-center gap-2.5">
              <HelpCircle size={18} className="text-[#A99AEF] shrink-0" />
              <span>How does the system know which teacher takes my class?</span>
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-7">
              When submitting an academic doubt, you select your Course, Branch, Semester, and Section (e.g., K22AB, Section A). The triage engine matches this against the faculty section mappings configured in the database to appoint your specific teacher.
            </p>
          </div>

          <div className="card p-6 space-y-2.5">
            <h4 className="font-heading font-black text-[var(--text-primary)] text-base sm:text-lg flex items-center gap-2.5">
              <HelpCircle size={18} className="text-[#A99AEF] shrink-0" />
              <span>What happens if I forget my account password?</span>
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-7">
              Click the &quot;Forgot password?&quot; link on any sign-in page or visit <Link href="/forgot-password" className="text-[#A99AEF] underline font-semibold">/forgot-password</Link>. Enter your registered institutional email and choose a new secure password to regain access immediately.
            </p>
          </div>

          <div className="card p-6 space-y-2.5">
            <h4 className="font-heading font-black text-[var(--text-primary)] text-base sm:text-lg flex items-center gap-2.5">
              <HelpCircle size={18} className="text-[#A99AEF] shrink-0" />
              <span>Can I book a consultation for a phone call or virtual meet?</span>
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-7">
              Yes! Under &quot;Where meetings take place&quot;, you can select In-person, Phone call, or Virtual meeting. Your choice is stored in MongoDB and displays with clean status badges.
            </p>
=======
          <div className="card p-7 space-y-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Student Query Service</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Official `@lpu.in` registration, unique reference IDs (`#QRY-XXXX`), structured doubt submissions, live status tracking, response review, and query cancellation controls.
            </p>
            <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-cyan-400" />
                <span>Search &amp; category filtering</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-cyan-400" />
                <span>Upcoming appointments widget</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-cyan-400" />
                <span>1-click linked appointment requests</span>
              </li>
            </ul>
          </div>

          <div className="card p-7 space-y-4 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Faculty Response Service</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict isolation ensuring faculty only access their assigned course questions. Powerful search, subject filters, priority sorting, rich markdown replies, and direct consultation scheduling.
            </p>
            <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-violet-400" />
                <span>Publish recurring weekly office hours</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-violet-400" />
                <span>Approve, reschedule or complete meetings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-violet-400" />
                <span>Urgent doubt priority queue</span>
              </li>
            </ul>
          </div>

          <div className="card p-7 space-y-4 border border-lime-500/20 hover:border-lime-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-400 border border-lime-500/30 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Triage &amp; Appointments</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated subject alias resolver, keyword categorization, fair distribution across teaching faculty, persistent subject mappings in MongoDB, and manual triage override controls.
            </p>
            <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-lime-400" />
                <span>Double-booking prevention</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-lime-400" />
                <span>Workload balance analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-lime-400" />
                <span>Safe auto-rerouting on mapping update</span>
              </li>
            </ul>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
          </div>
        </div>
      </section>

      {/* Footer */}
<<<<<<< HEAD
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[var(--text-muted)] relative z-10 w-full">
        <div className="flex items-center gap-2 font-medium">
          <span className="font-heading font-black text-[var(--text-primary)] text-sm sm:text-base">Heard in Class, Lost After</span>
          <span>·</span>
          <span>P09 Academic Platform</span>
        </div>
        <div className="flex items-center gap-5 font-semibold flex-wrap justify-center">
          <Link href="/login/student" className="hover:text-[var(--text-primary)] transition-colors">Student Sign In</Link>
          <Link href="/login/faculty" className="hover:text-[var(--text-primary)] transition-colors">Faculty Sign In</Link>
          <Link href="/forgot-password" className="hover:text-[var(--text-primary)] transition-colors">Forgot Password</Link>
          <Link href="/login/admin" className="hover:text-[var(--text-primary)] transition-colors">Admin Console</Link>
=======
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-white">Heard in Class, Lost After</span>
          <span>·</span>
          <span>Project P09</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login/student" className="hover:text-cyan-400">Student Sign In</Link>
          <Link href="/login/faculty" className="hover:text-violet-400">Faculty Sign In</Link>
          <Link href="/login/admin" className="hover:text-lime-400">Admin Console</Link>
>>>>>>> 04831f387b51730adf4cff8146e7368b122385f2
        </div>
      </footer>
    </main>
  );
}
