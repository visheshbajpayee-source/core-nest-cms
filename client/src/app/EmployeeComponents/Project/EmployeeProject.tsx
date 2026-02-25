"use client";

import React from "react";
import ProjectHeader from './Components/ProjectHeader';
import ProjectMapping from './Mapping';
import { projects } from './ProjectData';

const EmployeeProject: React.FC = () => {
  return (
    <div className="flex-1 w-full h-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <ProjectHeader />
      <ProjectMapping projects={projects} />
    </div>
  );
};

export default EmployeeProject;
