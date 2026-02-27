import { Request, Response, NextFunction } from "express";
import {
  createLeaveType,
  getLeaveTypes,
  updateLeaveType,
  disableLeaveType,
} from "./leaveType.service";
import { ApiResponse } from "../../common/utils/ApiResponse";

/**
 * POST /leave-types
 */
export const createLeaveTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await createLeaveType(req.body);
    return ApiResponse.sendSuccess(res, 201, "Leave type created", data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /leave-types
 */
export const getLeaveTypesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getLeaveTypes();
    return ApiResponse.sendSuccess(res, 200, "Leave types fetched", data);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /leave-types/:id
 */
export const updateLeaveTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateLeaveType(req.params.id, req.body);
    return ApiResponse.sendSuccess(res, 200, "Leave type updated", data);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /leave-types/:id
 */
export const disableLeaveTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await disableLeaveType(req.params.id);
    return ApiResponse.sendSuccess(res, 200, "Leave type disabled", data);
  } catch (error) {
    next(error);
  }
};