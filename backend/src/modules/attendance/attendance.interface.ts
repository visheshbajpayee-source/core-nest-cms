import { Document, Types } from "mongoose";

export type AttendanceStatus = "present" | "on_leave" | "holiday";

export interface IAttendance extends Document {
  employee: Types.ObjectId;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;      // When employee checked out (optional initially)
  workHours?: number;       // Total working hours for the day
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}