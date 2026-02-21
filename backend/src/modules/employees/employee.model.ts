import { Schema, model } from "mongoose";
import { IEmployee } from "./employee.interface";
import bcrypt from "bcrypt";

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

/**
 * 🔐 Hash password before saving
 */
employeeSchema.pre("save", async function () {
  const employee = this as any;

  if (!employee.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);
});

export const Employee = model<IEmployee>(
  "Employee",
  employeeSchema
);