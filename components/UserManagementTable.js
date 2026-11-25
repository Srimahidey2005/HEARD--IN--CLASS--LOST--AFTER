"use client";

import { useState, useMemo } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function UserManagementTable({ users = [] }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'student' | 'faculty' | 'admin'
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.registrationNumber && u.registrationNumber.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.course && u.course.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      return true;
    });
  }, [users, search, roleFilter]);

  const counts = useMemo(() => ({
    all: users.length,
    student: users.filter((u) => u.role === 'student').length,
    faculty: users.filter((u) => u.role === 'faculty').length,
    admin: users.filter((u) => u.role === 'admin').length,
  }), [users]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A99AEF]/15 text-[#A99AEF] border border-[#A99AEF]/30">
            <GraduationCap size={13} />
            <span>Student</span>
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-card)]">
            <BookOpen size={13} className="text-[#A99AEF]" />
            <span>Faculty</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A99AEF]/25 text-[#A99AEF] border border-[#A99AEF]/50">
            <ShieldCheck size={13} />
            <span>Admin</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
            {role}
          </span>
        );
    }
  };

  return (
    <div id="users" className="card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--border-card)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A99AEF] font-bold mb-1">
            <Users size={15} />
            <span>User Management &amp; Access Directory</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Campus User Directory
          </h2>
          <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
            Real-time verified roster of enrolled students, instructional faculty members, and institutional system administrators.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-card)] font-mono">
            {filteredUsers.length} of {users.length} Users Listed
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-[var(--text-secondary)]" size={17} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, registration # or course..."
            className="field pl-10 text-xs md:text-sm"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              roleFilter === 'ALL'
                ? 'bg-[#A99AEF] text-black border-[#A99AEF]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            All Roles ({counts.all})
          </button>
          <button
            onClick={() => setRoleFilter('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              roleFilter === 'student'
                ? 'bg-[#A99AEF] text-black border-[#A99AEF]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            Students ({counts.student})
          </button>
          <button
            onClick={() => setRoleFilter('faculty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              roleFilter === 'faculty'
                ? 'bg-[#A99AEF] text-black border-[#A99AEF]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            Faculty ({counts.faculty})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              roleFilter === 'admin'
                ? 'bg-[#A99AEF] text-black border-[#A99AEF]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            Admins ({counts.admin})
          </button>
        </div>
      </div>

      {/* Modern Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-elevated)]">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-[var(--border-card)] text-[var(--text-secondary)] font-bold uppercase tracking-wider text-[11px] bg-[var(--bg-card)]">
              <th className="py-3.5 px-4 font-bold">User Profile</th>
              <th className="py-3.5 px-4 font-bold">Platform Role</th>
              <th className="py-3.5 px-4 font-bold">Academic Scope</th>
              <th className="py-3.5 px-4 font-bold">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-card)]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  onClick={() => setSelectedUser(u === selectedUser ? null : u)}
                  className={`hover:bg-[var(--bg-card)] transition-colors cursor-pointer ${
                    selectedUser?._id === u._id ? 'bg-[var(--bg-card)]' : ''
                  }`}
                >
                  {/* User Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#A99AEF]/15 border border-[#A99AEF]/30 flex items-center justify-center text-[#A99AEF] font-bold text-sm shrink-0">
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-[var(--text-primary)] tracking-wide truncate">{u.name}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getRoleBadge(u.role)}
                  </td>

                  {/* Academic Scope */}
                  <td className="py-3.5 px-4">
                    {u.role === 'student' && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-[var(--text-primary)]">
                          {u.course || 'Degree Program'} {u.semester ? `· Sem ${u.semester}` : ''}
                        </div>
                        <div className="text-[11px] font-mono text-[#A99AEF]">
                          {u.registrationNumber ? `Reg: ${u.registrationNumber}` : ''}
                          {u.section ? ` · Sec: ${u.section}` : ''}
                        </div>
                      </div>
                    )}
                    {u.role === 'faculty' && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-[var(--text-primary)]">
                          Dept: {u.department || 'CSE'}
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] truncate max-w-xs">
                          {u.subjects && u.subjects.length > 0
                            ? u.subjects.slice(0, 2).join(', ') + (u.subjects.length > 2 ? ` +${u.subjects.length - 2}` : '')
                            : 'General Faculty'}
                        </div>
                      </div>
                    )}
                    {u.role === 'admin' && (
                      <div className="text-xs font-mono text-[#A99AEF] font-semibold">
                        System &amp; Triage Controller
                      </div>
                    )}
                  </td>

                  {/* Registered */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[var(--text-secondary)] text-xs font-mono">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[var(--text-secondary)] text-sm">
                  No matching users found for query &ldquo;{search}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected User Expanded Preview Card */}
      {selectedUser && (
        <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[#A99AEF]/40 animate-fadeIn space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A99AEF]">
              User Detail Inspector
            </span>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Close ✕
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[var(--text-secondary)] font-semibold">Full Name &amp; Email</p>
              <p className="font-bold text-[var(--text-primary)] text-sm mt-0.5">{selectedUser.name}</p>
              <p className="text-[var(--text-secondary)] font-mono text-[11px]">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)] font-semibold">Platform Role</p>
              <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
            </div>
            <div>
              <p className="text-[var(--text-secondary)] font-semibold">Academic Mapping</p>
              <p className="text-[var(--text-primary)] mt-0.5">
                {selectedUser.department ? `Dept: ${selectedUser.department}` : ''}
                {selectedUser.course ? `${selectedUser.course}` : ''}
                {selectedUser.section ? ` · Sec: ${selectedUser.section}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
