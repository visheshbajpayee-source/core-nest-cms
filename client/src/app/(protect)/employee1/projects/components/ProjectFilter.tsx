'use client';

import React from 'react';
import { Project } from '../services/projects.service';

interface ProjectFilterProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  projects: Project[];
}

export default function ProjectFilter({
  statusFilter,
  onStatusFilterChange,
  projects,
}: ProjectFilterProps) {
  const statusCounts = {
    not_started: projects.filter((p) => p.status === 'not_started').length,
    in_progress: projects.filter((p) => p.status === 'in_progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    on_hold: projects.filter((p) => p.status === 'on_hold').length,
  };

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => onStatusFilterChange('')}
        className={`px-4 py-2 text-sm rounded-full font-medium whitespace-nowrap ${
          statusFilter === ''
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All ({projects.length})
      </button>
      {(
        [
          { key: 'not_started', label: 'Not Started' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
          { key: 'on_hold', label: 'On Hold' },
        ] as const
      ).map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onStatusFilterChange(key)}
          className={`px-4 py-2 text-sm rounded-full font-medium whitespace-nowrap ${
            statusFilter === key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label} ({statusCounts[key]})
        </button>
      ))}
    </div>
  );
}
