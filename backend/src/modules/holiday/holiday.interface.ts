import { Document } from "mongoose";

export type HolidayType = "national" | "regional" | "company";

export interface IHoliday extends Document {
  holidayName: string;
  date: Date;
  description?: string;
  type: HolidayType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}