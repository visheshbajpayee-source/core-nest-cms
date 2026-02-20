import { Schema, model } from "mongoose";
import { IAttendance } from "./attendance.interface";

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    checkInTime: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["present", "absent", "on_leave", "holiday"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Ensure one attendance per employee per date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = model<IAttendance>(
  "Attendance",
  attendanceSchema
);
