'use client';

import React from 'react';

interface Notice {
  type: string;
  text: string;
  detail: string;
}

interface Holiday {
  date: string;
  event: string;
}

interface NoticeBoardProps {
  notices?: Notice[];
  holidays?: Holiday[];
}

export default function NoticeBoard({
  notices = [
    { type: 'URGENT', text: 'Server Maintenance Tonight', detail: 'Company Holiday - Dec 25th - Happens by Friday' },
  ],
  holidays = [
    { date: 'November 25', event: 'Diwali Celebration' },
  ],
}: NoticeBoardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Notice Board</h2>

      <div className="space-y-3">
        {notices.map((notice, idx) => (
          <div key={idx} className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded font-semibold">
                {notice.type}
              </span>
              <span className="text-sm font-semibold text-red-700">{notice.text}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{notice.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Holidays</h3>
        <div className="space-y-2">
          {holidays.map((holiday, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{holiday.date}</span>
              <span className="text-sm text-gray-600">{holiday.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
