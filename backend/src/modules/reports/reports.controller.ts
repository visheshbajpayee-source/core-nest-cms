import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";
import { WorkLog } from "../worklogs/worklog.model";
import { Employee } from "../employees/employee.model";
import { toCsv, CsvColumn } from "../../common/utils/csv.util";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { Attendance } from "../attendance/attendance.model";
import { LeaveBalance } from "../leaveBalance/leaveBalance.model";
import { Leave } from "../leaves/leave.model";
import { Department } from "../department/department.model";
import { SystemSettings } from "../settings/settings.model";

const parseRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
    throw ApiError.badRequest("Invalid date range");
  }
  const startDate = new Date(s.setHours(0, 0, 0, 0));
  const endDate = new Date(e.setHours(23, 59, 59, 999));
  return { startDate, endDate };
};

const parsePeriod = (period?: string, date?: string) => {
  if (!period) return null;
  const base = date ? new Date(date) : new Date();
  if (Number.isNaN(base.getTime())) throw ApiError.badRequest("Invalid date");

  let start: Date;
  let end: Date;

  switch ((period || "").toLowerCase()) {
    case "daily":
      start = new Date(base.setHours(0, 0, 0, 0));
      end = new Date(base.setHours(23, 59, 59, 999));
      break;
    case "weekly": {
      // ISO week starting Monday
      const d = new Date(base);
      const day = (d.getDay() + 6) % 7; // Monday=0
      const monday = new Date(d);
      monday.setDate(d.getDate() - day);
      start = new Date(monday.setHours(0, 0, 0, 0));
      const sunday = new Date(start);
      sunday.setDate(start.getDate() + 6);
      end = new Date(sunday.setHours(23, 59, 59, 999));
      break;
    }
    case "monthly": {
      const d = new Date(base);
      start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;
    }
    default:
      throw ApiError.badRequest(
        "Invalid period. Use daily|weekly|monthly or provide start/end"
      );
  }

  return { startDate: start, endDate: end };
};

export async function employeeReportController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { employeeId, start, end } = req.query;

    // allow either start+end OR period (+ optional date)
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (start && end) {
      ({ startDate, endDate } = parseRange(start as string, end as string));
    } else if (req.query.period) {
      const p = parsePeriod(
        req.query.period as string,
        req.query.date as any
      );
      if (!p) throw ApiError.badRequest("period parsing failed");
      startDate = p.startDate;
      endDate = p.endDate;
    } else {
      throw ApiError.badRequest(
        "start/end or period query params are required"
      );
    }

    const targetEmployeeId = (employeeId as any) || user.id;

    // Employees may only request their own reports
    if (user.role === "employee" && user.id !== targetEmployeeId) {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    // Managers may request only for members of their department
    if (user.role === "manager" && user.id !== targetEmployeeId) {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      const emp = await Employee.findById(targetEmployeeId);
      if (!emp) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      if (emp.department.toString() !== mgr.department.toString()) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }

    const logs = await WorkLog.find({
      employee: targetEmployeeId,
      date: { $gte: startDate, $lte: endDate },
    });
    const totalHours = logs.reduce(
      (s: number, l: any) => s + (l.hoursSpent || 0),
      0
    );

    return ApiResponse.sendSuccess(res, 200, "Employee report fetched", {
      logs,
      totalHours,
    });
  } catch (error) {
    next(error);
  }
}

export async function departmentReportController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { departmentId, start, end } = req.query;

    // allow either start+end OR period (+ optional date)
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (start && end) {
      ({ startDate, endDate } = parseRange(start as string, end as string));
    } else if (req.query.period) {
      const p = parsePeriod(
        req.query.period as string,
        req.query.date as any
      );
      if (!p) throw ApiError.badRequest("period parsing failed");
      startDate = p.startDate;
      endDate = p.endDate;
    } else {
      throw ApiError.badRequest(
        "start/end or period query params are required"
      );
    }

    let deptId = departmentId as any;

    // Manager: default to their department
    if (user.role === "manager" && !deptId) {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      deptId = mgr.department;
    }

    if (user.role !== "admin" && user.role !== "manager") {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }
    if (!deptId) throw ApiError.badRequest("departmentId is required");

    // Manager cannot request other departments
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      if (mgr.department.toString() !== deptId.toString()) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }

    const members = await Employee.find({ department: deptId }).select(
      "_id fullName"
    );
    const memberIds = members.map((m: any) => m._id);
    const logs = await WorkLog.find({
      employee: { $in: memberIds },
      date: { $gte: startDate, $lte: endDate },
    });
    const totalHours = logs.reduce(
      (s: number, l: any) => s + (l.hoursSpent || 0),
      0
    );

    const breakdownMap: Record<
      string,
      { employeeId: string; fullName?: string; totalHours: number }
    > = {};
    members.forEach((m: any) => {
      breakdownMap[m._id.toString()] = {
        employeeId: m._id.toString(),
        fullName: m.fullName,
        totalHours: 0,
      };
    });

    logs.forEach((l: any) => {
      const key = l.employee.toString();
      if (!breakdownMap[key]) {
        breakdownMap[key] = { employeeId: key, totalHours: 0 };
      }
      breakdownMap[key].totalHours += l.hoursSpent || 0;
    });

    const breakdown = Object.values(breakdownMap);

    return ApiResponse.sendSuccess(res, 200, "Department report fetched", {
      logs,
      totalHours,
      breakdown,
    });
  } catch (error) {
    next(error);
  }
}

export async function projectReportController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { projectId, start, end } = req.query;

    // allow either start+end OR period (+ optional date)
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (start && end) {
      ({ startDate, endDate } = parseRange(start as string, end as string));
    } else if (req.query.period) {
      const p = parsePeriod(
        req.query.period as string,
        req.query.date as any
      );
      if (!p) throw ApiError.badRequest("period parsing failed");
      startDate = p.startDate;
      endDate = p.endDate;
    } else {
      throw ApiError.badRequest(
        "start/end or period query params are required (and projectId)"
      );
    }

    if (!projectId) throw ApiError.badRequest("projectId is required");

    let match: any = {
      project: projectId,
      date: { $gte: startDate, $lte: endDate },
    };

    // Employee: restrict to their own logs
    if (user.role === "employee") {
      match.employee = user.id;
    }

    // Manager: restrict to their department members
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      const members = await Employee.find({
        department: mgr.department,
      }).select("_id");
      const memberIds = members.map((m: any) => m._id);
      match.employee = { $in: memberIds };
    }

    const logs = await WorkLog.find(match);
    const totalHours = logs.reduce(
      (s: number, l: any) => s + (l.hoursSpent || 0),
      0
    );

    const perEmployee: Record<string, number> = {};
    for (const l of logs) {
      const k = l.employee.toString();
      perEmployee[k] = (perEmployee[k] || 0) + (l.hoursSpent || 0);
    }

    const breakdown = Object.entries(perEmployee).map(
      ([employeeId, hours]) => ({ employeeId, totalHours: hours })
    );

    return ApiResponse.sendSuccess(res, 200, "Project report fetched", {
      logs,
      totalHours,
      breakdown,
    });
  } catch (error) {
    next(error);
  }
}

// ---- helper used for CSV export ----
type ExportUser = { id: string; role: string };

type WorklogSummaryRow = {
  employeeId: string;
  employeeName: string;
  date: string;
  totalHours: number;
  projectName?: string;
  departmentName?: string;
};

async function getWorklogSummaryReport(
  user: ExportUser,
  filters: any
): Promise<WorklogSummaryRow[]> {
  const { start, end, period, date } = filters || {};

  let range: { startDate: Date; endDate: Date } | null = null;

  if (start && end) {
    range = parseRange(String(start), String(end));
  } else if (period) {
    range = parsePeriod(String(period), date && String(date));
    if (!range) {
      throw ApiError.badRequest("period parsing failed");
    }
  } else {
    throw ApiError.badRequest(
      "start/end or period query params are required"
    );
  }

  const { startDate, endDate } = range;

  const match: any = {
    date: { $gte: startDate, $lte: endDate },
  };

  // Role-based access:
  if (user.role === "employee") {
    match.employee = user.id;
  } else if (user.role === "manager") {
    const mgr = await Employee.findById(user.id);
    if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
    const members = await Employee.find({
      department: mgr.department,
    }).select("_id");
    const memberIds = members.map((m: any) => m._id);
    match.employee = { $in: memberIds };
  }
  // admin: no extra filter

  const logs = await WorkLog.find(match)
    .populate({
      path: "employee",
      populate: { path: "department" },
    })
    .populate("project");

  return logs.map((log: any) => {
    const emp = log.employee as any;
    const proj = log.project as any;
    const dept = emp?.department as any;

    return {
      employeeId: emp?.employeeId || String(emp?._id || ""),
      employeeName: emp?.fullName || "",
      date: log.date ? new Date(log.date).toISOString().slice(0, 10) : "",
      totalHours: log.hoursSpent || 0,
      projectName: proj?.name || "",
      departmentName: dept?.name || "",
    };
  });
}

// ---- CSV export controller ----

export const exportWorklogSummaryCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    if (!user) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const rows = await getWorklogSummaryReport(user, req.query);

    type Row = (typeof rows)[number];

    const columns: CsvColumn<Row>[] = [
      { key: "employeeId", header: "Employee ID" },
      { key: "employeeName", header: "Employee Name" },
      { key: "date", header: "Date" },
      { key: "totalHours", header: "Total Hours" },
      { key: "projectName", header: "Project" },
      { key: "departmentName", header: "Department" },
    ];

    const csv = toCsv(rows, columns);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="worklog-summary.csv"'
    );

    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// --- Attendance Reports ---

// 1. Monthly attendance report per employee
export async function attendanceMonthlyReportController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { employeeId, year, month } = req.query;
    const targetEmployeeId = (employeeId as any) || user.id;

    // Role check
    if (user.role === "employee" && user.id !== targetEmployeeId) {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    // Manager: only their department
    if (user.role === "manager" && user.id !== targetEmployeeId) {
      const mgr = await Employee.findById(user.id);
      const emp = await Employee.findById(targetEmployeeId);
      if (!mgr || !emp || String(emp.department) !== String(mgr.department)) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }

    const y = parseInt(year as string) || new Date().getFullYear();
    const m = parseInt(month as string) || new Date().getMonth() + 1;
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59, 999);

    const records = await Attendance.find({
      employee: targetEmployeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    return ApiResponse.sendSuccess(res, 200, "Monthly attendance report", {
      employeeId: targetEmployeeId,
      year: y,
      month: m,
      records,
    });
  } catch (err) {
    next(err);
  }
}

// 2. Department-wise attendance summary
export async function attendanceDepartmentSummaryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { departmentId, year, month } = req.query;

    let deptId = departmentId as any;
    if (user.role === "manager" && !deptId) {
      const mgr = await Employee.findById(user.id);
      deptId = mgr?.department;
    }
    if (!deptId) throw ApiError.badRequest("departmentId is required");

    // Role check
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr || String(mgr.department) !== String(deptId)) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }
    if (user.role !== "admin" && user.role !== "manager") {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    const y = parseInt(year as string) || new Date().getFullYear();
    const m = parseInt(month as string) || new Date().getMonth() + 1;
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59, 999);

    const members = await Employee.find({ department: deptId }).select("_id fullName");
    const memberIds = members.map((m: any) => m._id);

    const records = await Attendance.find({
      employee: { $in: memberIds },
      date: { $gte: startDate, $lte: endDate },
    });

    // Summary: days present per employee
    const summary: Record<string, number> = {};
    records.forEach((rec: any) => {
      const eid = rec.employee.toString();
      summary[eid] = (summary[eid] || 0) + 1;
    });

    return ApiResponse.sendSuccess(res, 200, "Department attendance summary", {
      departmentId: deptId,
      year: y,
      month: m,
      summary,
    });
  } catch (err) {
    next(err);
  }
}

// 3. Late check-in report
export async function lateCheckinReportController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { departmentId, year, month } = req.query;

    // Get standard check-in time from settings
    const settings = await SystemSettings.findOne();
    const standardCheckIn = settings?.standardCheckInTime || "09:30";
    const [stdHour, stdMin] = standardCheckIn.split(":").map(Number);

    let deptId = departmentId as any;
    if (user.role === "manager" && !deptId) {
      const mgr = await Employee.findById(user.id);
      deptId = mgr?.department;
    }
    if (!deptId) throw ApiError.badRequest("departmentId is required");

    // Role check
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr || String(mgr.department) !== String(deptId)) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }
    if (user.role !== "admin" && user.role !== "manager") {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    const y = parseInt(year as string) || new Date().getFullYear();
    const m = parseInt(month as string) || new Date().getMonth() + 1;
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59, 999);

    const members = await Employee.find({ department: deptId }).select("_id fullName");
    const memberIds = members.map((m: any) => m._id);

    const records = await Attendance.find({
      employee: { $in: memberIds },
      date: { $gte: startDate, $lte: endDate },
    });

    // Find late check-ins
    const lateRecords = records.filter((rec: any) => {
      if (!rec.checkInTime) return false;
      const [h, min] = rec.checkInTime.split(":").map(Number);
      return h > stdHour || (h === stdHour && min > stdMin);
    });

    return ApiResponse.sendSuccess(res, 200, "Late check-in report", {
      departmentId: deptId,
      year: y,
      month: m,
      lateRecords,
    });
  } catch (err) {
    next(err);
  }
}

// --- Leave Reports ---

// 4. Leave balance summary per employee
export async function leaveBalanceSummaryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { employeeId, year } = req.query;
    const targetEmployeeId = (employeeId as any) || user.id;

    // Role check
    if (user.role === "employee" && user.id !== targetEmployeeId) {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }
    if (user.role === "manager" && user.id !== targetEmployeeId) {
      const mgr = await Employee.findById(user.id);
      const emp = await Employee.findById(targetEmployeeId);
      if (!mgr || !emp || String(emp.department) !== String(mgr.department)) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }

    const y = parseInt(year as string) || new Date().getFullYear();
    const balances = await LeaveBalance.find({
      employee: targetEmployeeId,
      year: y,
    });

    return ApiResponse.sendSuccess(res, 200, "Leave balance summary", {
      employeeId: targetEmployeeId,
      year: y,
      balances,
    });
  } catch (err) {
    next(err);
  }
}

// 5. Department-wise leave utilization report
export async function departmentLeaveUtilizationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { departmentId, year } = req.query;

    let deptId = departmentId as any;
    if (user.role === "manager" && !deptId) {
      const mgr = await Employee.findById(user.id);
      deptId = mgr?.department;
    }
    if (!deptId) throw ApiError.badRequest("departmentId is required");

    // Role check
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr || String(mgr.department) !== String(deptId)) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }
    if (user.role !== "admin" && user.role !== "manager") {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    const y = parseInt(year as string) || new Date().getFullYear();
    const members = await Employee.find({ department: deptId }).select("_id fullName");
    const memberIds = members.map((m: any) => m._id);

    // Find all leaves for these employees in the year
    const leaves = await Leave.find({
      employee: { $in: memberIds },
      status: "approved",
      startDate: { $gte: new Date(y, 0, 1) },
      endDate: { $lte: new Date(y, 11, 31, 23, 59, 59, 999) },
    });

    // Utilization per employee
    const utilization: Record<string, number> = {};
    leaves.forEach((l: any) => {
      const eid = l.employee.toString();
      utilization[eid] = (utilization[eid] || 0) + (l.totalDays || 0);
    });

    return ApiResponse.sendSuccess(res, 200, "Department leave utilization", {
      departmentId: deptId,
      year: y,
      utilization,
    });
  } catch (err) {
    next(err);
  }
}
