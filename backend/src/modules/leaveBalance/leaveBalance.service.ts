import { LeaveBalance } from "./leaveBalance.model";
import { ApiError } from "../../common/utils/ApiError";

export const createLeaveBalance = async (data: {
  employee: string;
  year: number;
  leaveType: string;
  allocated: number;
}) => {
  const exists = await LeaveBalance.findOne({
    employee: data.employee,
    year: data.year,
    leaveType: data.leaveType,
  });

  if (exists) {
    throw ApiError.conflict(
      "Leave balance already exists for this type and year"
    );
  }

  const balance = await LeaveBalance.create({
    employee: data.employee,
    year: data.year,
    leaveType: data.leaveType,
    allocated: data.allocated,
    used: 0,
  });

  return balance;
};