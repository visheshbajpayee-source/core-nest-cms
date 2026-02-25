import { Schema, model } from "mongoose";
import { IProject } from "./project.interface";

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expectedEndDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "on_hold"],
      default: "not_started",
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Helpful index for department-based queries
projectSchema.index({ department: 1 });

export const Project = model<IProject>(
  "Project",
  projectSchema
);
