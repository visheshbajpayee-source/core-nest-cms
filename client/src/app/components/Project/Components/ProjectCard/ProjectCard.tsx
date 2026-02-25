import React from 'react';
import ProjectStatusBadge from '../ProjectStatusBadge';
import ProjectProgress from '../ProjectProgress';
import { Project } from '../../ProjectData';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">
          {project.title}
        </h3>
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="text-gray-500 text-sm line-clamp-2">
        {project.description}
      </p>

      <ProjectProgress progress={project.progress} />

      <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
        Deadline: {project.deadline}
      </div>
    </div>
  );
};

export default ProjectCard;