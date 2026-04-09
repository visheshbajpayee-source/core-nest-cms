import { z } from "zod";
import mongoose from "mongoose";

/**
 * Helper to validate ObjectId
 */
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim(),

  description: z
    .string()
    .max(255, "Description too long")
    .optional(),

  departmentHead: objectIdSchema.optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  description: z.string().max(255).optional(),
  departmentHead: objectIdSchema.optional(),
  isActive: z.boolean().optional(),
});