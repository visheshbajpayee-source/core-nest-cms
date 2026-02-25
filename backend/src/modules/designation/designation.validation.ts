import { z } from "zod";

export const createDesignationSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),

  description: z
    .string()
    .max(255, "Description too long")
    .optional(),
});

export const updateDesignationSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(100)
    .trim()
    .optional(),

  description: z
    .string()
    .max(255)
    .optional(),

  isActive: z.boolean().optional(),
});