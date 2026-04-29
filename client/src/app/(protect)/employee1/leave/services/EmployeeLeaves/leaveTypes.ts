import api from "@/app/lib/api";

export interface LeaveTypeRecord {
  _id: string;
  name: string;
  code: string;
  maxDaysPerYear: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveTypesResponse {
  success: boolean;
  message?: string;
  data: LeaveTypeRecord[];
}

export const getLeaveTypes = async (): Promise<LeaveTypesResponse> => {
  try {
    console.log("📞 Fetching leave types...");

    const response = await api.get<LeaveTypesResponse>(`/api/v1/leave-types`);

    console.log("✅ Leave types API response:", response.data);

    return {
      success: true,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("❌ Error fetching leave types:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to fetch leave types",
    };
  }
};

export const getLeaveTypeById = async (
  id: string
): Promise<{ success: boolean; data: LeaveTypeRecord | null; message?: string }> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: LeaveTypeRecord;
      message?: string;
    }>(`/api/v1/leave-types/${id}`);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("❌ Error fetching leave type:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Failed to fetch leave type",
    };
  }
};

export const leaveTypeService = {
  getLeaveTypes,
  getLeaveTypeById,
};
