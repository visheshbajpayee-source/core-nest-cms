import { Router, Request, Response, NextFunction } from "express";
import { Announcement } from "./announcement.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all announcements (all roles)
router.get("/", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const now = new Date();

    // Base: not expired
    const query: any = {
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: now } },
      ],
    };

    // Employee sees "all" announcements + their dept
    if (user?.role === "employee") {
      query.$and = [
        {
          $or: [
            { target: "all" },
            { target: "department", department: user.department },
          ],
        },
      ];
    } else if (user?.role === "manager") {
      // Manager sees all + their dept
      query.$and = [
        {
          $or: [
            { target: "all" },
            { target: "department", department: user.department },
          ],
        },
      ];
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy", "fullName email employeeId")
      .populate("department", "name")
      .sort({ publishedAt: -1 })
      .lean();

    return ApiResponse.sendSuccess(res, 200, "Announcements fetched", announcements);
  } catch (e) { next(e); }
});

// GET all including expired (admin only) 
router.get("/all", protect, authorize("admin"), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "fullName email employeeId")
      .populate("department", "name")
      .sort({ publishedAt: -1 })
      .lean();
    return ApiResponse.sendSuccess(res, 200, "All announcements fetched", announcements);
  } catch (e) { next(e); }
});

// POST create announcement (admin or manager)
router.post("/", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { title, content, target, department, priority, expiryDate } = req.body;
    if (!title || !content || !target) throw ApiError.badRequest("title, content and target are required");

    // Manager can only create dept announcements for own dept
    if (user?.role === "manager" && target === "all") {
      throw ApiError.forbidden("Managers can only create department announcements");
    }

    const announcement = await Announcement.create({
      title,
      content,
      target,
      department: target === "department" ? (department || user.department) : undefined,
      priority: priority || "normal",
      publishedAt: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      createdBy: user.mongoId || user.id,
    });

    return ApiResponse.sendSuccess(res, 201, "Announcement created", announcement);
  } catch (e) { next(e); }
});

// PUT update announcement (admin or manager)
router.put("/:id", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, target, department, priority, expiryDate } = req.body;
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, target, department: target === "department" ? department : undefined, priority, expiryDate: expiryDate ? new Date(expiryDate) : undefined },
      { new: true, runValidators: true }
    );
    if (!updated) throw ApiError.notFound("Announcement not found");
    return ApiResponse.sendSuccess(res, 200, "Announcement updated", updated);
  } catch (e) { next(e); }
});

// DELETE announcement (admin only)
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) throw ApiError.notFound("Announcement not found");
    return ApiResponse.sendSuccess(res, 200, "Announcement deleted", null);
  } catch (e) { next(e); }
});

export default router;
