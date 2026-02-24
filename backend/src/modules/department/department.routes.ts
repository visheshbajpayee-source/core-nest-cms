import { Router, Request, Response, NextFunction } from "express";
import { Department } from "./department.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all departments  (admin + manager)
router.get("/", protect, authorize("admin", "manager"), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await Department.find().populate("head", "fullName email employeeId").lean();
    return ApiResponse.sendSuccess(res, 200, "Departments fetched", departments);
  } catch (e) { next(e); }
});

// GET single department
router.get("/:id", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dept = await Department.findById(req.params.id).populate("head", "fullName email employeeId").lean();
    if (!dept) throw ApiError.notFound("Department not found");
    return ApiResponse.sendSuccess(res, 200, "Department fetched", dept);
  } catch (e) { next(e); }
});

// POST create department (admin only)
router.post("/", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, head } = req.body;
    if (!name) throw ApiError.badRequest("Department name is required");
    const dept = await Department.create({ name, description, head: head || undefined });
    return ApiResponse.sendSuccess(res, 201, "Department created", dept);
  } catch (e) { next(e); }
});

// PUT update department (admin only)
router.put("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, head } = req.body;
    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, head: head || undefined },
      { new: true, runValidators: true }
    ).populate("head", "fullName email employeeId");
    if (!dept) throw ApiError.notFound("Department not found");
    return ApiResponse.sendSuccess(res, 200, "Department updated", dept);
  } catch (e) { next(e); }
});

// DELETE department (admin only)
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) throw ApiError.notFound("Department not found");
    return ApiResponse.sendSuccess(res, 200, "Department deleted", null);
  } catch (e) { next(e); }
});

export default router;
