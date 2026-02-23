import { Schema, model } from "mongoose";
import { IEmployee } from "./employee.interface";

const employeeSchema = new Schema<IEmployee>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 never return password by default
    },

    phoneNumber: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    designation: {
      type: Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },

    dateOfJoining: {
      type: Date,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = model<IEmployee>(
  "Employee",
  employeeSchema
);