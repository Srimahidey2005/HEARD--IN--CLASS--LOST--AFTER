// Centralized Academic Programs, Courses, Branches and Subject catalog.
// Supports dynamic course -> branch selection across Student Query Form and Registration.

export const ACADEMIC_PROGRAMS = [
  {
    course: 'B.Tech',
    label: 'B.Tech (Bachelor of Technology)',
    defaultBranch: 'Computer Science & Engineering (CSE)',
    branches: [
      'Computer Science & Engineering (CSE)',
      'CSE - Artificial Intelligence & Machine Learning (AI & ML)',
      'CSE - Data Science (DS)',
      'CSE - Cyber Security & Forensics',
      'CSE - Cloud Computing & DevOps',
      'Information Technology (IT)',
      'Electronics & Communication Engineering (ECE)',
      'Electrical & Electronics Engineering (EEE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering (CE)',
      'Biotechnology (BT)',
      'Aerospace Engineering',
      'Robotics & Automation',
      'Chemical Engineering',
      'Automobile Engineering',
      'Other'
    ]
  },
  {
    course: 'M.Tech',
    label: 'M.Tech (Master of Technology)',
    defaultBranch: 'Computer Science & Engineering (CSE)',
    branches: [
      'Computer Science & Engineering (CSE)',
      'Artificial Intelligence & Data Science',
      'VLSI Design & Embedded Systems',
      'Power Electronics & Power Systems',
      'Structural Engineering',
      'Thermal Engineering',
      'Robotics & Mechatronics',
      'Other'
    ]
  },
  {
    course: 'BCA',
    label: 'BCA (Bachelor of Computer Applications)',
    defaultBranch: 'General BCA',
    branches: [
      'General BCA',
      'Cloud Computing & DevOps',
      'Cyber Security & Ethical Hacking',
      'Data Analytics & Big Data',
      'Full Stack Web & Mobile Development',
      'Artificial Intelligence & Machine Learning',
      'Other'
    ]
  },
  {
    course: 'MCA',
    label: 'MCA (Master of Computer Applications)',
    defaultBranch: 'General MCA',
    branches: [
      'General MCA',
      'Software Engineering & Cloud Architecture',
      'Artificial Intelligence & Machine Learning',
      'Data Science & Analytics',
      'Cyber Security & Cryptography',
      'Full Stack Web Development',
      'Other'
    ]
  },
  {
    course: 'B.Sc',
    label: 'B.Sc (Bachelor of Science)',
    defaultBranch: 'Computer Science',
    branches: [
      'Computer Science',
      'Information Technology',
      'Data Science & Analytics',
      'Mathematics & Statistics',
      'Physics',
      'Chemistry',
      'Biotechnology & Bioinformatics',
      'Microbiology',
      'Agriculture',
      'Other'
    ]
  },
  {
    course: 'M.Sc',
    label: 'M.Sc (Master of Science)',
    defaultBranch: 'Computer Science',
    branches: [
      'Computer Science',
      'Data Science & Artificial Intelligence',
      'Mathematics & Computing',
      'Physics',
      'Chemistry',
      'Biotechnology',
      'Microbiology',
      'Other'
    ]
  },
  {
    course: 'BBA',
    label: 'BBA (Bachelor of Business Administration)',
    defaultBranch: 'General Management',
    branches: [
      'General Management',
      'Business Analytics',
      'Marketing Management',
      'Financial Markets & Banking',
      'Human Resource Management',
      'International Business & Logistics',
      'Digital Marketing & E-Commerce',
      'Other'
    ]
  },
  {
    course: 'MBA',
    label: 'MBA (Master of Business Administration)',
    defaultBranch: 'Marketing Management',
    branches: [
      'Marketing Management',
      'Financial Management & FinTech',
      'Human Resource Management',
      'Business Analytics & Big Data',
      'Operations & Supply Chain Management',
      'Information Technology Management',
      'International Business',
      'Hospital & Healthcare Management',
      'Other'
    ]
  },
  {
    course: 'B.Com',
    label: 'B.Com (Bachelor of Commerce)',
    defaultBranch: 'Accounting & Finance',
    branches: [
      'General Commerce',
      'Accounting & Finance',
      'Banking & Insurance',
      'Financial Markets',
      'Corporate Accounting & Taxation',
      'Other'
    ]
  },
  {
    course: 'M.Com',
    label: 'M.Com (Master of Commerce)',
    defaultBranch: 'Advanced Accounting & Taxation',
    branches: [
      'Advanced Accounting & Taxation',
      'Banking & Financial Services',
      'Finance & Investment Analysis',
      'Other'
    ]
  },
  {
    course: 'Diploma',
    label: 'Diploma / Polytechnic',
    defaultBranch: 'Computer Science & Engineering',
    branches: [
      'Computer Science & Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Electronics & Communication',
      'Automobile Engineering',
      'Other'
    ]
  },
  {
    course: 'Other',
    label: 'Other Degree / Program',
    defaultBranch: 'General Specialization',
    branches: [
      'General Specialization',
      'Other'
    ]
  }
];

export const SUBJECT_GROUPS = [
  {
    stream: 'Computer Science & IT',
    subjects: [
      'Data Structures',
      'Operating Systems',
      'Database Management Systems',
      'Computer Networks',
      'Java Programming',
      'Python Programming',
      'C++ Programming',
      'Web Development',
      'Software Engineering',
      'Artificial Intelligence',
      'Machine Learning',
      'Cloud Computing',
      'Cyber Security',
      'Discrete Mathematics'
    ]
  },
  {
    stream: 'Electronics & Electrical',
    subjects: [
      'Digital Electronics',
      'Signals and Systems',
      'Microprocessors & Microcontrollers',
      'Control Systems',
      'Analog Electronic Circuits',
      'Electrical Machines',
      'VLSI Design'
    ]
  },
  {
    stream: 'Mechanical & Civil',
    subjects: [
      'Engineering Mechanics',
      'Thermodynamics',
      'Fluid Mechanics',
      'Strength of Materials',
      'Manufacturing Processes',
      'Structural Analysis',
      'Surveying'
    ]
  },
  {
    stream: 'Business, Management & Commerce',
    subjects: [
      'Financial Accounting',
      'Marketing Management',
      'Business Analytics',
      'Human Resource Management',
      'Principles of Management',
      'Microeconomics',
      'Macroeconomics',
      'Corporate Finance',
      'Business Law',
      'Operations & Supply Chain'
    ]
  },
  {
    stream: 'Sciences & Mathematics',
    subjects: [
      'Engineering Mathematics',
      'Calculus & Linear Algebra',
      'Probability & Statistics',
      'Applied Physics',
      'Engineering Chemistry',
      'Biotechnology & Genetics',
      'Environmental Science'
    ]
  }
];

// Flat list of all predefined subjects
export const ALL_COMMON_SUBJECTS = Array.from(
  new Set(SUBJECT_GROUPS.flatMap((g) => g.subjects))
).concat('Other');

/**
 * Parses a saved course string (e.g., "BTech CSE", "B.Tech - Computer Science & Engineering (CSE)",
 * "MCA - Artificial Intelligence & Machine Learning", "BBA", etc.) into structured state.
 */
export function parseCourseString(raw = '') {
  const trimmed = String(raw || '').trim();
  if (!trimmed) {
    return {
      selectedCourse: 'B.Tech',
      selectedBranch: 'Computer Science & Engineering (CSE)',
      customCourse: '',
      customBranch: ''
    };
  }

  // Check if it follows "Course - Branch" format
  if (trimmed.includes(' - ')) {
    const parts = trimmed.split(' - ');
    const coursePart = parts[0].trim();
    const branchPart = parts.slice(1).join(' - ').trim();

    const matchedProg = ACADEMIC_PROGRAMS.find(
      (p) => p.course.toLowerCase() === coursePart.toLowerCase()
    );

    if (matchedProg) {
      const matchedBranch = matchedProg.branches.find(
        (b) => b.toLowerCase() === branchPart.toLowerCase()
      );
      if (matchedBranch) {
        return {
          selectedCourse: matchedProg.course,
          selectedBranch: matchedBranch,
          customCourse: '',
          customBranch: ''
        };
      }
      return {
        selectedCourse: matchedProg.course,
        selectedBranch: 'Other',
        customCourse: '',
        customBranch: branchPart
      };
    }

    return {
      selectedCourse: 'Other',
      selectedBranch: 'Other',
      customCourse: coursePart,
      customBranch: branchPart
    };
  }

  // Check for common legacy / short formats like "BTech CSE", "BTech", "MCA", "MBA", etc.
  const lower = trimmed.toLowerCase().replace(/\./g, '');

  if (lower.includes('btech') || lower.includes('b tech') || lower.includes('bachelor of technology')) {
    const prog = ACADEMIC_PROGRAMS.find((p) => p.course === 'B.Tech');
    let branch = prog.defaultBranch;
    if (lower.includes('it') || lower.includes('information technology')) {
      branch = 'Information Technology (IT)';
    } else if (lower.includes('ece') || lower.includes('electronics')) {
      branch = 'Electronics & Communication Engineering (ECE)';
    } else if (lower.includes('me') || lower.includes('mechanical')) {
      branch = 'Mechanical Engineering (ME)';
    } else if (lower.includes('civil') || lower.includes('ce')) {
      branch = 'Civil Engineering (CE)';
    } else if (lower.includes('ai') || lower.includes('ml')) {
      branch = 'CSE - Artificial Intelligence & Machine Learning (AI & ML)';
    } else if (lower.includes('data science') || lower.includes('ds')) {
      branch = 'CSE - Data Science (DS)';
    }
    return {
      selectedCourse: 'B.Tech',
      selectedBranch: branch,
      customCourse: '',
      customBranch: ''
    };
  }

  // Match against other programs
  for (const prog of ACADEMIC_PROGRAMS) {
    const progKey = prog.course.toLowerCase().replace(/\./g, '');
    if (lower.startsWith(progKey) || lower.includes(progKey)) {
      return {
        selectedCourse: prog.course,
        selectedBranch: prog.defaultBranch,
        customCourse: '',
        customBranch: ''
      };
    }
  }

  return {
    selectedCourse: 'Other',
    selectedBranch: 'Other',
    customCourse: trimmed,
    customBranch: 'General'
  };
}

/**
 * Formats selectedCourse and selectedBranch into a clean string to be persisted
 * in the database (backward compatible with the existing `course` field).
 */
export function formatCourseString({ selectedCourse, selectedBranch, customCourse = '', customBranch = '' }) {
  const actualCourse = selectedCourse === 'Other' && customCourse.trim()
    ? customCourse.trim()
    : selectedCourse;

  const actualBranch = selectedBranch === 'Other' && customBranch.trim()
    ? customBranch.trim()
    : selectedBranch;

  if (!actualCourse) return 'Academic Track';
  if (!actualBranch) return actualCourse;

  return `${actualCourse} - ${actualBranch}`;
}
