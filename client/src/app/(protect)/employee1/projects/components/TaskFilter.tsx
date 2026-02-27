'use client';

import React from 'react';
import { Task } from '../services/tasks.service';

interface TaskFilterProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  tasks: Task[];
}

export default function TaskFilter({
  filter,
  onFilterChange,
  tasks,
}: TaskFilterProps) {
  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      <button
        onClick={() => onFilterChange('')}
        className={`px-3 py-1 text-sm rounded ${
          filter === ''
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All ({tasks.length})
      </button>
      {['todo', 'in_progress', 'in_review', 'done'].map((status) => {
        const count = tasks.filter((t) => t.status === status).length;
        return (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`px-3 py-1 text-sm rounded capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace(/_/g, ' ')} ({count})
          </button>
        );
      })}
    </div>
  );
}
