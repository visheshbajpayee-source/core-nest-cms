import { Leave } from "./leave.model";
import { LeaveType } from "../leaveTypes/leaveType.model";
import { ApiError } from "../../common/utils/ApiError";
import { Types } from "mongoose";
import { IApplyLeaveInput } from "./leave.interface";
import { Attendance } from "../attendance/attendance.model";
import { normalizeDate } from "../attendance/attendance.utils";
/**
 * Apply Leave
 */
export const applyLeave = async (
  employeeId: string,
  data: IApplyLeaveInput
) => {
  const leaveType = await LeaveType.findById(data.leaveType);

  if (!leaveType || !leaveType.isActive) {
    throw ApiError.badRequest("Invalid leave type");
  }

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (start > end) {
    throw ApiError.badRequest("Start date must be before end date");
  }

  let totalDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      totalDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  if (totalDays === 0) {
    throw ApiError.badRequest("No working days selected");
  }

  const overlapping = await Leave.findOne({
    employee: employeeId,
    status: { $ne: "rejected" },
    $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
  });

  if (overlapping) {
    throw ApiError.conflict("Overlapping leave request exists");
  }

  return await Leave.create({
    employee: new Types.ObjectId(employeeId),
    leaveType: leaveType._id,
    startDate: start,
    endDate: end,
    totalDays,
    reason: data.reason,
  });
};


/*
 * Approve or Reject Leave
 */
export const updateLeaveStatus = async (
  leaveId: string,
  status: "approved" | "rejected",
  approverId: string
) => {
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw ApiError.notFound("Leave not found");
  }

  if (leave.status !== "pending") {
    throw ApiError.badRequest("Leave already processed");
  }

  leave.status = status;
  leave.approvedBy = new Types.ObjectId(approverId);
  leave.approvedAt = new Date();

  await leave.save();

  //  If approved then create attendance records
  if (status === "approved") {
    let current = new Date(leave.startDate);

    while (current <= leave.endDate) {
      const day = current.getDay();

      // Skip weekends
      if (day !== 0 && day !== 6) {
        const normalized = normalizeDate(current);

        // Check if attendance already exists
        const existing = await Attendance.findOne({
          employee: leave.employee,
          date: normalized,
        });

        if (!existing) {
          await Attendance.create({
            employee: leave.employee,
            date: normalized,
            status: "on_leave",
          });
        }
      }

      current.setDate(current.getDate() + 1);
    }
  }

  return leave;
};