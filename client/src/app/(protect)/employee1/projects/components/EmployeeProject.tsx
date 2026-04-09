'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectsHeader from './ProjectsHeader';
import ProjectsList from './ProjectsList';
import ProjectDetail from './ProjectDetail';
import { Project, fetchProjects } from '../services/projects.service';

export default function EmployeeProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjects();
        setProjects(data);
        setError('');
      } catch (err: any) {
        console.error('Error loading projects:', err);
        const msg = err?.message || 'Failed to load projects';
        setError(msg);
        // auto-redirect to login on auth-related errors
        if (/token|unauthorized|forbidden/i.test(msg)) {
          localStorage.removeItem('accessToken');
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [router]);

  const inProgressCount = projects.filter(
    (p) => p.status === 'in_progress'
  ).length;
  const completedCount = projects.filter(
    (p) => p.status === 'completed'
  ).length;

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {selectedProject ? (
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <>
          <ProjectsHeader
            totalProjects={projects.length}
            projectsInProgress={inProgressCount}
            completedProjects={completedCount}
          />
          <ProjectsList
            projects={projects}
            onSelectProject={setSelectedProject}
            onProjectsUpdate={setProjects}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
