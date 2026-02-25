import { Router, Request, Response, NextFunction } from "express";
import { Project } from "./project.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all projects
router.get("/", protect, authorize("admin", "manager", "employee"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { status } = req.query;
    const query: any = {};
    if (status) query.status = status;

    // Manager sees only their dept projects
    if (user?.role === "manager") query.department = user.department;

    // Employee sees projects where they're a team member
    if (user?.role === "employee") {
      query.teamMembers = user.mongoId || user.id;
    }

    const projects = await Project.find(query)
      .populate("department", "name")
      .populate("teamMembers", "fullName email employeeId")
      .sort({ createdAt: -1 })
      .lean();

    return ApiResponse.sendSuccess(res, 200, "Projects fetched", projects);
  } catch (e) { next(e); }
});

// GET single project
router.get("/:id", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("department", "name")
      .populate("teamMembers", "fullName email employeeId")
      .lean();
    if (!project) throw ApiError.notFound("Project not found");
    return ApiResponse.sendSuccess(res, 200, "Project fetched", project);
  } catch (e) { next(e); }
});

// POST create project (admin + manager)
router.post("/", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { name, description, startDate, expectedEndDate, status, department, teamMembers } = req.body;
    if (!name || !startDate || !expectedEndDate) {
      throw ApiError.badRequest("name, startDate and expectedEndDate are required");
    }

    const deptId = user?.role === "manager" ? user.department : department;
    if (!deptId) throw ApiError.badRequest("department is required");

    const project = await Project.create({
      name, description,
      startDate: new Date(startDate),
      expectedEndDate: new Date(expectedEndDate),
      status: status || "not_started",
      department: deptId,
      teamMembers: teamMembers || [],
    });

    return ApiResponse.sendSuccess(res, 201, "Project created", project);
  } catch (e) { next(e); }
});

// PUT update project (admin + manager)
router.put("/:id", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, startDate, expectedEndDate, status, department, teamMembers } = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name, description,
        startDate: startDate ? new Date(startDate) : undefined,
        expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : undefined,
        status, department, teamMembers,
      },
      { new: true, runValidators: true }
    );
    if (!updated) throw ApiError.notFound("Project not found");
    return ApiResponse.sendSuccess(res, 200, "Project updated", updated);
  } catch (e) { next(e); }
});

// DELETE project (admin only)
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) throw ApiError.notFound("Project not found");
    return ApiResponse.sendSuccess(res, 200, "Project deleted", null);
  } catch (e) { next(e); }
});

export default router;
