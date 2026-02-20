import { Document, Types } from "mongoose";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "on_leave"
  | "holiday";

export interface IAttendance extends Document {
  employee: Types.ObjectId;
  date: Date;
  checkInTime?: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}
