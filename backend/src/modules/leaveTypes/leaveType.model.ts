import { Schema, model, Document } from "mongoose";

export interface ILeaveType extends Document {
  name: string;
  code: string;
  maxDaysPerYear: number;
  isActive: boolean;
}

const leaveTypeSchema = new Schema<ILeaveType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    maxDaysPerYear: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const LeaveType = model<ILeaveType>(
  "LeaveType",
  leaveTypeSchema
);