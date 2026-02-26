import axios from "axios";
import { dummyAttendanceData } from "./data";
// import Attendance from "@/app/EmployeeComponents/AttendanceComponent/Attendance";
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


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


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

/**
 * Fetch attendance history for an employee
 */
export const getAttendanceHistory = async (
  employeeId: string,
  filters?: AttendanceFilters
): Promise<AttendanceHistoryResponse> => {
  try {
    const now = new Date();

    const month = filters?.month || String(now.getMonth() + 1).padStart(2, '0');
    const year = filters?.year || String(now.getFullYear());

    const query = new URLSearchParams({
      month,
      year,
    }).toString();

    // const response = await attendanceAPI.get(
    //   `/attendance/${employeeId}/history?${query}`
    // );
      
    return {
      success: true,
      data: dummyAttendanceData
    }; 
    // return response.data;

  } catch (error) {
    console.warn("API call failed, returning dummy data:", error);
    return {
         
      success: true,
      data: [],
    };  
    // return getDummyAttendanceHistory();
  }
};


export const attendanceService = {
  getAttendanceHistory,
};

