import { Document, Types } from "mongoose";

export type UserRole = "admin" | "manager" | "employee";
export type UserStatus = "active" | "inactive";

export interface NotificationPreferences {
  emailAnnouncements: boolean;
  emailTaskUpdates: boolean;
  emailLeaveUpdates: boolean;
}

export interface IEmployee extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
  department: Types.ObjectId;
  designation: Types.ObjectId;
  dateOfJoining: Date;
  employeeId: string;
  status: UserStatus;
  profilePicture?: string;
  notificationPreferences?: NotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}