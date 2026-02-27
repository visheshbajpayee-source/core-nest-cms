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
        config.headers.Authorization = `Bearer ${token}`;
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
  filters?: LeaveFilters
): Promise<LeaveHistoryResponse> => {
  try {
    const now = new Date();

    const month = filters?.month ?? String(now.getMonth() + 1);
    const year = filters?.year ?? String(now.getFullYear());

    const params: LeaveFilters = {
      month,
      year,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.leaveType ? { leaveType: filters.leaveType } : {}),
    };

    console.log("📞 Fetching leave history with:", { month, year });

    const response = await leaveAPI.get<LeaveHistoryResponse>(
      `/v1/leaves/me`,
      {
        params,
      }
    );

    console.log("✅ Leave history API response:", response.data);

    return {
      success: true,
      data: response.data.data,
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