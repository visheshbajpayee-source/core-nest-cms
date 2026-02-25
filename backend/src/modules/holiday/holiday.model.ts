import mongoose, { Schema, Model } from "mongoose";
import { IHoliday } from "./holiday.interface";

const holidaySchema: Schema<IHoliday> = new Schema(
  {
    holidayName: {
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
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


export const Holiday: Model<IHoliday> =
  mongoose.model<IHoliday>("Holiday", holidaySchema);