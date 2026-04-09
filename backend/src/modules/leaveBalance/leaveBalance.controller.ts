import { LeaveBalance } from "./leaveBalance.model";
import { LeaveBalanceResponseDto } from "./leaveBalance.dto";

export const getLeaveBalanceController = async (
  employeeId: string
): Promise<LeaveBalanceResponseDto> => {
  const currentYear = new Date().getFullYear();

  const records = await LeaveBalance.find({
    employee: employeeId,
    year: currentYear,
  }).populate("leaveType", "name code");

  let totalAllocated = 0;
  let totalUsed = 0;

  const balances = records.map((record: any) => {
    const remaining = record.allocated - record.used;

    totalAllocated += record.allocated;
    totalUsed += record.used;

    return {
      leaveType: {
        id: record.leaveType._id,
        name: record.leaveType.name,
        code: record.leaveType.code,
      },
      allocated: record.allocated,
      used: record.used,
      remaining,
    };
  });

  return {
    year: currentYear,
    totalAllocated,
    totalUsed,
    totalRemaining: totalAllocated - totalUsed,
    balances,
  };
};