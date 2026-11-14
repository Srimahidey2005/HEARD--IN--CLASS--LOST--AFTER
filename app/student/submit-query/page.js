import QueryForm from '@/components/QueryForm';
import { getCurrentUser } from '@/lib/auth';
import { Sparkles, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default async function Page() {
  const u = await getCurrentUser();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
          <Sparkles size={14} />
          Student Query Submission
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Submit Academic Doubt
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          Provide your subject and context. Our intelligent triage service will automatically match and route your query to the qualified faculty member.
        </p>
      </div>

      {/* Query tips banner */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-lime-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-0.5">Be Specific:</strong> Mention the theorem, lecture slide, or exact line of code causing confusion.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
          <Clock size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-0.5">Fair Routing:</strong> Queries are balanced across faculty workloads for the fastest response.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
          <ShieldCheck size={18} className="text-violet-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-0.5">Follow-Up:</strong> You can book a 1-on-1 office hour appointment directly from the response.
          </p>
        </div>
      </div>

      <QueryForm
        defaultCourse={u?.course || ''}
        defaultSemester={u?.semester || ''}
        defaultSection={u?.section || ''}
      />
    </div>
  );
}
