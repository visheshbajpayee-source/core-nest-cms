import React from 'react';
import { ProjectStatus } from '../../ProjectData';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";

  if (status === "Completed") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        Completed
      </span>
    );
  }
  
  if (status === "Pending") {
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>
        Pending
      </span>
    );
  }

  return (
    <span className={`${base} bg-indigo-100 text-indigo-700`}>
      In Progress
    </span>
  );
};

export default ProjectStatusBadge;