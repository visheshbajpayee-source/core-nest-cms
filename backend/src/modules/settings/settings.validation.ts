import { z } from "zod";

const leaveAllocationSchema = z.object({
  leaveType: z.string().min(1, "Leave type is required"),
  daysPerYear: z
    .number()
    .int("Days per year must be an integer")
    .min(0, "Days per year cannot be negative"),
});

export const updateSystemSettingsSchema = z.object({
  organizationName: z.string().min(1).optional(),
  organizationLogoUrl: z.string().url().optional(),
  defaultLeaveAllocations: z.array(leaveAllocationSchema).optional(),
  standardWorkingHoursPerDay: z
    .number()
    .min(1, "Working hours must be at least 1")
    .max(24, "Working hours cannot exceed 24")
    .optional(),
  standardCheckInTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/i, "Check-in time must be in HH:MM format")
    .optional(),
  financialYearStart: z.string().optional(),
  financialYearEnd: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
});

export const updateProfilePictureSchema = z.object({
  profilePicture: z.string().min(1, "Profile picture is required"),
});

export const updateNotificationPreferencesSchema = z.object({
  emailAnnouncements: z.boolean().optional(),
  emailTaskUpdates: z.boolean().optional(),
  emailLeaveUpdates: z.boolean().optional(),
});
