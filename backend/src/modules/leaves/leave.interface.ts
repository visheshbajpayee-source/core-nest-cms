import { Types } from "mongoose";

/**
 * Leave Status Types
 */
export type LeaveStatus = "pending" | "approved" | "rejected";

/**
 * Leave Document Interface (used in model)
 */
export interface ILeave {
  employee: Types.ObjectId;
  leaveType: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Apply Leave Input (Service Layer Type)
 */
export interface IApplyLeaveInput {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}