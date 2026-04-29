// Employee & HR Services Index
export * from "./employee.service";
export * from "./attendance.service";
export * from "./leaves.service";
export * from "./admin-leaves.service";
export * from "./tasks.service";
export * from "./worklogs.service";
export * from "./announcements.service";
export * from "./holidays.service";
export * from "./auth.service";

// Re-export commonly used types for convenience
export type {
  EmployeeProfile,
  UpdateEmployeePayload,
  CreateEmployeePayload,
  EmployeeListFilters,
} from "./employee.service";

export type {
  AttendanceSummary,
  AttendanceRecord,
} from "./attendance.service";

export type {
  LeaveType,
  LeaveRequest,
  LeaveBalance,
} from "./leaves.service";

export type {
  Task,
} from "./tasks.service";

export type {
  Worklog,
} from "./worklogs.service";

export type {
  Announcement,
} from "./announcements.service";

export type {
  Holiday,
} from "./holidays.service";
