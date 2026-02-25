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
    checkOutTime: {
  type: Date,
},

workHours: {
  type: Number,
},
    status: {
      type: String,
      enum: ["present", "on_leave", "holiday"],
      // required: true,
        default: "present",
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = model<IAttendance>(
  "Attendance",
  attendanceSchema
);