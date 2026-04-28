import api from "@/app/lib/api";

export interface LeaveRequest {
  _id: string;
  id?: string;
  employee: {
    _id: string;
    fullName: string;
    email: string;
    employeeId: string;
  };
  leaveType: {
    _id: string;
    name: string;
    code: string;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  numberOfDays?: number; // Alias for totalDays
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: {
    _id: string;
    fullName: string;
  };
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Get all leave requests (admin only)
 * Supports filtering by status, employee, and leave type
 */
export const getAllLeaveRequests = async (filters?: {
  status?: "pending" | "approved" | "rejected";
  employeeId?: string;
  leaveType?: string;
}): Promise<LeaveRequest[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/leaves?${queryString}`
      : "/api/v1/leaves";

    const response = await api.get<ApiResponse<LeaveRequest[]>>(url);
    
    // Normalize data - add numberOfDays as alias for totalDays
    return (response.data.data || []).map((leave: LeaveRequest) => ({
      ...leave,
      numberOfDays: leave.totalDays,
    }));
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get pending leave requests only (admin only)
 */
export const getPendingLeaves = async (): Promise<LeaveRequest[]> => {
  return getAllLeaveRequests({ status: "pending" });
};

/**
 * Get approved leave requests (admin only)
 */
export const getApprovedLeaves = async (): Promise<LeaveRequest[]> => {
  return getAllLeaveRequests({ status: "approved" });
};

/**
 * Get rejected leave requests (admin only)
 */
export const getRejectedLeaves = async (): Promise<LeaveRequest[]> => {
  return getAllLeaveRequests({ status: "rejected" });
};

/**
 * Approve a leave request (admin/manager only)
 */
export const approveLeaveRequest = async (leaveId: string): Promise<LeaveRequest> => {
  try {
    const response = await api.put<ApiResponse<LeaveRequest>>(
      `/api/v1/leaves/${leaveId}/approve`,
      {}
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Reject a leave request (admin/manager only)
 */
export const rejectLeaveRequest = async (leaveId: string): Promise<LeaveRequest> => {
  try {
    const response = await api.put<ApiResponse<LeaveRequest>>(
      `/api/v1/leaves/${leaveId}/reject`,
      {}
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get leave request statistics
 */
export const getLeaveStatistics = async (): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}> => {
  try {
    const leaves = await getAllLeaveRequests();
    return {
      pending: leaves.filter((l) => l.status === "pending").length,
      approved: leaves.filter((l) => l.status === "approved").length,
      rejected: leaves.filter((l) => l.status === "rejected").length,
      total: leaves.length,
    };
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
