import { Router } from "express";
import authenticate from "../../common/middlewares/auth.middleware";
import authorize from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";

import {
  getMyAttendanceController,
  getAttendanceController,
  updateAttendanceController,
  addAttendance,
} from "./attendance.controller";

import { updateAttendanceSchema } from "./attendance.validation";

const router: Router = Router();

/**
 * GET /api/v1/attendance/me
 * Logged-in user can view their own attendance
 */
router.get(
  "/me",
  authenticate,
  getMyAttendanceController
);

/**
 * GET /api/v1/attendance
 * Admin and Manager can view attendance
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "manager"),
  getAttendanceController
);

/**
 * PATCH /api/v1/attendance/:id
 * Admin can manually update attendance
 */
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateAttendanceSchema),
  updateAttendanceController
);
/**
 * PATCH /api/v1/attendance/:id
 * Admin can manually update attendance
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(updateAttendanceSchema),
  addAttendance
);

export default router;