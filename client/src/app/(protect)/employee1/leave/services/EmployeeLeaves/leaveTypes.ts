import axios, { AxiosInstance } from "axios";

/* ================================
   Types
================================ */

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

/* ================================
   Axios Setup
================================ */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const leaveTypeAPI: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
leaveTypeAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   Services
================================ */

/**
 * Fetch all active leave types
 */
export const getLeaveTypes = async (): Promise<LeaveTypesResponse> => {
  try {
    console.log("📞 Fetching leave types...");

    const response = await leaveTypeAPI.get<LeaveTypesResponse>(
      `/v1/leave-types`
    );

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

/**
 * Get leave type by ID
 */
export const getLeaveTypeById = async (
  id: string
): Promise<{ success: boolean; data: LeaveTypeRecord | null; message?: string }> => {
  try {
    const response = await leaveTypeAPI.get<{
      success: boolean;
      data: LeaveTypeRecord;
      message?: string;
    }>(`/v1/leave-types/${id}`);

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
