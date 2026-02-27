import axios from "axios";
// import { dummyLeaveData } from "./data";

// Types for Leave Management
export interface LeaveRecord {
  id: string;
  leaveType: "sick" | "casual" | "earned" | "other";
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  appliedDate: string;
}

export interface LeaveHistoryResponse {
  success: boolean;
  data: LeaveRecord[];
}

export interface LeaveFilters {
  month?: string; // e.g. '2'
  year?: string; // e.g. '2026'
  status?: string; // 'pending', 'approved', 'rejected'
  leaveType?: string; // 'sick', 'casual', 'earned', 'other'
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const leaveAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens
leaveAPI.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dummy data for development
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
  {
    id: "2",
    leaveType: "casual",
    startDate: "2026-02-15",
    endDate: "2026-02-15",
    numberOfDays: 1,
    reason: "Personal work",
    status: "pending",
    createdAt: "2026-02-10T14:30:00Z",
    appliedDate: "2026-02-10",
  },
  {
    id: "3",
    leaveType: "earned",
    startDate: "2026-01-10",
    endDate: "2026-01-14",
    numberOfDays: 5,
    reason: "Family vacation",
    status: "rejected",
    createdAt: "2025-12-28T09:15:00Z",
    appliedDate: "2025-12-28",
  },
  {
    id: "4",
    leaveType: "other",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    numberOfDays: 3,
    reason: "Wedding ceremony",
    status: "approved",
    createdAt: "2026-03-01T11:45:00Z",
    appliedDate: "2026-03-01",
  },
];

/**
 * Fetch leave history for an employee
 */
export const getLeaveHistory = async (
  employeeId: string,
  filters?: LeaveFilters
): Promise<LeaveHistoryResponse> => {
  try {
    const now = new Date();

    const month = filters?.month || String(now.getMonth() + 1);
    const year = filters?.year || String(now.getFullYear());

    const query = new URLSearchParams({
      month,
      year
    }).toString();

    // Uncomment when API is ready
    // const response = await leaveAPI.get(
    //   `/leaves/${employeeId}/history?${query}`
    // );
    // return response.data;
      
    // Filter dummy data based on filters
    let filteredData = dummyLeaveData;
;

    return {
      success: true,
      data: filteredData
    }; 

  } catch (error) {
    console.warn("API call failed, returning empty data:", error);
    return {
      success: false,
      data: [],
    };  
  }
};


export const leaveService = {
  getLeaveHistory,
};

