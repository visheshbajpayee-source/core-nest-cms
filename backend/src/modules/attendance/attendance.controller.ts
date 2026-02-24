import { Request, Response, NextFunction } from "express";
import {
  getMyAttendance,
  getAllAttendance,
  updateAttendanceStatus,
  markAttendance,
} from "./attendance.service";
import { ApiResponse } from "../../common/utils/ApiResponse";

/**
 * GET /attendance/me
 */
export const getMyAttendanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { month, year } = req.query;

    const data = await getMyAttendance(
      user.id,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    );

    return ApiResponse.sendSuccess(res, 200, "Attendance fetched", data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /attendance
 */
export const getAttendanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAllAttendance(req.query);
    return ApiResponse.sendSuccess(res, 200, "Attendance fetched", data);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /attendance/:id
 */
export const updateAttendanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateAttendanceStatus(id, status);

    return ApiResponse.sendSuccess(res, 200, "Attendance updated", updated);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /attendance/:id
 */
export const addAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   
    const { status } = req.body;

    const attedenceMark = await markAttendance((req as any).user.id);

    return ApiResponse.sendSuccess(res, 200, "Attendance updated");
  } catch (error) {
    next(error);
  }
};