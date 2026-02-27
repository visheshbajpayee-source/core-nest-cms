import { Schema, model } from "mongoose";
import { ILeaveAllocation, ISystemSettings } from "./settings.interface";

const leaveAllocationSchema = new Schema<ILeaveAllocation>(
  {
    leaveType: { type: String, required: true, trim: true },
    daysPerYear: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    organizationName: { type: String, required: true, trim: true },
    organizationLogoUrl: { type: String, trim: true },
    defaultLeaveAllocations: {
      type: [leaveAllocationSchema],
      default: [],
    },
    standardWorkingHoursPerDay: { type: Number, required: true, default: 8 },
    standardCheckInTime: { type: String, required: true, default: "09:30" },
    financialYearStart: { type: Date, required: true },
    financialYearEnd: { type: Date, required: true },
  },
  { timestamps: true }
);

// Single document collection (optional unique index)
systemSettingsSchema.index({}, { unique: true });

export const SystemSettings = model<ISystemSettings>(
  "SystemSettings",
  systemSettingsSchema
);
