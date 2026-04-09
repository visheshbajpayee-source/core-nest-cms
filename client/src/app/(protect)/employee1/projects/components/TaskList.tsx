'use client';

import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskFilter from './TaskFilter';
import { Task } from '../services/tasks.service';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: string) => void;
  isLoading?: boolean;
}

export default function TaskList({
  tasks,
  onStatusChange,
  isLoading = false,
}: TaskListProps) {
  const [filter, setFilter] = useState<string>('');

  const filteredTasks = filter
    ? tasks.filter((t) =>
        t.status === filter ||
        t.priority === filter
      )
    : tasks;

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No tasks in this project</div>
    );
  }

  return (
    <div>
      <TaskFilter filter={filter} onFilterChange={setFilter} tasks={tasks} />

      <div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tasks match the selected filter
          </div>
        )}
      </div>
    </div>
  );
}
