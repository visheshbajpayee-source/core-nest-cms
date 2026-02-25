// import { Request, Response, NextFunction } from "express";
// import {
//   getMyAttendance,
//   getAllAttendance,
//   updateAttendanceStatus,
//   markAttendance,
// } from "./attendance.service";
// import { ApiResponse } from "../../common/utils/ApiResponse";

// /**
//  * GET /attendance/me
//  */
// export const getMyAttendanceController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = (req as any).user;
//     const { month, year } = req.query;

//     const data = await getMyAttendance(
//       user.id,
//       month ? Number(month) : undefined,
//       year ? Number(year) : undefined
//     );

//     return ApiResponse.sendSuccess(res, 200, "Attendance fetched", data);
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * GET /attendance
//  */
// export const getAttendanceController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const data = await getAllAttendance(req.query);
//     return ApiResponse.sendSuccess(res, 200, "Attendance fetched", data);
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * PATCH /attendance/:id
//  */
// export const updateAttendanceController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updated = await updateAttendanceStatus(id, status);

//     return ApiResponse.sendSuccess(res, 200, "Attendance updated", updated);
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * PATCH /attendance/:id
//  */
// export const addAttendance = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
   
//     const { status } = req.body;

//     const attedenceMark = await markAttendance((req as any).user.id);

//     return ApiResponse.sendSuccess(res, 200, "Attendance updated");
//   } catch (error) {
//     next(error);
//   }
// };



import { Request, Response, NextFunction } from "express";
import {
  getMyAttendance,
  getAllAttendance,
  updateAttendanceStatus,
  markAttendance,
  checkoutAttendance, // ✅ NEW
} from "./attendance.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { getMonthlySummary } from "./attendance.summary";

/**
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