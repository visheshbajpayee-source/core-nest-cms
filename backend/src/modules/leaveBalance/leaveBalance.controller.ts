import { Request, Response, NextFunction } from "express";
import { getBalances } from "./leaveBalance.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { resetAllLeaveBalancesService } from "./leaveBalance.service";

export const getMyLeaveBalancesController = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const data = await getBalances(req.user.id, year);
    return ApiResponse.sendSuccess(res, 200, "Leave balances fetched", data);
  } catch (err) {
    next(err);
  }
};

export const resetAllLeaveBalancesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 👉 Yaha service call karenge (next step me banayenge)
    await resetAllLeaveBalancesService();

    return ApiResponse.sendSuccess(
      res,
      200,
      "All leave balances reset successfully",
      null
    );
  } catch (err) {
    next(err);
  }
};