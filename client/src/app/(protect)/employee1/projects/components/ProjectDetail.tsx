'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../services/projects.service';
import { Task, fetchTasksByProject, updateTaskStatus } from '../services/tasks.service';
import TaskList from './TaskList';
import ProjectInfo from './ProjectInfo';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({
  project,
  onBack,
}: ProjectDetailProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTasksByProject(project.id);
        setTasks(data);
      } catch (error: any) {
        console.error('Failed to load tasks:', error);
        const msg = error?.message || '';
        if (/token|unauthorized|forbidden/i.test(msg)) {
          // unauthorized, drop token and send to login
          localStorage.removeItem('accessToken');
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, [project.id, router]);

  const handleTaskStatusChange = async (taskId: string, status: string) => {
    try {
      const updated = await updateTaskStatus(taskId, status);
      setTasks(
        tasks.map((t) => (t.id === taskId ? updated : t))
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-600 bg-green-600 text-white font-medium hover:bg-green-700 transition"
      >
        <span>←</span>
        <span>Back to Projects</span>
      </button>

      <ProjectInfo project={project} />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members ({project.teamMembers.length})</h2>
        {project.teamMembers.length === 0 ? (
          <p className="text-gray-600">No team members assigned</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.teamMembers.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900">{member.fullName}</h3>
                <p className="text-sm text-gray-600">{member.employeeId}</p>
                <p className="text-sm text-gray-600">{member.designation}</p>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks ({tasks.length})</h2>
        <TaskList
          tasks={tasks}
          onStatusChange={handleTaskStatusChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
