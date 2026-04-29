import { dummyAttendanceData } from "./data";

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
  month?: string;
  year?: string;
}

/**
 * Fetch attendance history for an employee.
 * Currently returns dummy data; the live API is wired in
 * src/app/(protect)/employee1/attendance/services/attendence.ts.
 */
export const getAttendanceHistory = async (
  _employeeId: string,
  _filters?: AttendanceFilters
): Promise<AttendanceHistoryResponse> => {
  return {
    success: true,
    data: dummyAttendanceData,
  };
};

export const attendanceService = {
  getAttendanceHistory,
};
