import { Schema, model } from "mongoose";
import { ILeaveBalance } from "./leaveBalance.interface";

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    leaveType: {
      type: String,
      enum: ["sick", "casual", "earned", "other"],
      required: true,
    },

    allocated: {
      type: Number,
      required: true,
      min: 0,
    },

    used: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Prevent duplicate leave balance for same employee + year + leaveType
leaveBalanceSchema.index(
  { employee: 1, year: 1, leaveType: 1 },
  { unique: true }
);

export const LeaveBalance = model<ILeaveBalance>(
  "LeaveBalance",
  leaveBalanceSchema
);
