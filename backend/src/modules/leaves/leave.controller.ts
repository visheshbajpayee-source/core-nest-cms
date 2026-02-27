import { Request, Response, NextFunction } from "express";
import { applyLeave, getMyLeaveHistory } from "./leave.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { updateLeaveStatus } from "./leave.service";
import { getMyLeaves } from "./leave.service";
import { getAllLeaves } from "./leave.service";
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
export const getAllLeavesController = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAllLeaves();

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
