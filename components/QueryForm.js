"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createQuery, getFaculty } from '@/lib/dataService';
import { isFacultyEligible, checkFacultyEligibility, getEligibleFacultyList } from '@/lib/validators';
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
  Users,
  Search,
  ChevronDown,
  X,
  UserCheck
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

function getDefaultSubjectForCourse(courseName = '') {
  const c = String(courseName || '').toLowerCase();
  if (c.includes('bba') || c.includes('mba') || c.includes('b.com') || c.includes('bcom') || c.includes('m.com') || c.includes('commerce') || c.includes('business')) {
    return 'Financial Accounting';
  }
  if (c.includes('mech') || c.includes('civil') || c.includes('automobile')) {
    return 'Engineering Mechanics';
  }
  if (c.includes('elec') || c.includes('ece') || c.includes('eee')) {
    return 'Digital Electronics';
  }
  if (c.includes('b.sc') || c.includes('m.sc') || c.includes('math') || c.includes('physics')) {
    return 'Engineering Mathematics';
  }
  return 'Data Structures';
}

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
    subject: getDefaultSubjectForCourse(defaultCourse),
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

  // Faculty list & preferred teacher selection state
  const [allFaculty, setAllFaculty] = useState([]);
  const [loadingFaculty, setLoadingFaculty] = useState(true);
  const [facultyError, setFacultyError] = useState('');
  const [preferredFacultyId, setPreferredFacultyId] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch faculty on mount
  useEffect(() => {
    let mounted = true;
    setLoadingFaculty(true);
    setFacultyError('');
    getFaculty()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          const normalized = data.map((fac) => ({
            ...fac,
            _id: String(fac._id || fac.id || ''),
            id: String(fac.id || fac._id || '')
          }));
          setAllFaculty(normalized);
        } else {
          setFacultyError('Failed to parse faculty list.');
        }
      })
      .catch((err) => {
        if (mounted) setFacultyError(err.message || 'Failed to load faculty.');
      })
      .finally(() => {
        if (mounted) setLoadingFaculty(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const newSubject = getDefaultSubjectForCourse(newCourse);
    setF((prev) => ({ ...prev, subject: newSubject }));
  };

  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });

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

  const actualSubject = f.subject === 'Other' && f.customSubject.trim()
    ? f.customSubject.trim()
    : f.subject;

  // Filter and sort eligible faculty using getEligibleFacultyList
  const eligibleFaculty = useMemo(() => {
    if (!allFaculty.length) return [];
    return getEligibleFacultyList(allFaculty, {
      subject: actualSubject,
      course: currentFormattedTrack,
      section: actualSection
    });
  }, [allFaculty, actualSubject, currentFormattedTrack, actualSection]);

  // When subject/course/section changes, reset preferred teacher if no longer eligible
  useEffect(() => {
    if (preferredFacultyId) {
      const stillValid = eligibleFaculty.some((fac) => fac._id === preferredFacultyId);
      if (!stillValid) {
        setPreferredFacultyId('');
      }
    }
  }, [eligibleFaculty, preferredFacultyId]);

  const selectedTeacher = useMemo(() => {
    return allFaculty.find((fac) => fac._id === preferredFacultyId) || null;
  }, [allFaculty, preferredFacultyId]);

  // Filtered teachers based on search text:
  // If no search, shows eligible teachers.
  // If search query is entered, searches across eligible faculty first,
  // and if none match, searches across all active faculty so teachers can ALWAYS be found!
  const filteredTeachers = useMemo(() => {
    const q = teacherSearch.trim().toLowerCase();
    if (!q) return eligibleFaculty;

    const matchesInEligible = eligibleFaculty.filter(
      (fac) =>
        fac.name?.toLowerCase().includes(q) ||
        fac.department?.toLowerCase().includes(q) ||
        (Array.isArray(fac.subjects) && fac.subjects.some((s) => s.toLowerCase().includes(q)))
    );

    if (matchesInEligible.length > 0) return matchesInEligible;

    // Search across all active faculty
    return allFaculty
      .filter(
        (fac) =>
          fac.name?.toLowerCase().includes(q) ||
          fac.department?.toLowerCase().includes(q)
      )
      .map((fac) => {
        const check = checkFacultyEligibility(fac, {
          subject: actualSubject,
          course: currentFormattedTrack,
          section: actualSection
        });
        return {
          ...fac,
          isSectionMatch: check.isSectionMatch,
          isCourseMatch: check.isCourseMatch,
          badge: check.badge || (check.eligible ? 'Subject Faculty' : 'Faculty Member')
        };
      });
  }, [eligibleFaculty, allFaculty, teacherSearch, actualSubject, currentFormattedTrack, actualSection]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    setIsSuccess(false);

    try {
      const payload = {
        course: currentFormattedTrack,
        section: actualSection,
        semester: Number(f.semester),
        subject: actualSubject,
        title: f.title.trim(),
        description: f.description.trim(),
        category: f.category,
        priority: f.priority,
        ...(preferredFacultyId ? { preferredFacultyId } : {}),
        attachmentName: f.attachmentName.trim(),
        attachmentUrl: f.attachmentUrl.trim()
      };

      const res = await createQuery(payload);
      setIsSuccess(true);
      const assignedTeacherName = res.faculty?.name || selectedTeacher?.name;
      if (preferredFacultyId && assignedTeacherName) {
        setMsg(`Your doubt has been assigned to ${assignedTeacherName}.`);
      } else {
        setMsg("Your doubt has been automatically assigned based on your subject and section.");
      }

      setTimeout(() => {
        router.push('/student/queries');
        router.refresh();
      }, 1600);
    } catch (err) {
      setMsg(err.message || 'Failed to submit query. Please try again.');
      setIsSuccess(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-card)]">
        <div className="p-2.5 rounded-xl bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
          <BookOpen size={22} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Ask an Academic Question</h2>
          <p className="text-xs text-[var(--text-secondary)]">Our triage engine routes your query directly to the teaching faculty.</p>
        </div>
      </div>

      {/* Course & Branch Dependent Dropdown Selection */}
      <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-card)]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A99AEF] font-bold">
            <GraduationCap size={15} />
            <span>Academic Program, Branch &amp; Section Selection</span>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--bg-main)] px-2.5 py-0.5 rounded-full border border-[var(--border-card)]">
            Selected: <strong className="text-[#A99AEF] font-semibold">{currentFormattedTrack}</strong> · Sem {f.semester} · Sec <strong className="text-[#A99AEF] font-semibold">{actualSection}</strong>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1: Select Course */}
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
            <label className="block text-xs font-semibold text-[var(--text-primary)]">
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

        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[#A99AEF]/10 border border-[#A99AEF]/25 p-2.5 rounded-lg">
          <Users size={14} className="text-[#A99AEF] shrink-0" />
          <span>
            Faculty appointment: Your doubt will automatically be routed to the instructor appointed to <strong className="text-[var(--text-primary)]">Section {actualSection}</strong>.
          </span>
        </div>

        {/* Custom inputs if 'Other' is chosen for Course or Branch */}
        {(selectedCourse === 'Other' || selectedBranch === 'Other') && (
          <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-[var(--border-card)] animate-fadeIn">
            {selectedCourse === 'Other' && (
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
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
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
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
        <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
          <label className="block text-sm font-semibold text-[var(--text-primary)] animate-fadeIn">
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

      {/* Preferred Teacher (Optional) */}
      <div className="space-y-1.5" ref={dropdownRef}>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
            Preferred Teacher (Optional)
          </label>
          {preferredFacultyId && (
            <button
              type="button"
              onClick={() => {
                setPreferredFacultyId('');
                setTeacherSearch('');
              }}
              className="text-xs text-[#A99AEF] hover:underline flex items-center gap-1 font-medium"
            >
              <X size={12} />
              <span>Reset to Automatic Assignment</span>
            </button>
          )}
        </div>

        <div className="relative">
          <div
            className={`field flex items-center justify-between cursor-pointer min-h-[46px] ${
              isDropdownOpen ? 'ring-2 ring-[#A99AEF]/50 border-[#A99AEF]' : ''
            }`}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsDropdownOpen((prev) => !prev);
              }
            }}
          >
            {selectedTeacher ? (
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-medium">
                <UserCheck size={16} className="text-[#A99AEF] shrink-0" />
                <span>{selectedTeacher.name}</span>
                {selectedTeacher.department && (
                  <span className="text-xs text-[var(--text-secondary)] font-normal">
                    ({selectedTeacher.department})
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-[var(--text-secondary)]">
                Select your preferred teacher (optional)
              </span>
            )}

            <div className="flex items-center gap-2">
              {preferredFacultyId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreferredFacultyId('');
                    setTeacherSearch('');
                  }}
                  className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-rose-400"
                  title="Remove preferred teacher"
                >
                  <X size={14} />
                </button>
              )}
              <ChevronDown
                size={16}
                className={`text-[var(--text-secondary)] transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180 text-[#A99AEF]' : ''
                }`}
              />
            </div>
          </div>

          {/* Autocomplete Popup */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl shadow-2xl p-2 space-y-2 animate-fadeIn max-h-80 overflow-y-auto">
              <div className="relative p-1">
                <Search size={15} className="absolute left-3.5 top-3.5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  className="field pl-9 text-xs py-2"
                  placeholder="Search faculty by name, department, or subject..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>

              {/* Automatic Assignment Option */}
              <button
                type="button"
                onClick={() => {
                  setPreferredFacultyId('');
                  setTeacherSearch('');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  !preferredFacultyId
                    ? 'bg-[#A99AEF]/15 border border-[#A99AEF]/30 text-[var(--text-primary)] font-semibold'
                    : 'hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                }`}
              >
                <div>
                  <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>⚡ Automatic Assignment (Default)</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Our triage engine will automatically assign the best available instructor for your section &amp; subject.
                  </div>
                </div>
                {!preferredFacultyId && <CheckCircle2 size={15} className="text-[#A99AEF] shrink-0" />}
              </button>

              <div className="border-t border-[var(--border-card)] my-1" />

              {/* Loading State */}
              {loadingFaculty && (
                <div className="p-4 text-center text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2">
                  <Sparkles size={14} className="animate-spin text-[#A99AEF]" />
                  <span>Loading active faculty members from database...</span>
                </div>
              )}

              {/* Error State */}
              {facultyError && (
                <div className="p-3 text-center text-xs text-rose-500 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <span>{facultyError}</span>
                </div>
              )}

              {/* Filtered Teachers */}
              {!loadingFaculty && filteredTeachers.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider flex items-center justify-between">
                    <span>Available Teachers ({filteredTeachers.length})</span>
                    <span className="text-[10px] text-[#A99AEF]">
                      {teacherSearch.trim() ? `Search: "${teacherSearch}"` : `Subject: ${actualSubject}`}
                    </span>
                  </div>
                  {filteredTeachers.map((fac) => {
                    const isSelected = fac._id === preferredFacultyId;
                    return (
                      <button
                        key={fac._id}
                        type="button"
                        onClick={() => {
                          setPreferredFacultyId(fac._id);
                          setTeacherSearch('');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#A99AEF]/20 border border-[#A99AEF]/40 text-[var(--text-primary)] font-semibold'
                            : 'hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5 flex-wrap">
                            <UserCheck size={13} className="text-[#A99AEF]" />
                            <span>{fac.name}</span>
                            {fac.department && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-secondary)]">
                                {fac.department}
                              </span>
                            )}
                            {fac.isSectionMatch && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                                Section {actualSection} Instructor
                              </span>
                            )}
                            {!fac.isSectionMatch && fac.isCourseMatch && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#A99AEF]/15 border border-[#A99AEF]/30 text-[#A99AEF] font-medium">
                                Course Faculty
                              </span>
                            )}
                            {!fac.isSectionMatch && !fac.isCourseMatch && fac.badge && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--text-secondary)]">
                                {fac.badge}
                              </span>
                            )}
                          </div>
                          {Array.isArray(fac.subjects) && fac.subjects.length > 0 && (
                            <div className="text-[11px] text-[var(--text-secondary)]">
                              Teaches: {fac.subjects.join(', ')}
                            </div>
                          )}
                          {Array.isArray(fac.sections) && fac.sections.length > 0 && (
                            <div className="text-[10px] text-[#A99AEF]">
                              Sections: {fac.sections.join(', ')}
                            </div>
                          )}
                        </div>
                        {isSelected && <CheckCircle2 size={16} className="text-[#A99AEF] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ) : !loadingFaculty && (
                <div className="p-4 text-center text-xs text-[var(--text-secondary)] space-y-2">
                  <p>No faculty members found matching &quot;{teacherSearch}&quot;.</p>
                  <button
                    type="button"
                    onClick={() => setTeacherSearch('')}
                    className="text-[#A99AEF] underline hover:text-[#C6B9FF] text-xs font-semibold"
                  >
                    Clear search filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-[var(--text-secondary)]">
          {selectedTeacher ? (
            <span>Your doubt will be assigned directly to <strong className="text-[var(--text-primary)]">{selectedTeacher.name}</strong> upon submission.</span>
          ) : (
            <span>Leave empty to automatically assign your instructor based on your course, subject, and section.</span>
          )}
        </p>
      </div>

      {/* Title */}
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
        <label className="block text-sm font-semibold text-[var(--text-primary)]">
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

        <label className="block text-sm font-semibold text-[var(--text-primary)]">
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
      <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          <Paperclip size={14} className="text-[#A99AEF]" />
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
              ? 'bg-[#A99AEF]/15 border-[#A99AEF]/40 text-[var(--text-primary)]'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
          }`}
        >
          {isSuccess ? <CheckCircle2 size={18} className="text-[#A99AEF]" /> : <AlertCircle size={18} />}
          <span>{msg}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="btn btn-primary w-full md:w-auto px-8 py-3 text-base flex items-center justify-center gap-2"
          disabled={busy}
        >
          {busy ? (
            <>
              <Sparkles size={18} className="animate-spin text-black" />
              <span className="text-black font-semibold">Routing to Faculty…</span>
            </>
          ) : (
            <>
              <Send size={18} className="text-black" />
              <span className="text-black font-semibold">Submit Academic Query</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
