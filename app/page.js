import Link from 'next/link';
import {
  MessageSquare,
  Route,
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
          </div>
        </div>
      </section>

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
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </section>

      {/* Footer */}
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
        </div>
      </footer>
    </main>
  );
}
