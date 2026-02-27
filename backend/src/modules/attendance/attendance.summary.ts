import { Attendance } from "./attendance.model";
import { countWorkingDays } from "./attendance.utils";

/*
 * Monthly Summary Logic
 */
export const getMonthlySummary = async (
  employeeId: string,
  month?: number,
  year?: number
) => {
  const now = new Date();

  const selectedMonth = month ?? now.getMonth() + 1;
  const selectedYear = year ?? now.getFullYear();

  const start = new Date(selectedYear, selectedMonth - 1, 1);
  const end = new Date(selectedYear, selectedMonth, 1);

  const records = await Attendance.find({
    employee: employeeId,
    date: { $gte: start, $lt: end },
  });

  const workingDays = countWorkingDays(start, end);

  // Count by status
  const presentDays = records.filter(
    (r) => r.status === "present"
  ).length;

  const leaveDays = records.filter(
    (r) => r.status === "on_leave"
  ).length;

  const totalWorkHours = records.reduce(
    (sum, r) => sum + (r.workHours ?? 0),
    0
  );

  const absentDays =
    workingDays - presentDays - leaveDays > 0
      ? workingDays - presentDays - leaveDays
      : 0;

  const attendancePercentage =
    workingDays > 0
      ? ((presentDays + leaveDays) / workingDays) * 100
      : 0;

  return {
    month: selectedMonth,
    year: selectedYear,
    workingDays,
    presentDays,
    leaveDays,
    absentDays,
    totalWorkHours: Number(totalWorkHours.toFixed(2)),
    attendancePercentage: Number(attendancePercentage.toFixed(2)),
  };
};