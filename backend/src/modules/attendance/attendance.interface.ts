import { Document, Types } from "mongoose";

export type AttendanceStatus = "present" | "on_leave" | "holiday";

export interface IAttendance extends Document {
  employee: Types.ObjectId;
  date: Date;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;     // When employee checked out (optional initially)
  workHours?: number | null;       // Total working hours for the day
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}
