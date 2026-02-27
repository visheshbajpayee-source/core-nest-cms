import { Leave } from "./leave.model";
import { LeaveType } from "../leaveTypes/leaveType.model";
import { LeaveBalance } from "../leaveBalance/leaveBalance.model";
import { ApiError } from "../../common/utils/ApiError";
import { Types } from "mongoose";
import { IApplyLeaveInput } from "./leave.interface";
import { Attendance } from "../attendance/attendance.model";
import { normalizeDate } from "../attendance/attendance.utils";

/**
 * APPLY LEAVE
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
 
  // Calculate working days (exclude weekends)
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
  
  // Check overlapping leave
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
 //Get leaves api 
export const getMyLeaves = async (employeeId: string) => {
  return await Leave.find({ employee: employeeId })
    .populate("leaveType", "name code")
    .sort({ createdAt: -1 });
};

export const getAllLeaves = async () => {
  return await Leave.find()
    .populate("employee", "fullName email")
    .populate("leaveType", "name code")
    .sort({ createdAt: -1 });
};

/**

 * APPROVE OR REJECT LEAVE
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

  // If APPROVED
  if (status === "approved") {
    const year = new Date(leave.startDate).getFullYear();

    // Find LeaveBalance record
    const balance = await LeaveBalance.findOne({
      employee: leave.employee,
      year: year,
      leaveType: leave.leaveType,
    });

    if (!balance) {
      throw ApiError.badRequest(
        "Leave balance not found for this employee"
      );
    }

    // Prevent overuse
    if (balance.used + leave.totalDays > balance.allocated) {
      throw ApiError.badRequest(
        "Insufficient leave balance"
      );
    }

    // Increase used leave
    balance.used += leave.totalDays;
    await balance.save();

    // Create attendance records for each working day
    let current = new Date(leave.startDate);

    while (current <= leave.endDate) {
      const day = current.getDay();

      // Skip weekends
      if (day !== 0 && day !== 6) {
        const normalized = normalizeDate(current);

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

  // Update leave status
  
  leave.status = status;
  leave.approvedBy = new Types.ObjectId(approverId);
  leave.approvedAt = new Date();

  await leave.save();

  return leave;
};