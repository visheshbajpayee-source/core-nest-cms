import { Request, Response, NextFunction } from "express";
import {
  CreateAnnouncementDto,
} from "./announcement.dto";
import { Employee } from "../employees/employee.model";
import {
  createAnnouncement,
  getActiveAnnouncementsForUser,
  getArchivedAnnouncementsForUser,
} from "./announcement.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

export async function createAnnouncementController(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) throw ApiError.unauthorized(ErrorMessages.TOKEN_MISSING);

    const body = req.body as CreateAnnouncementDto;

    // Validate roles + targets
    if (body.target === "all" && user.role !== "admin") {
      throw ApiError.forbidden("Only admin can publish organization-wide announcements");
    }

    if (body.target === "department" && user.role === "employee") {
      throw ApiError.forbidden("Only managers or admins can publish department announcements");
    }

    // If manager, ensure announcement is for manager's own department only
    if (user.role === "manager") {
      const manager = await Employee.findById(user.id) as any;
      if (!manager) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
      const mgrDept = manager.department ? manager.department.toString() : undefined;
      if (!mgrDept) {
        throw ApiError.badRequest("Manager does not have a department assigned");
      }
      if (body.department && body.department !== mgrDept) {
        throw ApiError.forbidden("Manager cannot create announcement for another department");
      }
      // enforce manager's department
      body.department = mgrDept;
      // ensure target is department
      body.target = "department";
    }

    const created = await createAnnouncement(body, user.id);

    return ApiResponse.created("Announcement created", created).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getAnnouncementsController(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as any;
    const items = await getActiveAnnouncementsForUser(user || {});
    return ApiResponse.sendSuccess(res, 200, "Announcements fetched", items);
  } catch (error) {
    next(error);
  }
}

export async function getArchivedAnnouncementsController(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as any;
    const items = await getArchivedAnnouncementsForUser(user || {});
    return ApiResponse.sendSuccess(res, 200, "Archived announcements fetched", items);
  } catch (error) {
    next(error);
  }
}
