import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";
import { WorkLog } from "../worklogs/worklog.model";
import { Employee } from "../employees/employee.model";

const parseRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) throw ApiError.badRequest("Invalid date range");
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
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    default:
      throw ApiError.badRequest("Invalid period. Use daily|weekly|monthly or provide start/end");
  }

  return { startDate: start, endDate: end };
};

export async function employeeReportController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { employeeId, start, end } = req.query;

    // allow either start+end OR period (+ optional date)
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (start && end) {
      ({ startDate, endDate } = parseRange(start as string, end as string));
    } else if (req.query.period) {
      const p = parsePeriod(req.query.period as string, req.query.date as any);
      if (!p) throw ApiError.badRequest("period parsing failed");
      startDate = p.startDate;
      endDate = p.endDate;
    } else {
      throw ApiError.badRequest("start/end or period query params are required");
    }

    const targetEmployeeId = (employeeId as any) || user.id;

    // Employees may only request their own reports
    if (user.role === "employee" && user.id !== targetEmployeeId) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);

    // Managers may request only for members of their department
    if (user.role === "manager" && user.id !== targetEmployeeId) {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      const emp = await Employee.findById(targetEmployeeId);
      if (!emp) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      if (emp.department.toString() !== mgr.department.toString()) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    const logs = await WorkLog.find({ employee: targetEmployeeId, date: { $gte: startDate, $lte: endDate } });
    const totalHours = logs.reduce((s: number, l: any) => s + (l.hoursSpent || 0), 0);

    return ApiResponse.sendSuccess(res, 200, "Employee report fetched", { logs, totalHours });
  } catch (error) {
    next(error);
  }
}

export async function departmentReportController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { departmentId, start, end } = req.query;

    // allow either start+end OR period (+ optional date)
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (start && end) {
      ({ startDate, endDate } = parseRange(start as string, end as string));
    } else if (req.query.period) {
      const p = parsePeriod(req.query.period as string, req.query.date as any);
      if (!p) throw ApiError.badRequest("period parsing failed");
      startDate = p.startDate;
      endDate = p.endDate;
    } else {
      throw ApiError.badRequest("start/end or period query params are required");
    }

    let deptId = departmentId as any;

    // Manager: default to their department
    if (user.role === "manager" && !deptId) {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      deptId = mgr.department;
    }

    if (user.role !== "admin" && user.role !== "manager") throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    if (!deptId) throw ApiError.badRequest("departmentId is required");

    // Manager cannot request other departments
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      if (mgr.department.toString() !== deptId.toString()) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    const members = await Employee.find({ department: deptId }).select("_id fullName");
    const memberIds = members.map((m: any) => m._id);
    const logs = await WorkLog.find({ employee: { $in: memberIds }, date: { $gte: startDate, $lte: endDate } });
    const totalHours = logs.reduce((s: number, l: any) => s + (l.hoursSpent || 0), 0);

    const breakdownMap: Record<string, { employeeId: string; fullName?: string; totalHours: number }> = {};
    members.forEach((m: any) => {
      breakdownMap[m._id.toString()] = { employeeId: m._id.toString(), fullName: m.fullName, totalHours: 0 };
    });

    logs.forEach((l: any) => {
      const key = l.employee.toString();
      if (!breakdownMap[key]) breakdownMap[key] = { employeeId: key, totalHours: 0 };
      breakdownMap[key].totalHours += l.hoursSpent || 0;
    });

    const breakdown = Object.values(breakdownMap);

    return ApiResponse.sendSuccess(res, 200, "Department report fetched", { logs, totalHours, breakdown });
  } catch (error) {
    next(error);
  }
}

export async function projectReportController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { projectId, start, end } = req.query;

    // allow either start+end OR period (+ optional date)
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (start && end) {
      ({ startDate, endDate } = parseRange(start as string, end as string));
    } else if (req.query.period) {
      const p = parsePeriod(req.query.period as string, req.query.date as any);
      if (!p) throw ApiError.badRequest("period parsing failed");
      startDate = p.startDate;
      endDate = p.endDate;
    } else {
      throw ApiError.badRequest("start/end or period query params are required (and projectId)");
    }

    if (!projectId) throw ApiError.badRequest("projectId is required");

    let match: any = { project: projectId, date: { $gte: startDate, $lte: endDate } };

    // Employee: restrict to their own logs
    if (user.role === "employee") {
      match.employee = user.id;
    }

    // Manager: restrict to their department members
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      const members = await Employee.find({ department: mgr.department }).select("_id");
      const memberIds = members.map((m: any) => m._id);
      match.employee = { $in: memberIds };
    }

    const logs = await WorkLog.find(match);
    const totalHours = logs.reduce((s: number, l: any) => s + (l.hoursSpent || 0), 0);

    const perEmployee: Record<string, number> = {};
    for (const l of logs) {
      const k = l.employee.toString();
      perEmployee[k] = (perEmployee[k] || 0) + (l.hoursSpent || 0);
    }

    const breakdown = Object.entries(perEmployee).map(([employeeId, hours]) => ({ employeeId, totalHours: hours }));

    return ApiResponse.sendSuccess(res, 200, "Project report fetched", { logs, totalHours, breakdown });
  } catch (error) {
    next(error);
  }
}

export default {};
