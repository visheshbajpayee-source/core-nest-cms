import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/i, "Invalid identifier format");

const projectStatusEnum = z.enum([
  "not_started",
  "in_progress",
  "completed",
  "on_hold",
]);

export const createProjectSchema = z
  .object({
    name: z.string().min(3, "Project name must be at least 3 characters"),
    description: z.string().max(2000).optional(),
    startDate: z.string(),
    expectedEndDate: z.string(),
    status: projectStatusEnum.optional(),
    department: objectIdSchema,
    teamMembers: z.array(objectIdSchema).optional(),
  })
  .refine((data) => !isNaN(Date.parse(data.startDate)), {
    message: "Invalid start date",
    path: ["startDate"],
  })
  .refine((data) => !isNaN(Date.parse(data.expectedEndDate)), {
    message: "Invalid expected end date",
    path: ["expectedEndDate"],
  })
  .refine((data) => Date.parse(data.expectedEndDate) >= Date.parse(data.startDate), {
    message: "Expected end date must be after start date",
    path: ["expectedEndDate"],
  });

export const updateProjectSchema = z
  .object({
    name: z.string().min(3).optional(),
    description: z.string().max(2000).optional(),
    startDate: z.string().optional(),
    expectedEndDate: z.string().optional(),
    status: projectStatusEnum.optional(),
    teamMembers: z.array(objectIdSchema).optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate && !data.expectedEndDate) return true;
      if (data.startDate && isNaN(Date.parse(data.startDate))) return false;
      if (data.expectedEndDate && isNaN(Date.parse(data.expectedEndDate))) return false;

      if (data.startDate && data.expectedEndDate) {
        return Date.parse(data.expectedEndDate) >= Date.parse(data.startDate);
      }

      return true;
    },
    {
      message: "Expected end date must be after start date",
      path: ["expectedEndDate"],
    }
  );
