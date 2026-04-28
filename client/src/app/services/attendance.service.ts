import api from "../lib/api";

export interface AttendanceSummary {
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  totalWorkHours: number;
  attendancePercentage: number;
}

export interface AttendanceRecord {
  _id?: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workHours: number | null;
  status: "present" | "absent" | "leave" | string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Get attendance summary for a specific month/year
 */
export const getAttendanceSummary = async (
  month: number,
  year: number
): Promise<AttendanceSummary> => {
  try {
    const response = await api.get<ApiResponse<AttendanceSummary>>(
      `/api/v1/attendance/summary?month=${month}&year=${year}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get own attendance records for a specific month/year
 */
export const getOwnAttendance = async (
  month: number,
  year: number
): Promise<AttendanceRecord[]> => {
  try {
    const response = await api.get<ApiResponse<AttendanceRecord[]>>(
      `/api/v1/attendance/me?month=${month}&year=${year}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get attendance records for a specific employee
 */
export const getEmployeeAttendance = async (
  employeeId: string,
  month?: number,
  year?: number
): Promise<AttendanceRecord[]> => {
  try {
    const params = new URLSearchParams();
    if (month) params.append("month", String(month));
    if (year) params.append("year", String(year));

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/attendance/${employeeId}?${queryString}`
      : `/api/v1/attendance/${employeeId}`;

    const response = await api.get<ApiResponse<AttendanceRecord[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Mark check-in
 */
export const checkIn = async (): Promise<AttendanceRecord> => {
  try {
    const response = await api.post<ApiResponse<AttendanceRecord>>(
      "/api/v1/attendance/check-in",
      {}
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Mark check-out
 */
export const checkOut = async (): Promise<AttendanceRecord> => {
  try {
    const response = await api.post<ApiResponse<AttendanceRecord>>(
      "/api/v1/attendance/check-out",
      {}
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get current day attendance status
 */
export const getTodayAttendance = async (): Promise<AttendanceRecord | null> => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const records = await getOwnAttendance(month, year);
    
    const today = new Date().toDateString();
    return records.find((item) => new Date(item.date).toDateString() === today) || null;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
