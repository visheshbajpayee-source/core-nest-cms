'use client';

import Link from 'next/link';
import type { WorkLogEntry } from '@/app/(protect)/employee1/worklog/components/useWorkLog';

interface DailyWorkLogProps {
  initialEntries?: WorkLogEntry[];
}

export default function DailyWorkLog({ initialEntries = [] }: DailyWorkLogProps) {
  const previewEntries = initialEntries
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  const statusStyles: Record<WorkLogEntry['status'], string> = {
    Completed: 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    Blocked: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Daily Work Log</h2>
          <p className="text-xs text-slate-500 sm:text-sm">Latest updates from your submitted logs</p>
        </div>
        <Link
          href="/employee1/worklog"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:text-sm"
        >
          View all
        </Link>
      </div>

      {previewEntries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          No work logs yet. Add today&apos;s update from Work Log page.
        </div>
      ) : (
        <div className="space-y-3">
          {previewEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 sm:text-base">{entry.title}</h3>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusStyles[entry.status]}`}>
                  {entry.status}
                </span>
              </div>
              <p className="line-clamp-2 text-xs text-slate-600 sm:text-sm">{entry.description || 'No description provided.'}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 sm:text-xs">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span className="font-medium text-slate-700">{entry.hoursSpent}h</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}