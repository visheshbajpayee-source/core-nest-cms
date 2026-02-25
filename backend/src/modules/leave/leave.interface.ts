import { Document, Types } from "mongoose";

export type LeaveType =
  | "sick"
  | "casual"
  | "earned"
  | "other";

export type LeaveStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface ILeave extends Document {
  employee: Types.ObjectId;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
