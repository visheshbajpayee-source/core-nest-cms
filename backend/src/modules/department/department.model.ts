import mongoose, { Schema, Model } from "mongoose";
import { IDepartment } from "./department.interface";

const departmentSchema: Schema<IDepartment> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    departmentHead: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: false,
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

departmentSchema.index({ name: 1 }, { unique: true });

export const Department: Model<IDepartment> =
  mongoose.model<IDepartment>("Department", departmentSchema);