import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  getMyAttendanceController,
  getAttendanceController,
  updateAttendanceController,
  checkoutAttendanceController,
  getMonthlySummaryController,
} from "./attendance.controller";
import { updateAttendanceSchema } from "./attendance.validation";

const router: Router = Router();

router.get("/me", protect, getMyAttendanceController);
router.get("/summary", protect, getMonthlySummaryController);
router.get("/", protect, authorize("admin", "manager"), getAttendanceController);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateAttendanceSchema),
  updateAttendanceController
);
router.post("/checkout", protect, checkoutAttendanceController);

export default router;
