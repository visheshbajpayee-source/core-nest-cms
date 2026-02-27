'use client';

import React from 'react';
import { Project } from '../services/projects.service';

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.expectedEndDate);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-4">{project.description || 'No description'}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 mb-1">Start Date</p>
          <p className="font-semibold">{startDate.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">End Date</p>
          <p className="font-semibold">{endDate.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Days Remaining</p>
          <p className={daysRemaining < 0 ? 'text-red-600 font-semibold' : 'font-semibold'}>
            {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Team Members</p>
          <p className="font-semibold">{project.teamMembers.length}</p>
        </div>
      </div>
    </div>
  );
}
