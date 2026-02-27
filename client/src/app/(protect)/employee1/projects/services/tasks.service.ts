import api from "@/app/lib/api";

export interface Task {
  id: string;
  title: string;
  description?: string;
  project: string;
  assignedTo: string[];
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in_progress" | "in_review" | "done";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  project: string;
  assignedTo: string[];
  priority: string;
  dueDate: Date;
}

export const fetchTasksByProject = async (
  projectId: string
): Promise<Task[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Task[] }>(
      `/api/v1/tasks?project=${projectId}`
    );
    return response.data.data || [];
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to fetch tasks" };
  }
};

export const updateTaskStatus = async (
  taskId: string,
  status: string
): Promise<Task> => {
  try {
    const response = await api.put<{ success: boolean; data: Task }>(
      `/api/v1/tasks/${taskId}`,
      { status }
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to update task" };
  }
};

export const fetchAllTasks = async (filters?: {
  status?: string;
  priority?: string;
}): Promise<Task[]> => {
  try {
    let url = "/api/v1/tasks";
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await api.get<{ success: boolean; data: Task[] }>(url);
    return response.data.data || [];
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to fetch tasks" };
  }
};
