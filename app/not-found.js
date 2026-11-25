import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="p-4 rounded-2xl bg-[#A99AEF]/15 border border-[#A99AEF]/30 text-[#A99AEF]">
        <AlertCircle size={48} className="mx-auto" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-[#A99AEF] uppercase tracking-widest">
          Error 404 · Signal Lost
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[var(--text-primary)]">
          Page Not Found
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
          The academic corridor or resource you were looking for does not exist or has been relocated.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="btn btn-primary text-sm font-bold flex items-center gap-2">
          <Home size={16} />
          <span>Return Home</span>
        </Link>
        <Link href="/login" className="btn btn-secondary text-sm flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Portals Login</span>
        </Link>
      </div>
    </div>
  );
}
