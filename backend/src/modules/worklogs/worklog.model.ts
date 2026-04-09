import { Schema, model } from "mongoose";
import { IWorkLog } from "./worklog.interface";

const workLogSchema = new Schema<IWorkLog>(
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

    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },

    taskDescription: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },

    hoursSpent: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["in_progress", "completed", "blocked"],
      default: "in_progress",
    },
  },
  {
    timestamps: true,
  }
);

export const WorkLog = model<IWorkLog>(
  "WorkLog",
  workLogSchema
);
