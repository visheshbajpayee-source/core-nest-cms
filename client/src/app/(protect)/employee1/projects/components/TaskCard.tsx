'use client';

import React from 'react';
import { Task } from '../services/tasks.service';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: string) => void;
}

const priorityColors: Record<string, { bg: string; text: string }> = {
  low: { bg: 'bg-blue-100', text: 'text-blue-800' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  high: { bg: 'bg-orange-100', text: 'text-orange-800' },
  critical: { bg: 'bg-red-100', text: 'text-red-800' },
};

const statusColors: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  in_review: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
};

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'done';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-2 hover:shadow-sm transition">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm text-gray-900 flex-1">{task.title}</h4>
        <span
          className={`text-xs px-2 py-1 rounded font-medium ${priorityColors[task.priority]?.bg || ''} ${priorityColors[task.priority]?.text || ''}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{task.description}</p>
      )}

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          <span className={isOverdue && task.status !== 'done' ? 'text-red-600 font-medium' : ''}>
            Due: {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <select
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          value={task.status}
          className={`text-xs px-2 py-1 rounded font-medium border-0 cursor-pointer ${statusColors[task.status] || ''}`}
        >
          {['todo', 'in_progress', 'in_review', 'done'].map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
