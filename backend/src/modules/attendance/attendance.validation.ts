import { z } from "zod";

/*
 * Allowed attendance statuses
 */
export const attendanceStatusEnum = z.enum([
  "present",
  "on_leave",
  "holiday",
]);

/*
 * Update attendance validation (Admin only)
 */
export const updateAttendanceSchema = z.object({
  status: attendanceStatusEnum,
});
export const addAttendanceSchema = z.object({
  employeeId: z.string().optional(),
  date: z.date().optional(),
});
export type AddAttendance = z.infer<typeof addAttendanceSchema>; 