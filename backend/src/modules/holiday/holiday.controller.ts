import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/ApiResponse";
import * as holidayService from "./holiday.service";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { deleteHolidayService } from "./holiday.service";
import { de } from "zod/locales";
import { success } from "zod";

export const createHoliday = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await holidayService.createHoliday(req.body);

    return ApiResponse.created(
      "Holiday created successfully",
      result
    ).send(res);
  }
);

export const getAllHolidays = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const includeInactive = req.user?.role === "admin";

    const result = await holidayService.getAllHolidays(includeInactive);

    return ApiResponse.ok(
      "Holidays fetched successfully",
      result
    ).send(res);
  }
);

export const getHolidayById = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await holidayService.getHolidayById(req.params.id);

    return ApiResponse.ok(
      "Holiday fetched successfully",
      result
    ).send(res);
  }
);

export const updateHoliday = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await holidayService.updateHoliday(
      req.params.id,
      req.body
    );

    return ApiResponse.updated(
      "Holiday updated successfully",
      result
    ).send(res);
  }
);

export const deactivateHoliday = asyncHandler(
  async (req: Request, res: Response) => {

    await holidayService.deactivateHoliday(req.params.id);

    return ApiResponse.ok(
      "Holiday deactivated successfully"
    ).send(res);
  }
);

export async function deleteHoliday(
  req: Request,
  res: Response,
  next: NextFunction
)
{
  try{
    const{id}=req.params;
    await deleteHolidayService(id);
    return res.status(200).json({
      success:true,
      message:"Holiday deleted succcessfully",
    });
  }
  catch(error)
  {
    next(error);
  }
}