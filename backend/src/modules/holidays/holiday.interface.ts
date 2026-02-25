import { Document } from "mongoose";

export type HolidayType =
  | "national"
  | "regional"
  | "company";

export interface IHoliday extends Document {
  name: string;
  date: Date;
  description?: string;
  type: HolidayType;
  createdAt: Date;
  updatedAt: Date;
}
