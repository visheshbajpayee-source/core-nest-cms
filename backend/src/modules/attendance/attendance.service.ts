
import { Attendance } from "./attendance.model";
import { Types } from "mongoose";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";
import { normalizeDate } from "./attendance.utils"; 

// markAttendance function removed. Attendance is now only marked on explicit check-in.


/*
  * This function allows employees to checkout.         
 * - Updates checkOutTime
 * - Calculates workHours
 * - Prevents multiple checkouts
 */
export const checkoutAttendance = async (employeeId: string) => {
  const today = normalizeDate(new Date());

  // Find today's attendance
  const attendance = await Attendance.findOne({
    employee: employeeId,
    date: today,
  });

  if (!attendance) {
    throw ApiError.notFound("No attendance found for today");
  }

  // Prevent multiple checkouts
  if (attendance.checkOutTime) {
    return formatAttendance(attendance);
  }

  if (!attendance.checkInTime) {
    throw ApiError.badRequest("Check-in time not found");
  }

  const now = new Date();

  // Calculate time difference in hours
  const diffMs = now.getTime() - attendance.checkInTime.getTime();
  const hours = diffMs / (1000 * 60 * 60);

  // Update checkout fields
  attendance.checkOutTime = now;
  attendance.workHours = Number(hours.toFixed(2));

  await attendance.save();

  return formatAttendance(attendance);
};


/*
 * - Supports optional month & year filtering
 * - Returns formatted records
 */
export const getMyAttendance = async (
  employeeId: string,
  month?: number,
  year?: number
) => {
  const query: any = { employee: employeeId };

  // Apply month/year filter if provided
  if (month !== undefined && year !== undefined) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    query.date = {
      $gte: start,
      $lt: end,
    };
  }

  const records = await Attendance.find(query).sort({ date: 1 });

  // Format response before sending
  return records.map(formatAttendance);
};


/*
 * - Populates employee basic info
 */
export const getAllAttendance = async (query: unknown) => {
  const records = await Attendance.find({})
    .populate("employee", "fullName email department")
    .sort({ date: -1 });

  return records;
};


/*
 * - Allows admin to manually change attendance status
 */
/*
 * - Allows admin to manually change attendance status
 * - Applies business rules
 *   → If on_leave or holiday → clear time tracking
 */
export const updateAttendanceStatus = async (
  id: string,
  status: "present" | "on_leave" | "holiday"
) => {
  // First fetch the attendance record
  const attendance = await Attendance.findById(id);

  if (!attendance) {
    throw ApiError.notFound("Attendance record not found");
  }

  // Business Rule:
  // If marking leave or holiday → clear timing fields
  if (status === "on_leave" || status === "holiday") {
    attendance.status = status;
    attendance.checkInTime = null;
    attendance.checkOutTime = null;
    attendance.workHours = null;
  } else {
    // If marking present → thenonly update status
    attendance.status = status;
  }

  await attendance.save();

  return formatAttendance(attendance);
};
/*
 * - Sends clean structured response
 */
const formatAttendance = (record: any) => {
  return {
    employee: record.employee,
    date: record.date,
    checkInTime: record.checkInTime,
    checkOutTime: record.checkOutTime || null,
    workHours: record.workHours ?? null,
    status: record.status,
  };
};