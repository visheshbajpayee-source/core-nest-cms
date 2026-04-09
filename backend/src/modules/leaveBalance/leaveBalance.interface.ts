import { Document, Types } from "mongoose";

export interface ILeaveBalance extends Document {
  employee: Types.ObjectId;
  year: number;
  leaveType: Types.ObjectId; 
  allocated: number;
  used: number;
  createdAt: Date;
  updatedAt: Date;
}