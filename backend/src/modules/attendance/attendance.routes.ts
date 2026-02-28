<<<<<<< HEAD
import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  getMyAttendanceController,
  getAttendanceController,
  updateAttendanceController,
  createAttendanceController,
  checkoutAttendanceController,
  getMonthlySummaryController,
} from "./attendance.controller";
import { manualAttendanceSchema, updateAttendanceSchema } from "./attendance.validation";

const router: Router = Router();

router.get("/me", protect, getMyAttendanceController);
router.get("/summary", protect, getMonthlySummaryController);
router.get("/", protect, authorize("admin", "manager"), getAttendanceController);
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(manualAttendanceSchema),
  createAttendanceController
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateAttendanceSchema),
  updateAttendanceController
);
router.post("/checkout", protect, checkoutAttendanceController);

=======
// 
import { Router } from "express";
import {protect} from "../../common/middlewares/auth.middleware";
import {authorize} from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  getMyAttendanceController,
  getAttendanceController,
  updateAttendanceController,
  checkoutAttendanceController,
  getMonthlySummaryController,
} from "./attendance.controller";
import { checkInAttendanceController } from "./attendance.controller";

import { updateAttendanceSchema } from "./attendance.validation";

const router: Router = Router();

/*
 * GET /api/v1/attendance/me
 * Logged-in user can view their own attendance
 */
router.get("/me", protect, getMyAttendanceController);
router.post("/checkin", protect,  checkInAttendanceController);

router.get(
  "/summary",
  protect,
  getMonthlySummaryController
);
/*
 * GET /api/v1/attendance
 * Admin & Manager can view attendance
 */
router.get(
  "/",
  protect,
  authorize("admin", "manager"),
  getAttendanceController
);
/*
 * PATCH /api/v1/attendance/:id
 * Admin can manually update attendance
 */
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateAttendanceSchema),
  updateAttendanceController
);

/*
 * POST /api/v1/attendance/checkout
 * Logged-in user checkout
 */
router.post(
  "/checkout",
  protect,
  checkoutAttendanceController
);

>>>>>>> 66cf4dbc786a79629489e24c2d9cddb19660c10a
export default router;