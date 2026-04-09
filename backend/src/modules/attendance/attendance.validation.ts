import { z } from "zod";

/*
 * Allowed attendance statuses
 */
export const attendanceStatusEnum = z.enum([
  "present",
  "absent",
  "on_leave",
  "holiday",
]);

/*
 * Update attendance validation (Admin only)
 */
export const updateAttendanceSchema = z.object({
  status: attendanceStatusEnum,
});

export const manualAttendanceSchema = z.object({
  employee: z
    .string()
    .trim()
    .regex(/^(?:[a-fA-F0-9]{24}|EMP\d+)$/i, "Enter valid Employee ID (EMP###) or Mongo ObjectId"),
  date: z.coerce.date(),
  status: attendanceStatusEnum,
  checkInTime: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.date().optional()
  ),
});

export type ManualAttendancePayload = z.infer<typeof manualAttendanceSchema>;