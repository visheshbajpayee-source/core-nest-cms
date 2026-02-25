import { Router, Request, Response, NextFunction } from "express";
import { Designation } from "./designation.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all designations (admin + manager)
router.get("/", protect, authorize("admin", "manager"), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const designations = await Designation.find().lean();
    return ApiResponse.sendSuccess(res, 200, "Designations fetched", designations);
  } catch (e) { next(e); }
});

// GET single designation
router.get("/:id", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const desig = await Designation.findById(req.params.id).lean();
    if (!desig) throw ApiError.notFound("Designation not found");
    return ApiResponse.sendSuccess(res, 200, "Designation fetched", desig);
  } catch (e) { next(e); }
});

// POST create designation (admin only)
router.post("/", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    if (!title) throw ApiError.badRequest("Designation title is required");
    const desig = await Designation.create({ title, description });
    return ApiResponse.sendSuccess(res, 201, "Designation created", desig);
  } catch (e) { next(e); }
});

// PUT update designation (admin only)
router.put("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const desig = await Designation.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );
    if (!desig) throw ApiError.notFound("Designation not found");
    return ApiResponse.sendSuccess(res, 200, "Designation updated", desig);
  } catch (e) { next(e); }
});

// DELETE designation (admin only)
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const desig = await Designation.findByIdAndDelete(req.params.id);
    if (!desig) throw ApiError.notFound("Designation not found");
    return ApiResponse.sendSuccess(res, 200, "Designation deleted", null);
  } catch (e) { next(e); }
});

export default router;
