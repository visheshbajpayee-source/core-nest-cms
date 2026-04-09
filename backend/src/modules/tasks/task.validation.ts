import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/i, "Invalid identifier format");

const taskPriorityEnum = z.enum(["low", "medium", "high", "critical"]);
const taskStatusEnum = z.enum(["todo", "in_progress", "in_review", "done"]);

export const createTaskSchema = z
  .object({
    title: z.string().min(3, "Task title must be at least 3 characters"),
    description: z.string().max(1000).optional(),
    project: objectIdSchema,
    assignedTo: z.array(objectIdSchema).optional(),
    priority: taskPriorityEnum.optional(),
    status: taskStatusEnum.optional(),
    dueDate: z.string(),
  })
  .refine((data) => !isNaN(Date.parse(data.dueDate)), {
    message: "Invalid due date",
    path: ["dueDate"],
  });

export const updateTaskSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().max(1000).optional(),
    assignedTo: z.array(objectIdSchema).optional(),
    priority: taskPriorityEnum.optional(),
    status: taskStatusEnum.optional(),
    dueDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.dueDate) return true;
      return !isNaN(Date.parse(data.dueDate));
    },
    {
      message: "Invalid due date",
      path: ["dueDate"],
    }
  );