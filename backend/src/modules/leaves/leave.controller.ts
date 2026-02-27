import { Request, Response, NextFunction } from "express";
import { applyLeave, getMyLeaveHistory } from "./leave.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { updateLeaveStatus } from "./leave.service";
import { getMyLeaves } from "./leave.service";

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
  req: any,
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

export const getMyLeaveHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const now = new Date();

    const month = Number(req.query.month ?? now.getMonth() + 1);
    const year = Number(req.query.year ?? now.getFullYear());
    const status = req.query.status as any;
    const leaveType = req.query.leaveType as string | undefined;

    const data = await getMyLeaveHistory(user.id, {
      month,
      year,
      status,
      leaveType,
    });

    return ApiResponse.sendSuccess(res, 200, "Leave history fetched successfully", data);
  } catch (error) {
    next(error);
  }
};
