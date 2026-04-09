export interface LeaveAllocationDto {
  leaveType: string;
  daysPerYear: number;
}

export interface UpdateSystemSettingsDto {
  organizationName?: string;
  organizationLogoUrl?: string;
  defaultLeaveAllocations?: LeaveAllocationDto[];
  standardWorkingHoursPerDay?: number;
  standardCheckInTime?: string;
  financialYearStart?: string;
  financialYearEnd?: string;
}

export interface SystemSettingsResponseDto {
  id: string;
  organizationName: string;
  organizationLogoUrl?: string;
  defaultLeaveAllocations: LeaveAllocationDto[];
  standardWorkingHoursPerDay: number;
  standardCheckInTime: string;
  financialYearStart: string;
  financialYearEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferencesDto {
  emailAnnouncements: boolean;
  emailTaskUpdates: boolean;
  emailLeaveUpdates: boolean;
}

export interface UserSettingsResponseDto {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  notificationPreferences: NotificationPreferencesDto;
}

export interface UpdateNotificationPreferencesDto {
  emailAnnouncements?: boolean;
  emailTaskUpdates?: boolean;
  emailLeaveUpdates?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
