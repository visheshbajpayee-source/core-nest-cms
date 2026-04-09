import { Schema, model } from "mongoose";
import { IAnnouncement } from "./announcement.interface";

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    target: {
      type: String,
      enum: ["all", "department"],
      required: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },

    priority: {
      type: String,
      enum: ["normal", "important", "urgent"],
      default: "normal",
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
announcementSchema.index({ target: 1 });
announcementSchema.index({ department: 1 });
announcementSchema.index({ expiryDate: 1 });

export const Announcement = model<IAnnouncement>(
  "Announcement",
  announcementSchema
);
