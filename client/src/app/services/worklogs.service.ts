import api from "../lib/api";

export interface Worklog {
  _id?: string;
  id?: string;
  date: string;
  taskTitle: string;
  taskDescription: string;
  hoursSpent: number;
  status: "in_progress" | "completed" | "blocked" | string;
  project?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Get all worklogs for current user
 */
export const getMyWorklogs = async (filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<Worklog[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/worklogs/me?${queryString}`
      : "/api/v1/worklogs/me";

    const response = await api.get<ApiResponse<Worklog[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get all worklogs
 */
export const getWorklogs = async (filters?: {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<Worklog[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/api/v1/worklogs?${queryString}` : "/api/v1/worklogs";

    const response = await api.get<ApiResponse<Worklog[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get a specific worklog
 */
export const getWorklogById = async (worklogId: string): Promise<Worklog> => {
  try {
    const response = await api.get<ApiResponse<Worklog>>(
      `/api/v1/worklogs/${worklogId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Create a new worklog
 */
export const createWorklog = async (
  payload: Omit<Worklog, "_id" | "id" | "createdAt" | "updatedAt">
): Promise<Worklog> => {
  try {
    const response = await api.post<ApiResponse<Worklog>>(
      "/api/v1/worklogs",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update a worklog
 */
export const updateWorklog = async (
  worklogId: string,
  payload: Partial<Worklog>
): Promise<Worklog> => {
  try {
    const response = await api.put<ApiResponse<Worklog>>(
      `/api/v1/worklogs/${worklogId}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Delete a worklog
 */
export const deleteWorklog = async (worklogId: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/worklogs/${worklogId}`);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get today's worklogs
 */
export const getTodayWorklogs = async (): Promise<Worklog[]> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const worklogs = await getMyWorklogs();
    return worklogs.filter((w) => w.date.startsWith(today));
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get worklogs for a date range
 */
export const getWorklogsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Worklog[]> => {
  return getMyWorklogs({ startDate, endDate });
};

/**
 * Get completed worklogs
 */
export const getCompletedWorklogs = async (): Promise<Worklog[]> => {
  return getMyWorklogs({ status: "completed" });
};
