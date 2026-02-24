import { Attendance } from "./attendance.model";
import { Types } from "mongoose";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";

// normalize date to start of day
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Automatically mark attendance (called during login)
 */
export const markAttendance = async (employeeId: string) => {
  try {
    const today = normalizeDate(new Date());
  
    const existing = await Attendance.findOne({
      employee: new Types.ObjectId(employeeId),
      date: today,
    });
  
    if (existing) return existing;
  
    return await Attendance.create({
      employee: employeeId,
      date: today,
      checkInTime: new Date(),
      status: "present",// enum
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw new Error("Failed to mark attendance");   
  }
};

/**
 * Get attendance of logged-in employee
 */
export const getMyAttendance = async (
  employeeId: string,
  month?: number,
  year?: number
) => {
  const query: any = { employee: employeeId };

  if (month !== undefined && year !== undefined) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    query.date = {
      $gte: start,
      $lte: end,
    };
  }

  return await Attendance.find(query).sort({ date: 1 });
};

/**
 * Get attendance (Admin / Manager)
 */
export const getAllAttendance = async (filters: any) => {
  const query: any = {};

  if (filters.department) {
    query.department = filters.department;
  }

  return await Attendance.find(query)
    .populate("employee", "fullName email department")
    .sort({ date: -1 });
};

/**
 * Admin correction
 */
export const updateAttendanceStatus = async (
  id: string,
  status: "present" | "on_leave" | "holiday"
) => {
  const updated = await Attendance.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);

  return updated;
};