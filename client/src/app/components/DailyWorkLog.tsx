'use client';

import React from 'react';

interface WorkLogEntry {
  time: string;
  task: string;
  team: string;
  status: 'Completed' | 'In Progress' | string;
}

interface DailyWorkLogProps {
  entries?: WorkLogEntry[];
  onAddLog?: () => void;
}

export default function DailyWorkLog({
  entries = [
    { time: '09:00', task: 'Daily Standup', team: 'Alpha Project', status: 'Completed' },
    { time: '09:30', task: 'Q3 Marketing Plan', team: '3.0', status: 'In Progress' },
  ],
  onAddLog,
}: DailyWorkLogProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Daily Work Log</h2>
        <button 
          onClick={onAddLog}
          className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition"
        >
          Add Log
        </button>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">Add your completed work log for today</div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Today's Entries</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Team Name</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="py-3 px-2">
                  <div className="text-sm text-gray-500">{entry.time}</div>
                  <div className="text-sm font-medium text-gray-800">{entry.task}</div>
                </td>
                <td className="py-3 px-2 text-sm text-gray-700">{entry.team}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    entry.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
