'use client';

import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import { Project, updateProjectStatus } from '../services/projects.service';

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  isLoading?: boolean;
}

export default function ProjectsList({
  projects,
  onSelectProject,
  isLoading = false,
}: ProjectsListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = !statusFilter || p.status === statusFilter;
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projects, statusFilter, searchTerm]);

  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      await updateProjectStatus(projectId, status);
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        project.status = status as any;
      }
    } catch (error) {
      console.error('Failed to update project status:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading projects...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ProjectFilter
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        projects={projects}
      />

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No projects found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
