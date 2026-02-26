import axios from "axios";
import { dummyAttendanceData } from "./data";
// Types for Attendance

export interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: string | null;
  status: "Active" | "Present" | "Absent" | "Late";
}

export interface AttendanceHistoryResponse {
  success: boolean;
  data: AttendanceRecord[];
}

export interface AttendanceFilters {
  month?: string; // e.g. '11'
  year?: string; // e.g. '2024'
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';


const attendanceAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens
attendanceAPI.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
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

/**
 * Fetch attendance history for an employee
 */
export const getAttendanceHistory = async (
  employeeId: string,
  filters?: AttendanceFilters
): Promise<AttendanceHistoryResponse> => {
  try {
    const now = new Date();

    const month =
      filters?.month || String(now.getMonth() + 1).padStart(2, "0");

    const year =
      filters?.year || String(now.getFullYear());

    console.log(
      `Fetching attendance history for employee `,
      { month, year }
    );

    const response = await attendanceAPI.get(
      `/attendance/me/${employeeId}?month=${month}&year=${year}`
    );
    // const response = await attendanceAPI.get(
    //   `/attendance/me?month=2&year=2026&id=69985012cec31c6777439699`
    // );

    console.log("API response:", response.data);

    return response.data;

  } catch (error) {
    console.warn("API call failed, returning dummy data:", error);

    return {
      success: true,
      data: [],
    };
  }
};

export const getAttendanceRecord = async (): Promise<AttendanceHistoryResponse> => {
  try {
    console.log("Fetching attendance summary");

    // const response = await attendanceAPI.get(
    //   `/attendance/summary`
    // );

    
    const response = {
      success: true,
      data: dummyAttendanceData,
    };

    console.log("API response for attendance summary:", response.data);

    return response.data;
   
  } catch (error) {
    console.warn("Summary API failed:", error);

    return {
      success: true,
      data: [],
    };
  }
};





export const attendanceService = {
  getAttendanceHistory,
  getAttendanceRecord
};

