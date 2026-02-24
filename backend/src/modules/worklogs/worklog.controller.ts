import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";
import {
  createWorkLog,
  getWorkLogs,
  getWorkLogById,
  updateWorkLog,
  deleteWorkLog,
  getDailySummary,
} from "./worklog.service";
import { Employee } from "../employees/employee.model";

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export async function createWorkLogController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const body = req.body;

    // default employee to the requester
    const payload: any = { ...body, employee: user.id };
    if (typeof payload.date === "string") payload.date = new Date(payload.date);

    const item = await createWorkLog(payload);
    return ApiResponse.created("Worklog created", item).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getWorkLogsController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { employee, date, project } = req.query;

    // Employee: only their logs
    if (user.role === "employee") {
      const items = await getWorkLogs({ employee: user.id, date: date as any });
      return ApiResponse.sendSuccess(res, 200, "Worklogs fetched", items);
    }

    // Manager: logs of their department members
    if (user.role === "manager") {
      // fetch manager record to get department
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);

      const members = await Employee.find({ department: mgr.department }).select("_id");
      const memberIds = members.map((m: any) => m._id.toString());

      const items = await getWorkLogs({ date: date as any });
      const filtered = items.filter((i: any) => memberIds.includes(i.employee.toString()));
      return ApiResponse.sendSuccess(res, 200, "Worklogs fetched", filtered);
    }

    // Admin: can filter
    const items = await getWorkLogs({ employee: employee as any, date: date as any, project: project as any });
    return ApiResponse.sendSuccess(res, 200, "Worklogs fetched", items);
  } catch (error) {
    next(error);
  }
}

export async function getWorkLogController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const item: any = await getWorkLogById(id);
    if (!item) throw ApiError.notFound(ErrorMessages.WORKLOG_NOT_FOUND);

    // Employee: only own
    if (user.role === "employee" && item.employee.toString() !== user.id) {
      throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    // Manager: ensure department
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      const empDoc = await Employee.findById(item.employee);
      if (!empDoc) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      if (empDoc.department.toString() !== mgr.department.toString()) {
        throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      }
    }

    return ApiResponse.sendSuccess(res, 200, "Worklog fetched", item);
  } catch (error) {
    next(error);
  }
}

export async function updateWorkLogController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const payload = req.body;

    const item: any = await getWorkLogById(id);
    if (!item) throw ApiError.notFound(ErrorMessages.WORKLOG_NOT_FOUND);

    // Only admin or owner allowed to update. Owner only if date is today.
    if (user.role === "employee") {
      if (item.employee.toString() !== user.id) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      const today = new Date();
      if (!isSameDay(new Date(item.date), today)) throw ApiError.forbidden("Past logs are read-only");
    }

    const updated = await updateWorkLog(id, payload as any);
    return ApiResponse.sendSuccess(res, 200, "Worklog updated", updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteWorkLogController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const item: any = await getWorkLogById(id);
    if (!item) throw ApiError.notFound(ErrorMessages.WORKLOG_NOT_FOUND);

    // Only admin or owner allowed to delete. Owner only if date is today.
    if (user.role === "employee") {
      if (item.employee.toString() !== user.id) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
      const today = new Date();
      if (!isSameDay(new Date(item.date), today)) throw ApiError.forbidden("Past logs are read-only");
    }

    await deleteWorkLog(id);
    return ApiResponse.sendSuccess(res, 200, "Worklog deleted", null);
  } catch (error) {
    next(error);
  }
}

export async function dailySummaryController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { employeeId } = req.params;
    const { date } = req.query;

    if (!date) throw ApiError.badRequest("date query param is required (YYYY-MM-DD)");

    // Employee can only request their own summary
    if (user.role === "employee" && user.id !== employeeId) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);

    // Manager: ensure target employee is in their dept
    if (user.role === "manager") {
      const mgr = await Employee.findById(user.id);
      if (!mgr) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      const emp = await Employee.findById(employeeId);
      if (!emp) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      if (emp.department.toString() !== mgr.department.toString()) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
    }

    const summary = await getDailySummary(employeeId, date as string);
    return ApiResponse.sendSuccess(res, 200, "Daily summary fetched", summary);
  } catch (error) {
    next(error);
  }
}
