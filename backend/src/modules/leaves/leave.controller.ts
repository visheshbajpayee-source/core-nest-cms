import { Request, Response, NextFunction } from "express";
import { applyLeave, getMyLeaveHistory } from "./leave.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { updateLeaveStatus } from "./leave.service";
import { getMyLeaves } from "./leave.service";
import { getAllLeaves } from "./leave.service";
import { Leave } from "./leave.model";
export const applyLeaveController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    const data = await applyLeave(user.id, req.body);

    return ApiResponse.sendSuccess(res, 201, "Leave applied successfully", data);
  } catch (error) {
    next(error);
  }
};

/*
 * GET /leaves/me
 */
export const getMyLeavesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employeeId = req.user.id;

    const data = await getMyLeaves(employeeId);

    return ApiResponse.sendSuccess(
      res,
      200,
      "Leaves fetched",
      data
    );
  } catch (error) {
    next(error);
  }
};
export const updateLeaveStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = (req as any).user;

    const result = await updateLeaveStatus(id, status, user.id);

    return ApiResponse.sendSuccess(
      res,
      200,
      "Leave status updated successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};
export const getAllLeavesController = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, leaveType, employeeId } = req.query;
    const filters: any = {};

    // Apply filters
    if (status) {
      filters.status = status;
    }
    if (employeeId) {
      filters.employee = employeeId;
    }
    if (leaveType) {
      filters.leaveType = leaveType;
    }

    const data = await Leave.find(filters)
      .populate("employee", "fullName email employeeId")
      .populate("leaveType", "name code")
      .sort({ createdAt: -1 });

    return ApiResponse.sendSuccess(
      res,
      200,
      "All leaves fetched",
      data
    );
  } catch (error) {
    next(error);
  }
};
