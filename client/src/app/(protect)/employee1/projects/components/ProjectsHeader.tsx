'use client';

import React from 'react';

interface ProjectsHeaderProps {
  totalProjects: number;
  projectsInProgress: number;
  completedProjects: number;
}

export default function ProjectsHeader({
  totalProjects,
  projectsInProgress,
  completedProjects,
}: ProjectsHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-sm text-blue-700 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-900">{projectsInProgress}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-sm text-green-700 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-900">{completedProjects}</p>
        </div>
      </div>
    </div>
  );
}
