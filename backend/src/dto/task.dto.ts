export interface CreateTaskDto {
  title: string;
  description?: string;
  project: string;
  assignedTo?: string[];
  priority?: "low" | "medium" | "high" | "critical";
  status?: "todo" | "in_progress" | "in_review" | "done";
  dueDate: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: string[];
  priority?: "low" | "medium" | "high" | "critical";
  status?: "todo" | "in_progress" | "in_review" | "done";
  dueDate?: string;
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  project: string;
  assignedTo: string[];
  priority: string;
  status: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
