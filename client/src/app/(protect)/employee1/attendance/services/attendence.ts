import axios from "axios";

// Types for Attendance

export interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: string | null;
  employee?: string;
  status: "Active" | "Present" | "Absent" | "Late";
}

// API Response interface
interface AttendanceApiRecord {
  employee: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workHours: number | null;
  status?: string;
}

export interface AttendanceHistoryResponse {
  success: boolean;
  data: AttendanceRecord[];
}

export interface AttendanceSummary {
  presentDays: number;
  absentDays: number;
  lateArrivals?: number;
  totalWorkHours: number;
  attendancePercentage: number;
  workingDays: number;
  month: number;
  year: number;
  currentStatus?: 'Present' | 'Absent' | 'Active';
  todayCheckIn?: string | null;
  todayCheckOut?: string | null;
  todayWorkHours?: number;
}

export interface AttendanceSummaryResponse {
  success: boolean;
  data: AttendanceSummary;
}

export interface AttendanceFilters {
  month?: string; // e.g. '11'
  year?: string; // e.g. '2024'
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Helper function to format date
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to determine status
const determineStatus = (
  checkIn: string | null,
  checkOut: string | null,
  apiStatus?: string
): "Present" | "Absent" | "Late" | "Active" => {
  // Use API status if it's valid
  if (apiStatus) {
    const normalizedStatus = apiStatus.toLowerCase();
    if (normalizedStatus === 'present') return 'Present';
    if (normalizedStatus === 'absent') return 'Absent';
    if (normalizedStatus === 'late') return 'Late';
    if (normalizedStatus === 'active') return 'Active';
  }
  
  // Fallback logic
  if (!checkIn) return "Absent";
  if (!checkOut) return "Active"; // Still checked in
  
  // Check if late (after 9:30 AM)
  const checkInDate = new Date(checkIn);
  const checkInHour = checkInDate.getHours();
  const checkInMinute = checkInDate.getMinutes();
  
  if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
    return "Late";
  }
  
  return "Present";
};

// Helper function to format time
const formatTime = (isoTime: string | null): string | null => {
  if (!isoTime) return null;
  const date = new Date(isoTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper function to format work hours
const formatWorkHours = (hours: number | null): string | null => {
  if (hours === null || hours === undefined) return null;
  
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// Transform API data to component format
const transformAttendanceRecord = (apiRecord: AttendanceApiRecord): AttendanceRecord => {
  return {
    employee: apiRecord.employee,
    date: formatDate(apiRecord.date),
    checkIn: formatTime(apiRecord.checkInTime),
    checkOut: formatTime(apiRecord.checkOutTime),
    workHours: formatWorkHours(apiRecord.workHours),
    status: determineStatus(apiRecord.checkInTime, apiRecord.checkOutTime, apiRecord.status),
  };
};


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
  filters?: AttendanceFilters
): Promise<AttendanceHistoryResponse> => {
  try {
    const now = new Date();

    const month =
      filters?.month || String(now.getMonth() + 1).padStart(2, "0");
    const year =
      filters?.year || String(now.getFullYear());

    const query = new URLSearchParams({
      month,
      year,
    }).toString();

    const response = await attendanceAPI.get<{
      success: boolean;
      data: AttendanceApiRecord[];
    }>(`/attendance/me?${query}`);

    console.log("Raw API response:", response.data);

    // Transform the data
    const transformedData = response.data.data.map(transformAttendanceRecord);
    console.log("Transformed data:", transformedData);

    return {
      success: response.data.success,
      data: transformedData,
    };
  } catch (error) {
    console.warn("History API failed:", error);

    return {
      success: true,
      data: [],
    };
  }
};
export const getAttendanceSummary = async (): Promise<AttendanceSummaryResponse> => {
  try {
    const response = await attendanceAPI.get<{
      success: boolean;
      data: AttendanceSummary;
    }>(`/attendance/summary`);

    console.log("API response for attendance summary:", response.data);

    return {
      success: response.data.success,
      data: response.data.data,
    };
   
  } catch (error) {
    console.warn("Summary API failed:", error);
    
    return {
      success: false,
      data: {
        presentDays: 0,
        absentDays: 0,
        totalWorkHours: 0,
        attendancePercentage: 0,
        workingDays: 0,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    };
  }
};

// Legacy function for backward compatibility
export const getAttendanceRecord = getAttendanceSummary;





export const attendanceService = {
  getAttendanceHistory,
  getAttendanceRecord,
  getAttendanceSummary
};

