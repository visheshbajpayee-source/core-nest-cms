import { SystemSettings } from "./settings.model";
import {
  ChangePasswordDto,
  NotificationPreferencesDto,
  SystemSettingsResponseDto,
  UpdateNotificationPreferencesDto,
  UpdateSystemSettingsDto,
  UserSettingsResponseDto,
} from "./settings.dto";
import { ApiError } from "../../common/utils/ApiError";
import { Employee } from "../employees/employee.model";

const toSystemSettingsResponse = (s: any): SystemSettingsResponseDto => ({
  id: s._id.toString(),
  organizationName: s.organizationName,
  organizationLogoUrl: s.organizationLogoUrl,
  defaultLeaveAllocations: s.defaultLeaveAllocations ?? [],
  standardWorkingHoursPerDay: s.standardWorkingHoursPerDay,
  standardCheckInTime: s.standardCheckInTime,
  financialYearStart: s.financialYearStart.toISOString(),
  financialYearEnd: s.financialYearEnd.toISOString(),
  createdAt: s.createdAt.toISOString(),
  updatedAt: s.updatedAt.toISOString(),
});

export const getSystemSettings = async (): Promise<SystemSettingsResponseDto> => {
  let settings = await SystemSettings.findOne();

  if (!settings) {
    const now = new Date();
    const fiscalStart = new Date(now.getFullYear(), 3, 1); // Apr 1
    const fiscalEnd = new Date(now.getFullYear() + 1, 2, 31); // Mar 31

    settings = await SystemSettings.create({
      organizationName: "Your Organization",
      organizationLogoUrl: undefined,
      defaultLeaveAllocations: [],
      standardWorkingHoursPerDay: 8,
      standardCheckInTime: "09:30",
      financialYearStart: fiscalStart,
      financialYearEnd: fiscalEnd,
    });
  }

  return toSystemSettingsResponse(settings);
};

export const updateSystemSettings = async (
  payload: UpdateSystemSettingsDto
): Promise<SystemSettingsResponseDto> => {
  const update: any = { ...payload };

  if (payload.financialYearStart) {
    const d = new Date(payload.financialYearStart);
    if (isNaN(d.getTime())) {
      throw ApiError.badRequest("Invalid financialYearStart date");
    }
    update.financialYearStart = d;
  }

  if (payload.financialYearEnd) {
    const d = new Date(payload.financialYearEnd);
    if (isNaN(d.getTime())) {
      throw ApiError.badRequest("Invalid financialYearEnd date");
    }
    update.financialYearEnd = d;
  }

  const settings = await SystemSettings.findOneAndUpdate(
    {},
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (!settings) {
    throw ApiError.internalServer("Failed to update system settings");
  }

  return toSystemSettingsResponse(settings);
};

const buildDefaultNotificationPreferences = (
  prefs?: Partial<NotificationPreferencesDto>
): NotificationPreferencesDto => ({
  emailAnnouncements: prefs?.emailAnnouncements ?? true,
  emailTaskUpdates: prefs?.emailTaskUpdates ?? true,
  emailLeaveUpdates: prefs?.emailLeaveUpdates ?? true,
});

const toUserSettingsResponse = (emp: any): UserSettingsResponseDto => ({
  id: emp._id.toString(),
  fullName: emp.fullName,
  email: emp.email,
  profilePicture: emp.profilePicture,
  notificationPreferences: buildDefaultNotificationPreferences(
    emp.notificationPreferences || {}
  ),
});

export const getUserSettings = async (
  userId: string
): Promise<UserSettingsResponseDto> => {
  const emp = await Employee.findById(userId).select(
    "fullName email profilePicture notificationPreferences"
  );

  if (!emp) {
    throw ApiError.notFound("Employee not found");
  }

  return toUserSettingsResponse(emp);
};

export const changePassword = async (
  userId: string,
  payload: ChangePasswordDto
): Promise<void> => {
  const updated = await Employee.findOneAndUpdate(
    { _id: userId, password: payload.currentPassword },
    { password: payload.newPassword },
    { new: true }
  );

  if (!updated) {
    throw ApiError.badRequest("Current password is incorrect");
  }
};

export const updateProfilePicture = async (
  userId: string,
  profilePicture: string
): Promise<UserSettingsResponseDto> => {
  const emp = await Employee.findByIdAndUpdate(
    userId,
    { profilePicture },
    { returnDocument: "after" }
  ).select("fullName email profilePicture notificationPreferences");

  if (!emp) {
    throw ApiError.notFound("Employee not found");
  }

  return toUserSettingsResponse(emp);
};

export const updateNotificationPreferences = async (
  userId: string,
  payload: UpdateNotificationPreferencesDto
): Promise<UserSettingsResponseDto> => {
  const emp = await Employee.findById(userId).select(
    "fullName email profilePicture notificationPreferences"
  );

  if (!emp) {
    throw ApiError.notFound("Employee not found");
  }

  const current = buildDefaultNotificationPreferences(
    (emp as any).notificationPreferences || {}
  );

  const nextPrefs: NotificationPreferencesDto = {
    emailAnnouncements:
      payload.emailAnnouncements ?? current.emailAnnouncements,
    emailTaskUpdates: payload.emailTaskUpdates ?? current.emailTaskUpdates,
    emailLeaveUpdates: payload.emailLeaveUpdates ?? current.emailLeaveUpdates,
  };

  (emp as any).notificationPreferences = nextPrefs;
  await emp.save();

  return toUserSettingsResponse(emp);
};
