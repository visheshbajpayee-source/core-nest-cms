import api from "../lib/api";

export interface LeaveType {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  maxDaysPerYear: number;
  isActive: boolean;
  description?: string;
}

export interface LeaveRequest {
  _id?: string;
  id?: string;
  leaveType: string | LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | string;
  approverComments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveBalance {
  leaveType: LeaveType;
  totalAllowed: number;
  used: number;
  remaining: number;
  pending: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ============================================
// Leave Types
// ============================================

/**
 * Get all leave types
 */
export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  try {
    const response = await api.get<ApiResponse<LeaveType[]>>(
      "/api/v1/leave-types"
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get active leave types
 */
export const getActiveLeaveTypes = async (): Promise<LeaveType[]> => {
  try {
    const types = await getLeaveTypes();
    return types.filter((type) => type.isActive);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// ============================================
// Leave Requests
// ============================================

/**
 * Get all leave requests for current user
 */
export const getMyLeaves = async (): Promise<LeaveRequest[]> => {
  try {
    const response = await api.get<ApiResponse<LeaveRequest[]>>(
      "/api/v1/leaves/me"
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get all leave requests (admin/manager)
 */
export const getAllLeaves = async (filters?: {
  status?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<LeaveRequest[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/api/v1/leaves?${queryString}` : "/api/v1/leaves";

    const response = await api.get<ApiResponse<LeaveRequest[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get a specific leave request
 */
export const getLeaveById = async (leaveId: string): Promise<LeaveRequest> => {
  try {
    const response = await api.get<ApiResponse<LeaveRequest>>(
      `/api/v1/leaves/${leaveId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Create a new leave request
 */
export const createLeaveRequest = async (
  payload: Omit<LeaveRequest, "_id" | "id" | "status" | "createdAt" | "updatedAt">
): Promise<LeaveRequest> => {
  try {
    const response = await api.post<ApiResponse<LeaveRequest>>(
      "/api/v1/leaves",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update a leave request
 */
export const updateLeaveRequest = async (
  leaveId: string,
  payload: Partial<LeaveRequest>
): Promise<LeaveRequest> => {
  try {
    const response = await api.put<ApiResponse<LeaveRequest>>(
      `/api/v1/leaves/${leaveId}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Cancel a leave request
 */
export const cancelLeaveRequest = async (leaveId: string): Promise<LeaveRequest> => {
  try {
    const response = await api.put<ApiResponse<LeaveRequest>>(
      `/api/v1/leaves/${leaveId}/cancel`,
      {}
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Approve a leave request (admin/manager)
 */
export const approveLeave = async (
  leaveId: string,
  comments?: string
): Promise<LeaveRequest> => {
  try {
    const response = await api.put<ApiResponse<LeaveRequest>>(
      `/api/v1/leaves/${leaveId}/approve`,
      { comments }
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Reject a leave request (admin/manager)
 */
export const rejectLeave = async (
  leaveId: string,
  comments?: string
): Promise<LeaveRequest> => {
  try {
    const response = await api.put<ApiResponse<LeaveRequest>>(
      `/api/v1/leaves/${leaveId}/reject`,
      { comments }
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Delete a leave request
 */
export const deleteLeaveRequest = async (leaveId: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/leaves/${leaveId}`);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// ============================================
// Leave Balance
// ============================================

/**
 * Get leave balance for current user
 */
export const getMyLeaveBalance = async (): Promise<LeaveBalance[]> => {
  try {
    const response = await api.get<ApiResponse<LeaveBalance[]>>(
      "/api/v1/leaveBalance/me"
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get leave balance for a specific employee (admin/manager)
 */
export const getLeaveBalanceByEmployee = async (
  employeeId: string
): Promise<LeaveBalance[]> => {
  try {
    const response = await api.get<ApiResponse<LeaveBalance[]>>(
      `/api/v1/leaveBalance/${employeeId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
