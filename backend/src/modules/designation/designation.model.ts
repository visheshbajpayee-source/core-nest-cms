import { Schema, model } from "mongoose";
import { IDesignation } from "./designation.interface";

const designationSchema = new Schema<IDesignation>(
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
  },
  {
    timestamps: true,
  }
);

export const Designation = model<IDesignation>(
  "Designation",
  designationSchema
);
