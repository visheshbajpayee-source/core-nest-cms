'use client';

import React from 'react';

interface CalendarWidgetProps {
  month?: string;
  year?: number;
  totalDays?: number;
  currentDay?: number;
  attendanceByDay?: Record<number, string>;
}

export default function CalendarWidget({
  month = 'November',
  year = 2024,
  totalDays = 30,
  currentDay = 18,
  attendanceByDay = {},
}: CalendarWidgetProps) {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  const firstDayOffset = new Date(year, monthIndex, 1).getDay();

  const getStatusMeta = (status?: string) => {
    const normalized = (status ?? '').toLowerCase();
    if (normalized === 'present') {
      return { badge: 'P', cell: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' };
    }
    if (normalized === 'absent') {
      return { badge: 'A', cell: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' };
    }
    if (normalized === 'on_leave' || normalized === 'leave') {
      return { badge: 'L', cell: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' };
    }
    if (normalized === 'half_day') {
      return { badge: 'H', cell: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' };
    }
    return { badge: '', cell: 'text-gray-700 hover:bg-gray-100', dot: 'bg-slate-400' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700">{month} {year}</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-center">
          {weekDays.map((day, i) => (
            <div key={i} className="text-gray-500 font-medium py-1">{day}</div>
          ))}
          {Array.from({ length: firstDayOffset }).map((_, idx) => (
            <div key={`blank-${idx}`} className="py-1" />
          ))}
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
            <div key={day} className="py-1">
              {(() => {
                const status = attendanceByDay[day];
                const meta = getStatusMeta(status);
                const isCurrent = day === currentDay;

                return (
                  <div
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full font-medium transition ${meta.cell} ${
                      isCurrent ? 'ring-2 ring-teal-500 ring-offset-1' : ''
                    }`}
                    title={status ? `${day} - ${status}` : `${day}`}
                  >
                    {meta.badge || day}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span className="text-gray-600">P - Present</span>
          <span className="inline-block w-2 h-2 bg-rose-500 rounded-full ml-2"></span>
          <span className="text-gray-600">A - Absent</span>
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
          <span className="text-gray-600">L - Leave</span>
          <span className="inline-block w-2 h-2 bg-amber-500 rounded-full ml-2"></span>
          <span className="text-gray-600">H - Half Day</span>
        </div>
      </div>
    </div>
  );
}