'use client';

import React from 'react';

interface CalendarWidgetProps {
  month?: string;
  year?: number;
  totalDays?: number;
  currentDay?: number;
}

export default function CalendarWidget({
  month = 'November',
  year = 2024,
  totalDays = 30,
  currentDay = 18,
}: CalendarWidgetProps) {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`py-1 rounded ${
                day === currentDay ? 'bg-teal-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
          <span className="text-gray-600">P - Present</span>
          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
          <span className="text-gray-600">A - Absent</span>
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
          <span className="text-gray-600">L - Leave</span>
        </div>
      </div>
    </div>
  );
}
