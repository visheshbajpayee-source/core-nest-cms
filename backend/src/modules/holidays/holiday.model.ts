import { Schema, model } from "mongoose";
import { IHoliday } from "./holiday.interface";

const holidaySchema = new Schema<IHoliday>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["national", "regional", "company"],
      required: true,
      default: "company",
    },
  },
  { timestamps: true }
);

holidaySchema.index({ date: 1 });

export const Holiday = model<IHoliday>("Holiday", holidaySchema);
