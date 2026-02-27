import { Request, Response, NextFunction } from "express";
import {
  getMyAttendance,
  getAllAttendance,
  updateAttendanceStatus,
  checkoutAttendance, 
} from "./attendance.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { getMonthlySummary } from "./attendance.summary";
import { Attendance } from "./attendance.model"; // Add this import if not present

/*
 * GET /attendance/me
 * Logged-in user can view their own attendance
 * Supports month & year filtering
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
 * Admin & Manager can view all attendance
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
 * Admin can manually update attendance status
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
 * POST /attendance/checkout
 * Logged-in employee checks out for the day
 * Calculates workHours
 */
export const checkoutAttendanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    const result = await checkoutAttendance(user.id);

    return ApiResponse.sendSuccess(res, 200, "Checked out successfully", result);
  } catch (error) {
    
    next(error);
  }
};

/**
 * POST /attendance/checkin
 * Logged-in employee checks in for the day
 */
export const checkInAttendanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    // Use range for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      employee: user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Mark check-in
    const now = new Date();
    const attendance = await Attendance.create({
      employee: user.id,
      date: now,
      checkInTime: now,
      status: "present",
    });

    return ApiResponse.sendSuccess(res, 200, "Checked in", attendance);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /attendance/summary
 * Returns monthly attendance summary
 * - Defaults to current month if no month/year provided
 * - Calculates workingDays (Mon–Fri)
 * - Calculates presentDays, absentDays
 * - Calculates attendancePercentage
 */
export const getMonthlySummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { month, year } = req.query;

    const summary = await getMonthlySummary(
      user.id,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    );

    return ApiResponse.sendSuccess(
      res,
      200,
      "Monthly summary fetched",
      summary
    );
  } catch (error) {
    next(error);
  }
};