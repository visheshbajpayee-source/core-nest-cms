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
        className="mb-4 text-sm text-blue-600 hover:text-blue-800"
      >
        ← Back to Projects
      </button>

      <ProjectInfo project={project} />

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
