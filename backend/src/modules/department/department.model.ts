import { Schema, model } from "mongoose";
import { IDepartment } from "./department.interface";

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    head: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

export const Department = model<IDepartment>(
  "Department",
  departmentSchema
);
