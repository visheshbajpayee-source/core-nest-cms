import { Request, Response, NextFunction } from "express";
import {
  CreateAnnouncementDto,
} from "./announcement.dto";
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

    // If manager, ensure department set and matches manager's department (attached on token in some setups)
    if (user.role === "manager") {
      // expect req.user to also include department when manager; if not provided, disallow
      // we allow manager to include department in body but prefer token department when present
      const mgrDept = (req.user as any).department;
      if (!mgrDept && !body.department) {
        throw ApiError.badRequest("Manager must specify a department for department announcements");
      }
      if (mgrDept && body.department && mgrDept.toString() !== body.department.toString()) {
        throw ApiError.forbidden("Manager cannot create announcement for another department");
      }
      if (!body.department && mgrDept) body.department = mgrDept;
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
