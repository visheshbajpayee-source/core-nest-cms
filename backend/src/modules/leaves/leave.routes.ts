import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import {
  applyLeaveController,
  getMyLeaveHistoryController,
  updateLeaveStatusController,
} from "./leave.controller";
import { authorize } from "../../common/middlewares/role.middleware";
const router: Router = Router();

router.post("/", protect, applyLeaveController);
router.get("/me", protect, getMyLeaveHistoryController);

router.patch(
  "/:id",
  protect,
  authorize("admin", "manager"),
  updateLeaveStatusController
)
export default router;
