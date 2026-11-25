"use client";

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Avoid hydration mismatch before mount
  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-white/10 bg-white/5 ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-2 border ${
        isDark
          ? 'bg-[#1D1B2A] text-amber-300 border-[#373349] hover:bg-[#2D2A40] hover:border-[#A99AEF]/40'
          : 'bg-[#F1EFF9] text-violet-700 border-[#E9E6F0] hover:bg-[#E9E5F7] hover:border-[#7161C5]/40'
      } ${className}`}
      title={isDark ? 'Switch to Lavender Dream Light Mode' : 'Switch to Deep Violet Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={17} className="transition-transform duration-300 hover:rotate-45 text-amber-300" />
      ) : (
        <Moon size={17} className="transition-transform duration-300 hover:-rotate-12 text-violet-700" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
