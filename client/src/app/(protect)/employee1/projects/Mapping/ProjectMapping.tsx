import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../components/ProjectData';

interface ProjectMappingProps {
  projects: Project[];
}

const ProjectMapping: React.FC<ProjectMappingProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="col-span-full text-center text-gray-400 py-12">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-gray-400">No projects found</h3>
              <p className="text-sm text-gray-300">No projects available at the moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
};

export default ProjectMapping;