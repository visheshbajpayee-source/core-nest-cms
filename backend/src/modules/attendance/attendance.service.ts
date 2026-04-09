
import { Attendance } from "./attendance.model";
import { Types } from "mongoose";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";
import { normalizeDate } from "./attendance.utils"; 
import { Employee } from "../employees/employee.model";

const resolveEmployeeObjectId = async (employeeInput: string): Promise<string> => {
  const raw = (employeeInput || "").trim();

  if (Types.ObjectId.isValid(raw)) {
    const exists = await Employee.findById(raw).select("_id");
    if (!exists) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
    return raw;
  }

  const employeeId = /^emp\d+$/i.test(raw) ? raw.toUpperCase() : raw;
  const employee = await Employee.findOne({ employeeId }).select("_id");
  if (!employee) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
  return employee._id.toString();
};

/*
 * This function runs automatically during login.
 * - It prevents duplicate attendance marking.
 * - It creates a new attendance record if not already present.
 */
export const markAttendance = async (employeeId: string) => {
  try {
    // Normalize today to 00:00:00 (start of day)
    const today = normalizeDate(new Date());

    // Check if attendance already exists for today
    const existing = await Attendance.findOne({
      employee: new Types.ObjectId(employeeId),
      date: today,
    });

    // If already marked → return existing record
    if (existing) return formatAttendance(existing);

    // Create new attendance record (check-in)
    const newAttendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkInTime: new Date(),
      status: "present",
    });

    return formatAttendance(newAttendance);
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw ApiError.internalServer("Failed to mark attendance");
  }
};


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
    .populate("employee", "fullName email employeeId department")
    .sort({ date: -1 });

  return records;
};

export const createOrCorrectAttendance = async (payload: {
  employee: string;
  date: Date;
  status: "present" | "absent" | "on_leave" | "holiday";
  checkInTime?: Date;
}) => {
  const normalizedDate = normalizeDate(payload.date);
  const employeeObjectId = await resolveEmployeeObjectId(payload.employee);

  const existing = await Attendance.findOne({
    employee: employeeObjectId,
    date: normalizedDate,
  });

  if (existing) {
    existing.status = payload.status;

    if (payload.status === "present") {
      existing.checkInTime = payload.checkInTime ?? existing.checkInTime ?? null;
    } else {
      existing.checkInTime = null;
      existing.checkOutTime = null;
      existing.workHours = null;
    }

    await existing.save();
    return formatAttendance(existing);
  }

  const created = await Attendance.create({
    employee: employeeObjectId,
    date: normalizedDate,
    status: payload.status,
    checkInTime: payload.status === "present" ? payload.checkInTime ?? null : null,
    checkOutTime: null,
    workHours: null,
  });

  return formatAttendance(created);
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
  status: "present" | "absent" | "on_leave" | "holiday"
) => {
  // First fetch the attendance record
  const attendance = await Attendance.findById(id);

  if (!attendance) {
    throw ApiError.notFound("Attendance record not found");
  }

  // Business Rule:
  // If marking absent/leave/holiday → clear timing fields
  if (status === "absent" || status === "on_leave" || status === "holiday") {
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
