import { Document } from "mongoose";

export interface ILeaveAllocation {
  leaveType: string;
  daysPerYear: number;
}

export interface ISystemSettings extends Document {
  organizationName: string;
  organizationLogoUrl?: string;
  defaultLeaveAllocations: ILeaveAllocation[];
  standardWorkingHoursPerDay: number;
  standardCheckInTime: string;
  financialYearStart: Date;
  financialYearEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
