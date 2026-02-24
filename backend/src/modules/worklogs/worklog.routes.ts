import { Router } from "express";
import {
  createWorkLogController,
  getWorkLogsController,
  getWorkLogController,
  updateWorkLogController,
  deleteWorkLogController,
  dailySummaryController,
} from "./worklog.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

router.post("/", protect, createWorkLogController);

// Employee: own logs; Admin/Manager: all (controller handles further checks)
router.get("/", protect, authorize("admin", "manager"), getWorkLogsController);
router.get("/me", protect, getWorkLogsController);

router.get("/summary/:employeeId", protect, dailySummaryController);

router.get("/:id", protect, getWorkLogController);
router.put("/:id", protect, updateWorkLogController);
router.delete("/:id", protect, deleteWorkLogController);

export default router;
