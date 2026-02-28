import { Request, Response, NextFunction } from "express";
import { getBalances } from "./leaveBalance.service";
import { ApiResponse } from "../../common/utils/ApiResponse";

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
