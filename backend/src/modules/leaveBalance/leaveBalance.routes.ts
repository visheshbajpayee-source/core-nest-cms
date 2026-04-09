import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { getLeaveBalanceController } from "./leaveBalance.controller";

const router: Router = Router();

router.get("/", protect, getLeaveBalanceController);

export default router;