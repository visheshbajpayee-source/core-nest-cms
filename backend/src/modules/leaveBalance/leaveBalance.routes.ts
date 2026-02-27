import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import {
  getMyLeaveBalancesController,
} from "./leaveBalance.controller";

const router:Router = Router();
router.get("/me", protect, getMyLeaveBalancesController);

export default router;
