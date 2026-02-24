import { Schema, model } from "mongoose";
import { IEmployee } from "./employee.interface";
import bcrypt from "bcrypt";

const employeeSchema = new Schema<IEmployee>(
  {
    fullName: { type: String, required: true, trim: true },

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
      select: false,
    },

    phoneNumber: { type: String },

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

    dateOfJoining: { type: Date, required: true },

    employeeId: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    profilePicture: { type: String },
  },
  { timestamps: true }
);

/**
 * 🔐 Hash password before saving
 */
employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 🆔 Auto generate employeeId
 */
employeeSchema.pre("save", async function () {
  if (!this.employeeId) {
    const count = await Employee.countDocuments();
    this.employeeId = `EMP${(count + 1)
      .toString()
      .padStart(3, "0")}`;
  }
});

export const Employee = model<IEmployee>("Employee", employeeSchema);
