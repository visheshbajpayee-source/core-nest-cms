import api from "../lib/api";

export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "blocked" | string;
  assignedTo?: string;
  project?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Get all tasks
 */
export const getTasks = async (filters?: {
  status?: string;
  priority?: string;
  assignedTo?: string;
  project?: string;
}): Promise<Task[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/api/v1/tasks?${queryString}` : "/api/v1/tasks";

    const response = await api.get<ApiResponse<Task[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get assigned tasks for current user
 */
export const getMyTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<ApiResponse<Task[]>>(
      "/api/v1/tasks/me"
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get a specific task
 */
export const getTaskById = async (taskId: string): Promise<Task> => {
  try {
    const response = await api.get<ApiResponse<Task>>(
      `/api/v1/tasks/${taskId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Create a new task
 */
export const createTask = async (
  payload: Omit<Task, "_id" | "id" | "createdAt" | "updatedAt">
): Promise<Task> => {
  try {
    const response = await api.post<ApiResponse<Task>>(
      "/api/v1/tasks",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update a task
 */
export const updateTask = async (
  taskId: string,
  payload: Partial<Task>
): Promise<Task> => {
  try {
    const response = await api.put<ApiResponse<Task>>(
      `/api/v1/tasks/${taskId}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update task status
 */
export const updateTaskStatus = async (
  taskId: string,
  status: string
): Promise<Task> => {
  return updateTask(taskId, { status } as any);
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/tasks/${taskId}`);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get high priority tasks
 */
export const getHighPriorityTasks = async (): Promise<Task[]> => {
  return getTasks({ priority: "high" });
};

/**
 * Get active tasks (pending or in progress)
 */
export const getActiveTasks = async (): Promise<Task[]> => {
  try {
    const tasks = await getTasks();
    return tasks.filter(
      (t) =>
        t.status === "pending" ||
        t.status === "in_progress" ||
        t.status === "blocked"
    );
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get completed tasks
 */
export const getCompletedTasks = async (): Promise<Task[]> => {
  return getTasks({ status: "completed" });
};
