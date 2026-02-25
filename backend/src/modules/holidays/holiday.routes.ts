import { Router, Request, Response, NextFunction } from "express";
import { Holiday } from "./holiday.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all holidays (all authenticated users)
router.get("/", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year } = req.query;
    const query: any = {};
    if (year) {
      const y = Number(year);
      query.date = { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59) };
    }
    const holidays = await Holiday.find(query).sort({ date: 1 }).lean();
    return ApiResponse.sendSuccess(res, 200, "Holidays fetched", holidays);
  } catch (e) { next(e); }
});

// POST create holiday (admin only)
router.post("/", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, date, description, type } = req.body;
    if (!name || !date) throw ApiError.badRequest("name and date are required");
    const holiday = await Holiday.create({
      name,
      date: new Date(date),
      description,
      type: type || "company",
    });
    return ApiResponse.sendSuccess(res, 201, "Holiday created", holiday);
  } catch (e) { next(e); }
});

// PUT update holiday (admin only)
router.put("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, date, description, type } = req.body;
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.id,
      { name, date: date ? new Date(date) : undefined, description, type },
      { new: true, runValidators: true }
    );
    if (!holiday) throw ApiError.notFound("Holiday not found");
    return ApiResponse.sendSuccess(res, 200, "Holiday updated", holiday);
  } catch (e) { next(e); }
});

// DELETE holiday (admin only)
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) throw ApiError.notFound("Holiday not found");
    return ApiResponse.sendSuccess(res, 200, "Holiday deleted", null);
  } catch (e) { next(e); }
});

export default router;
