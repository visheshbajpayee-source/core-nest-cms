import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { applyLeaveController } from "./leave.controller";
import { authorize } from "../../common/middlewares/role.middleware";
import { updateLeaveStatusController } from "./leave.controller";
import { getMyLeavesController } from "./leave.controller";
import { getAllLeavesController } from "./leave.controller";
const router: Router = Router();

router.post("/", protect, applyLeaveController);
router.get("/me", protect, getMyLeavesController);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllLeavesController
);

// Update leave status (both PATCH and PUT for backward compatibility)
router.patch(
  "/:id",
  protect,
  authorize("admin", "manager"),
  updateLeaveStatusController
);

// Approve leave endpoint
router.put(
  "/:id/approve",
  protect,
  authorize("admin", "manager"),
  async (req, res, next) => {
    (req.body as any).status = "approved";
    return updateLeaveStatusController(req, res, next);
  }
);

// Reject leave endpoint
router.put(
  "/:id/reject",
  protect,
  authorize("admin", "manager"),
  async (req, res, next) => {
    (req.body as any).status = "rejected";
    return updateLeaveStatusController(req, res, next);
  }
);

export default router;
