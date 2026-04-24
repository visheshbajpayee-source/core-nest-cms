import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { resetAllLeaveBalancesController } from "./leaveBalance.controller";
import {
  getMyLeaveBalancesController,
} from "./leaveBalance.controller";

const router:Router = Router();
router.get("/me", protect, getMyLeaveBalancesController);
router.post("/reset-all", resetAllLeaveBalancesController);

export default router;
