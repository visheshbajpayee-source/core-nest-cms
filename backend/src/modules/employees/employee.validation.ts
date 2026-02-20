import { z } from "zod";
import { RoleEnum } from "../../common/constants/roles";

export const createEmployeeSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),

  phoneNumber: z.string().optional(),

  role: z.enum(Object.values(RoleEnum)),

  department: z.string(),

  designation: z.string(),

  dateOfJoining: z.string(), // frontend sends string
});

export type IcreateEmployeeDto = z.infer<typeof createEmployeeSchema>;