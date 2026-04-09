import { Request, Response, NextFunction } from "express";
import loginService from "./auth.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { markAttendance } from "../attendance/attendance.service";

const authController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginService(req.body);

    // Auto mark attendance for employee only
    if (result.user?.role === "employee") {
      await markAttendance(result.user.id);
    }

    return ApiResponse.sendSuccess(res, 200, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

export default authController;