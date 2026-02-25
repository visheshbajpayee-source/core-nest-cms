import { Router, Request, Response, NextFunction } from "express";
import { WorkLog } from "./worklog.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all worklogs (admin = all, manager = dept)
router.get("/", protect, authorize("admin", "manager", "employee"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { date, month, year, status, employeeId } = req.query;

    const query: any = {};
    if (status) query.status = status;

    if (date) {
      const d = new Date(date as string);
      query.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
    } else if (month && year) {
      const m = Number(month) - 1;
      const y = Number(year);
      query.date = { $gte: new Date(y, m, 1), $lte: new Date(y, m + 1, 0, 23, 59, 59) };
    }

    // Employee sees only their own logs
    if (user?.role === "employee") {
      query.employee = user.mongoId || user.id;
    }

    const logs = await WorkLog.find(query)
      .populate("employee", "fullName email employeeId department")
      .populate("project", "name")
      .sort({ date: -1 })
      .lean();

    let result = logs;

    if (user?.role === "manager") {
      result = logs.filter((l: any) => {
        return l.employee?.department?.toString() === user.department?.toString();
      });
    }

    if (employeeId) {
      result = result.filter((l: any) => l.employee?.employeeId === employeeId);
    }

    return ApiResponse.sendSuccess(res, 200, "Work logs fetched", result);
  } catch (e) { next(e); }
});

// POST create worklog (employee)
router.post("/", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { date, taskTitle, taskDescription, project, hoursSpent, status } = req.body;
    if (!date || !taskTitle || !taskDescription || !hoursSpent) {
      throw ApiError.badRequest("date, taskTitle, taskDescription and hoursSpent are required");
    }

    const log = await WorkLog.create({
      employee: user.mongoId || user.id,
      date: new Date(date),
      taskTitle,
      taskDescription,
      project: project || undefined,
      hoursSpent: Number(hoursSpent),
      status: status || "in_progress",
    });

    return ApiResponse.sendSuccess(res, 201, "Work log created", log);
  } catch (e) { next(e); }
});

// PUT update worklog
router.put("/:id", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const log = await WorkLog.findById(req.params.id);
    if (!log) throw ApiError.notFound("Work log not found");

    // Employee can only edit logs from today
    if (user?.role === "employee") {
      if (log.employee.toString() !== (user.mongoId || user.id).toString()) {
        throw ApiError.forbidden("Cannot edit another employee's work log");
      }
      const today = new Date();
      const logDate = new Date(log.date);
      if (
        logDate.getFullYear() !== today.getFullYear() ||
        logDate.getMonth() !== today.getMonth() ||
        logDate.getDate() !== today.getDate()
      ) {
        throw ApiError.badRequest("Past work logs cannot be edited");
      }
    }

    const { taskTitle, taskDescription, project, hoursSpent, status } = req.body;
    const updated = await WorkLog.findByIdAndUpdate(
      req.params.id,
      { taskTitle, taskDescription, project: project || undefined, hoursSpent, status },
      { new: true, runValidators: true }
    );
    return ApiResponse.sendSuccess(res, 200, "Work log updated", updated);
  } catch (e) { next(e); }
});

// DELETE worklog
router.delete("/:id", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const log = await WorkLog.findById(req.params.id);
    if (!log) throw ApiError.notFound("Work log not found");

    if (user?.role === "employee" && log.employee.toString() !== (user.mongoId || user.id).toString()) {
      throw ApiError.forbidden("Cannot delete another employee's work log");
    }

    await log.deleteOne();
    return ApiResponse.sendSuccess(res, 200, "Work log deleted", null);
  } catch (e) { next(e); }
});

export default router;
