import axios, { AxiosError, AxiosInstance } from "axios";

/* ================================
   Types
================================ */

export type LeaveType = "sick" | "casual" | "earned" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRecord {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  appliedDate: string;
}

export interface LeaveHistoryResponse {
  success: boolean;
  data: LeaveRecord[];
}

export interface LeaveFilters {
  month?: string;
  year?: string;
  status?: LeaveStatus;
  leaveType?: LeaveType;
}

export interface CreateLeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface CreateLeaveResponse {
  success: boolean;
  message?: string;
  data?: LeaveRecord;
}

/* ================================
   Axios Setup
================================ */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const leaveAPI: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
leaveAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   Dummy Data
================================ */

const dummyLeaveData: LeaveRecord[] = [
  {
    id: "1",
    leaveType: "sick",
    startDate: "2026-02-03",
    endDate: "2026-02-05",
    numberOfDays: 3,
    reason: "Medical checkup and recovery",
    status: "approved",
    createdAt: "2026-01-28T10:00:00Z",
    appliedDate: "2026-01-28",
  },
];

/* ================================
   Services
================================ */

/**
 * Fetch leave history
 */
export const getLeaveHistory = async (
  employeeId: string,
  filters?: LeaveFilters
): Promise<LeaveHistoryResponse> => {
  try {
    const now = new Date();

    const month = filters?.month ?? String(now.getMonth() + 1);
    const year = filters?.year ?? String(now.getFullYear());

    // 🔥 When API ready, use this:
    /*
    const response = await leaveAPI.get<LeaveHistoryResponse>(
      `/leaves/${employeeId}/history`,
      {
        params: {
          month,
          year,
          status: filters?.status,
          leaveType: filters?.leaveType,
        },
      }
    );

    return response.data;
    */

    // Dummy filtering
    const filteredData = dummyLeaveData.filter((leave) => {
      const leaveMonth = new Date(leave.startDate).getMonth() + 1;
      const leaveYear = new Date(leave.startDate).getFullYear();

      return (
        leaveMonth === Number(month) &&
        leaveYear === Number(year) &&
        (!filters?.status || leave.status === filters.status) &&
        (!filters?.leaveType || leave.leaveType === filters.leaveType)
      );
    });

    return {
      success: true,
      data: filteredData,
    };
  } catch (error) {
    console.error("Error fetching leave history:", error);
    return {
      success: false,
      data: [],
    };
  }
};

/**
 * Submit leave request
 */
export const submitLeave = async (
  leaveData: CreateLeaveRequest
): Promise<CreateLeaveResponse> => {
  try {
     console.log("🚀 submitLeave called with data:", leaveData);
     console.log("🔗 API URL:", `${API_BASE_URL}/v1/leaves`);
     console.log("🔑 Token exists:", !!localStorage.getItem("accessToken"));

    const response = await leaveAPI.post<CreateLeaveResponse>(
      `/v1/leaves`,
      leaveData
    );

     console.log("✅ API response for leave submission:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error in submitLeave:", error);
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("❌ Error details:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });

    return {
      success: false,
      message:
        axiosError.response?.data?.message ??
        "Failed to submit leave request",
    };
  }
};

export const leaveService = {
  getLeaveHistory,
  submitLeave,
};