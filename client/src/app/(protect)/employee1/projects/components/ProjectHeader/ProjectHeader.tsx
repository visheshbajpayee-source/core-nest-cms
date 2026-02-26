import React from 'react';

const ProjectHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
        My Projects
      </h1>
      <p className="text-sm sm:text-base text-gray-500">
        View and manage your assigned projects.
      </p>
    </div>
  );
};

export default ProjectHeader;