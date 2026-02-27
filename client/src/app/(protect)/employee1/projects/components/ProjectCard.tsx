'use client';

import React from 'react';
import { Project } from '../services/projects.service';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onStatusChange: (projectId: string, status: string) => void;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  not_started: { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-400' },
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  on_hold: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
};

export default function ProjectCard({
  project,
  onSelect,
  onStatusChange,
}: ProjectCardProps) {
  const statusColor = statusColors[project.status] || statusColors.not_started;
  const startDate = new Date(project.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endDate = new Date(project.expectedEndDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 truncate flex-1">{project.name}</h3>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusColor.text} ${statusColor.bg}`}>
          <span className={`w-2 h-2 rounded-full ${statusColor.dot}`}></span>
          {project.status.replace(/_/g, ' ')}
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {project.description || 'No description'}
      </p>

      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
        <div className="text-xs text-gray-500">
          <span className="font-medium">{startDate}</span>
          <span className="mx-1">→</span>
          <span className="font-medium">{endDate}</span>
        </div>
      </div>

      {/* Employees should not be able to change project status from the card */}
      <div className="text-xs text-gray-500 mt-2">&nbsp;</div>
    </div>
  );
}
