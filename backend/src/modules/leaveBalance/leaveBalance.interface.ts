import { Document, Types } from "mongoose";

export type LeaveBalanceType =
  | "sick"
  | "casual"
  | "earned"
  | "other";

export interface ILeaveBalance extends Document {
  employee: Types.ObjectId;
  year: number;
  leaveType: LeaveBalanceType;
  allocated: number;
  used: number;
  createdAt: Date;
  updatedAt: Date;
}
