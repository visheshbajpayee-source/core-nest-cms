import { Attendance } from "./attendance.model";
import { countWorkingDays } from "./attendance.utils";

/**
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

  // Exclude unfinished today
  const today = new Date().toDateString();

  const completedRecords = records.filter(
    (r) =>
      r.checkOutTime || r.date.toDateString() !== today
  );

  const completedWorkingDays =
    completedRecords.length > workingDays
      ? workingDays
      : workingDays;

  const presentDays = completedRecords.length;

  const totalWorkHours = completedRecords.reduce(
    (sum, r) => sum + (r.workHours ?? 0),
    0
  );

  const absentDays =
    completedWorkingDays - presentDays > 0
      ? completedWorkingDays - presentDays
      : 0;

  const attendancePercentage =
    completedWorkingDays > 0
      ? (presentDays / completedWorkingDays) * 100
      : 0;

  return {
    month: selectedMonth,
    year: selectedYear,
    workingDays,
    presentDays,
    absentDays,
    totalWorkHours: Number(totalWorkHours.toFixed(2)),
    attendancePercentage: Number(attendancePercentage.toFixed(2)),
  };
};