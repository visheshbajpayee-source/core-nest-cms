import { Router, Request, Response, NextFunction } from "express";
import { Leave } from "./leave.model";
import { LeaveBalance } from "../leaveBalance/leaveBalance.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all leaves (admin = all, manager = their dept)
router.get("/", protect, authorize("admin", "manager", "employee"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { status, leaveType, employeeId } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;

    // Employee can only see their own
    if (user?.role === "employee") {
      query.employee = user.mongoId || user.id;
    }

    const leaves = await Leave.find(query)
      .populate("employee", "fullName email employeeId department")
      .populate("approvedBy", "fullName email employeeId")
      .sort({ createdAt: -1 })
      .lean();

    let result = leaves;

    // Manager sees only their department
    if (user?.role === "manager") {
      result = leaves.filter((l: any) => {
        return l.employee?.department?.toString() === user.department?.toString();
      });
    }

    if (employeeId) {
      result = result.filter((l: any) => l.employee?.employeeId === employeeId);
    }

    return ApiResponse.sendSuccess(res, 200, "Leave requests fetched", result);
  } catch (e) { next(e); }
});

// POST apply for leave (employee)
router.post("/", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!leaveType || !startDate || !endDate || !reason) {
      throw ApiError.badRequest("leaveType, startDate, endDate and reason are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const leave = await Leave.create({
      employee: user.mongoId || user.id,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason,
      status: "pending",
    });

    return ApiResponse.sendSuccess(res, 201, "Leave request submitted", leave);
  } catch (e) { next(e); }
});

// PUT approve leave (admin + manager)
router.put("/:id/approve", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const leave = await Leave.findById(req.params.id);
    if (!leave) throw ApiError.notFound("Leave request not found");
    if (leave.status !== "pending") throw ApiError.badRequest("Leave is already processed");

    leave.status = "approved";
    leave.approvedBy = user.mongoId || user.id;
    await leave.save();

    // Deduct from leave balance
    const year = leave.startDate.getFullYear();
    await LeaveBalance.findOneAndUpdate(
      { employee: leave.employee, year, leaveType: leave.leaveType },
      { $inc: { used: leave.numberOfDays } }
    );

    return ApiResponse.sendSuccess(res, 200, "Leave approved", leave);
  } catch (e) { next(e); }
});

// PUT reject leave (admin + manager)
router.put("/:id/reject", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const leave = await Leave.findById(req.params.id);
    if (!leave) throw ApiError.notFound("Leave request not found");
    if (leave.status !== "pending") throw ApiError.badRequest("Leave is already processed");

    leave.status = "rejected";
    leave.approvedBy = user.mongoId || user.id;
    await leave.save();

    return ApiResponse.sendSuccess(res, 200, "Leave rejected", leave);
  } catch (e) { next(e); }
});

// DELETE leave request (employee can cancel pending, admin can delete any)
router.delete("/:id", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const leave = await Leave.findById(req.params.id);
    if (!leave) throw ApiError.notFound("Leave request not found");

    if (user?.role === "employee") {
      if (leave.employee.toString() !== (user.mongoId || user.id).toString()) {
        throw ApiError.forbidden("Cannot delete another employee's leave");
      }
      if (leave.status !== "pending") throw ApiError.badRequest("Only pending leaves can be cancelled");
    }

    await leave.deleteOne();
    return ApiResponse.sendSuccess(res, 200, "Leave request deleted", null);
  } catch (e) { next(e); }
});

export default router;
