import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

import {
  createLeaveTypeController,
  getLeaveTypesController,
  updateLeaveTypeController,
  disableLeaveTypeController,
} from "./leaveType.controller";

const router: Router = Router();

/**
 * Admin only routes
 */
router.post("/", protect, authorize("admin"), createLeaveTypeController);
router.patch("/:id", protect, authorize("admin"), updateLeaveTypeController);
router.delete("/:id", protect, authorize("admin"), disableLeaveTypeController);

/**
 * All authenticated users
 */
router.get("/", protect, getLeaveTypesController);

export default router;