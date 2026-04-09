import { Request, Response, NextFunction } from "express";
import {
  changePassword,
  getSystemSettings,
  getUserSettings,
  updateNotificationPreferences,
  updateProfilePicture,
  updateSystemSettings,
} from "./settings.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

export const getSystemSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (!user || user.role !== "admin") {
      throw ApiError.forbidden("Only admin can view system settings");
    }

    const settings = await getSystemSettings();
    return ApiResponse.sendSuccess(res, 200, "System settings fetched", settings);
  } catch (error) {
    next(error);
  }
};

export const updateSystemSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (!user || user.role !== "admin") {
      throw ApiError.forbidden("Only admin can update system settings");
    }

    const settings = await updateSystemSettings(req.body);
    return ApiResponse.sendSuccess(res, 200, "System settings updated", settings);
  } catch (error) {
    next(error);
  }
};

export const getUserSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (!user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const settings = await getUserSettings(user.id);
    return ApiResponse.sendSuccess(res, 200, "User settings fetched", settings);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (!user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    await changePassword(user.id, req.body);
    return ApiResponse.sendSuccess(res, 200, "Password updated successfully", null);
  } catch (error) {
    next(error);
  }
};

export const updateProfilePictureController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (!user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const file = (req as any).file as Express.Multer.File | undefined;

    if (!file) {
      throw ApiError.badRequest("Profile picture file is required");
    }

    //converting File to base64 string
    const base64 = file.buffer.toString("base64");
    //converting base64 string to data url
    const dataUrl = `data:${file.mimetype};base64,${base64}`;

    const settings = await updateProfilePicture(user.id, dataUrl);
    return ApiResponse.sendSuccess(res, 200, "Profile picture updated", settings);
  } catch (error) {
    next(error);
  }
};

export const updateNotificationPreferencesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (!user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const settings = await updateNotificationPreferences(user.id, req.body);
    return ApiResponse.sendSuccess(
      res,
      200,
      "Notification preferences updated",
      settings
    );
  } catch (error) {
    next(error);
  }
};
