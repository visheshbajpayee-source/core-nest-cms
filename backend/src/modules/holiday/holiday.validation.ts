import { z } from "zod";

export const createHolidaySchema = z.object({
  holidayName: z
    .string()
    .min(2, "Holiday name must be at least 2 characters")
    .max(100, "Holiday name too long")
    .trim(),

  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  description: z
    .string()
    .max(255, "Description too long")
    .optional(),

  type: z.enum(["national", "regional", "company"]),
});

export const updateHolidaySchema = z.object({
  holidayName: z.string().min(2).max(100).trim().optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
  description: z.string().max(255).optional(),
  type: z.enum(["national", "regional", "company"]).optional(),
  isActive: z.boolean().optional(),
});