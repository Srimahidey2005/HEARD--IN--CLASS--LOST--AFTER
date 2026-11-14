"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuery } from '@/lib/dataService';
import {
  ACADEMIC_PROGRAMS,
  SUBJECT_GROUPS,
  parseCourseString,
  formatCourseString
} from '@/lib/courses';
import {
  Send,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Users
} from 'lucide-react';

const CATEGORIES = [
  'Academic Doubt',
  'Assignment',
  'Examination',
  'Attendance',
  'Course Material',
  'Administrative Request',
  'Other'
];

const POPULAR_SECTIONS = [
  'K22AB',
  'K22CD',
  'K22EF',
  'K23AB',
  'K23CD',
  'Section A',
  'Section B',
  'Section C',
  'Section D',
  'Other'
];

export default function QueryForm({ defaultCourse = '', defaultSemester = '', defaultSection = '' }) {
  const router = useRouter();

  // Initialize course & branch state from student's profile or defaults
  const parsed = parseCourseString(defaultCourse);
  const [selectedCourse, setSelectedCourse] = useState(parsed.selectedCourse);
  const [selectedBranch, setSelectedBranch] = useState(parsed.selectedBranch);
  const [customCourse, setCustomCourse] = useState(parsed.customCourse);
  const [customBranch, setCustomBranch] = useState(parsed.customBranch);

  const initialSec = defaultSection && POPULAR_SECTIONS.includes(defaultSection)
    ? defaultSection
    : defaultSection
    ? 'Other'
    : 'K22AB';
  const [selectedSection, setSelectedSection] = useState(initialSec);
  const [customSection, setCustomSection] = useState(initialSec === 'Other' ? defaultSection : '');

  const [f, setF] = useState({
    semester: defaultSemester ? String(defaultSemester) : '4',
    subject: 'Data Structures',
    customSubject: '',
    title: '',
    description: '',
    category: 'Auto',
    priority: 'Medium',
    attachmentName: '',
    attachmentUrl: ''
  });

  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  // Active program configuration
  const currentProg = ACADEMIC_PROGRAMS.find((p) => p.course === selectedCourse) || ACADEMIC_PROGRAMS[0];
  const availableBranches = currentProg ? currentProg.branches : ['Other'];

  const handleCourseChange = (newCourse) => {
    setSelectedCourse(newCourse);
    const prog = ACADEMIC_PROGRAMS.find((p) => p.course === newCourse);
    if (prog) {
      setSelectedBranch(prog.defaultBranch);
    } else {
      setSelectedBranch('General Specialization');
    }
  };

  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    setIsSuccess(false);

    try {
      const actualSubject = f.subject === 'Other' && f.customSubject.trim()
        ? f.customSubject.trim()
        : f.subject;

      const formattedCourse = formatCourseString({
        selectedCourse,
        selectedBranch,
        customCourse,
        customBranch
      });

      const actualSection =
        selectedSection === 'Other'
          ? (customSection.trim() || 'Custom Section')
          : selectedSection;

      const payload = {
        course: formattedCourse,
        section: actualSection,
        semester: Number(f.semester),
        subject: actualSubject,
        title: f.title.trim(),
        description: f.description.trim(),
        category: f.category,
        priority: f.priority,
        attachmentName: f.attachmentName.trim(),
        attachmentUrl: f.attachmentUrl.trim()
      };

      const res = await createQuery(payload);
      setIsSuccess(true);
      const refCode = res.referenceId || res._id.slice(-6).toUpperCase();
      setMsg(`Query submitted successfully! Reference ID: #${refCode}`);

      setTimeout(() => {
        router.push('/student/queries');
        router.refresh();
      }, 1200);
    } catch (err) {
      setMsg(err.message || 'Failed to submit query. Please try again.');
      setIsSuccess(false);
    } finally {
      setBusy(false);
    }
  }

  const currentFormattedTrack = formatCourseString({
    selectedCourse,
    selectedBranch,
    customCourse,
    customBranch
  });

  const actualSection =
    selectedSection === 'Other'
      ? (customSection.trim() || 'Custom Section')
      : selectedSection;

  return (
    <form onSubmit={submit} className="card p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
          <BookOpen size={22} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Ask an Academic Question</h2>
          <p className="text-xs text-slate-400">Our triage engine routes your query directly to the teaching faculty.</p>
        </div>
      </div>

      {/* Course & Branch Dependent Dropdown Selection */}
      <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            <GraduationCap size={15} />
            <span>Academic Program, Branch &amp; Section Selection</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            Selected: <strong className="text-cyan-300 font-semibold">{currentFormattedTrack}</strong> · Sem {f.semester} · Sec <strong className="text-cyan-300 font-semibold">{actualSection}</strong>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1: Select Course */}
          <label className="block text-sm font-semibold text-slate-300">
            1. Select Course / Degree
            <select
              className="field mt-1.5"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              required
            >
              {ACADEMIC_PROGRAMS.map((prog) => (
                <option key={prog.course} value={prog.course}>
                  {prog.label}
                </option>
              ))}
            </select>
          </label>

          {/* Step 2: Select Branch (Populated dynamically based on Course) */}
          <label className="block text-sm font-semibold text-slate-300">
            2. Select Branch / Specialization
            <select
              className="field mt-1.5"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              required
            >
              {availableBranches.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>
          </label>

          {/* Step 3: Current Semester */}
          <label className="block text-sm font-semibold text-slate-300">
            3. Current Semester
            <select
              className="field mt-1.5"
              name="semester"
              value={f.semester}
              onChange={change}
              required
            >
              <option value="" disabled>Select semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => (
                <option key={x} value={x}>Semester {x}</option>
              ))}
            </select>
          </label>

          {/* Step 4: Class Section / Group */}
          <label className="block text-sm font-semibold text-slate-300">
            4. Class Section / Group
            <select
              className="field mt-1.5"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              required
            >
              {POPULAR_SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'Other' ? 'Other (Specify Custom Section)' : `Section ${sec}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Custom input if 'Other' is chosen for Section */}
        {selectedSection === 'Other' && (
          <div className="pt-2 animate-fadeIn">
            <label className="block text-xs font-semibold text-slate-300">
              Specify Custom Section Name
              <input
                className="field mt-1 text-sm"
                value={customSection}
                onChange={(e) => setCustomSection(e.target.value)}
                placeholder="e.g. K22GH, Section 102, Sec-E"
                required
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-cyan-950/20 border border-cyan-800/30 p-2.5 rounded-lg">
          <Users size={14} className="text-cyan-400 shrink-0" />
          <span>
            Faculty appointment: Your doubt will automatically be routed to the instructor appointed to <strong className="text-cyan-300">Section {actualSection}</strong>.
          </span>
        </div>

        {/* Custom inputs if 'Other' is chosen for Course or Branch */}
        {(selectedCourse === 'Other' || selectedBranch === 'Other') && (
          <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-white/5 animate-fadeIn">
            {selectedCourse === 'Other' && (
              <label className="block text-xs font-semibold text-slate-300">
                Specify Custom Course / Degree Name
                <input
                  className="field mt-1 text-sm"
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  placeholder="e.g. Integrated M.Sc / Dual Degree"
                  required
                />
              </label>
            )}
            {selectedBranch === 'Other' && (
              <label className="block text-xs font-semibold text-slate-300">
                Specify Custom Branch / Specialization Name
                <input
                  className="field mt-1 text-sm"
                  value={customBranch}
                  onChange={(e) => setCustomBranch(e.target.value)}
                  placeholder="e.g. Nanotechnology / Mechatronics"
                  required
                />
              </label>
            )}
          </div>
        )}
      </div>

      {/* Subject */}
      <div className="grid md:grid-cols-2 gap-5">
        <label className="block text-sm font-semibold text-slate-300">
          Subject / Course Module
          <select
            className="field mt-1.5"
            name="subject"
            value={f.subject}
            onChange={change}
            required
          >
            {SUBJECT_GROUPS.map((group) => (
              <optgroup key={group.stream} label={`── ${group.stream} ──`}>
                {group.subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
            ))}
            <optgroup label="── Custom Subject ──">
              <option value="Other">Other (Specify Custom Subject Name)</option>
            </optgroup>
          </select>
        </label>

        {f.subject === 'Other' && (
          <label className="block text-sm font-semibold text-slate-300 animate-fadeIn">
            Specify Custom Subject Name
            <input
              className="field mt-1.5"
              name="customSubject"
              value={f.customSubject}
              onChange={change}
              required
              placeholder="e.g. Compiler Design / Digital Signal Processing"
            />
          </label>
        )}
      </div>

      {/* Title */}
      <label className="block text-sm font-semibold text-slate-300">
        Query Title
        <input
          className="field mt-1.5"
          name="title"
          value={f.title}
          onChange={change}
          required
          maxLength={120}
          placeholder="Briefly state your core academic doubt"
        />
      </label>

      {/* Description */}
      <label className="block text-sm font-semibold text-slate-300">
        Detailed Context &amp; Doubt Explanation
        <textarea
          className="field mt-1.5 min-h-[140px] leading-relaxed"
          name="description"
          value={f.description}
          onChange={change}
          required
          minLength={10}
          placeholder="Provide step-by-step context, what you understood in class, and where you got lost after..."
        />
      </label>

      {/* Category & Priority */}
      <div className="grid md:grid-cols-2 gap-5">
        <label className="block text-sm font-semibold text-slate-300">
          Query Category
          <select
            className="field mt-1.5"
            name="category"
            value={f.category}
            onChange={change}
          >
            <option value="Auto">⚡ Auto-detect via AI triage (recommended)</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-300">
          Urgency / Priority
          <select
            className="field mt-1.5"
            name="priority"
            value={f.priority}
            onChange={change}
          >
            <option value="Low">Low – General doubt</option>
            <option value="Medium">Medium – Standard assignment/concept</option>
            <option value="High">High – Upcoming quiz or deadline</option>
            <option value="Urgent">Urgent – Critical exam/submission issue</option>
          </select>
        </label>
      </div>

      {/* Optional Attachment */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Paperclip size={14} className="text-cyan-400" />
          Optional Reference / Attachment Link
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="field text-xs py-2"
            name="attachmentName"
            value={f.attachmentName}
            onChange={change}
            placeholder="Attachment Title (e.g. Slide 14 / Question 3 Screenshot)"
          />
          <input
            className="field text-xs py-2"
            name="attachmentUrl"
            value={f.attachmentUrl}
            onChange={change}
            placeholder="URL (Google Drive / GitHub / Image link)"
          />
        </div>
      </div>

      {/* Notification Toast */}
      {msg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${
            isSuccess
              ? 'bg-lime-500/10 border-lime-500/30 text-lime-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{msg}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="btn btn-lime w-full md:w-auto px-8 py-3 text-base flex items-center gap-2 shadow-glow-lime"
          disabled={busy}
        >
          {busy ? (
            <>
              <Sparkles size={18} className="animate-spin text-midnight" />
              <span>Routing to Faculty…</span>
            </>
          ) : (
            <>
              <Send size={18} className="text-midnight" />
              <span>Submit Academic Query</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
