export type AttendanceStatus = "present" | "absent" | "on_leave" | "holiday";

export interface AttendanceRecord {
  _id: string;
  employee: { fullName: string; email: string; employeeId: string };
  date: string;
  checkInTime?: string;
  status: AttendanceStatus;
}

export interface AttendanceCorrectionPayload {
  employee: string;
  date: string;
  status: AttendanceStatus;
  checkInTime: string;
}
