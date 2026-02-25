import mongoose, { Schema, Model } from "mongoose";
import { IDesignation } from "./designation.interface";

const designationSchema: Schema<IDesignation> = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: index explicitly (clean practice)
designationSchema.index({ title: 1 }, { unique: true });

export const Designation: Model<IDesignation> =
  mongoose.model<IDesignation>("Designation", designationSchema);