'use client';

import React from 'react';

interface Task {
  text: string;
  type?: string;
  label?: string;
  team?: string;
  priority?: 'high' | 'normal' | 'low';
}

interface MyFocusProps {
  tasks?: Task[];
}

export default function MyFocus({
  tasks = [
    { text: 'Review pending page wireframes', type: 'NEW', label: 'Due Today', priority: 'high' },
    { text: 'Schedule team sync', team: 'ID-Priv-Latest', priority: 'normal' },
    { text: 'Research competitor analysis', team: 'ID-Priv-Latest', priority: 'normal' },
  ],
}: MyFocusProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">My Focus</h2>
      
      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
            <input type="checkbox" className="mt-1 w-4 h-4 text-teal-500 rounded" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {task.type && (
                  <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded font-semibold">
                    {task.type}
                  </span>
                )}
                {task.label && (
                  <span className="text-xs text-red-500 font-medium">{task.label}</span>
                )}
              </div>
              <div className="text-sm text-gray-800">{task.text}</div>
              {task.team && (
                <div className="text-xs text-gray-500 mt-1">{task.team}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">My Tasks</h3>
        <div className="text-sm text-gray-500">No pending tasks</div>
      </div>
    </div>
  );
}
