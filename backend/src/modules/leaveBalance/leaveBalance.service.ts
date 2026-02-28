import { LeaveBalance } from "./leaveBalance.model";
import { SystemSettings } from "../settings/settings.model";

/**
 * create / ensure a balance document for each type defined in settings
 */
export const initLeaveBalancesForEmployee = async (
  employeeId: string,
  year: number = new Date().getFullYear()
) => {
  const settings = await SystemSettings.findOne();
  if (!settings) return;

  const ops = settings.defaultLeaveAllocations.map((alloc) => ({
    updateOne: {
      filter: { employee: employeeId, year, leaveType: alloc.leaveType },
      update: { $setOnInsert: { allocated: alloc.daysPerYear, used: 0 } },
      upsert: true,
    },
  }));

  if (ops.length) {
    await LeaveBalance.bulkWrite(ops);
  }
};

export const getBalances = async (
  employeeId: string,
  year: number = new Date().getFullYear()
) => {
  return LeaveBalance.find({ employee: employeeId, year });
};

export const adjustBalance = async (
  employeeId: string,
  year: number,
  leaveType: string,
  days: number
) => {
  const bal = await LeaveBalance.findOne({
    employee: employeeId,
    year,
    leaveType,
  });
  if (!bal) {
    throw new Error("leave balance not found");
  }
  bal.used += days;
  if (bal.used > bal.allocated) {
    throw new Error("insufficient leave balance");
  }
  return bal.save();
};
