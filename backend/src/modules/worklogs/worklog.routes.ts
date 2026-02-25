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


const router: Router = Router({ mergeParams: true });

// POST /worklogs or POST /:employeeId/worklogs
router.post("/", protect, createWorkLogController);

// GET /worklogs or GET /:employeeId/worklogs
router.get("/", protect, getWorkLogsController);

// shorthand for employee own logs when token user requests their own id
router.get("/me", protect, getWorkLogsController);

// Daily summary (mounted route provides employeeId param when used)
router.get("/summary", protect, dailySummaryController);

router.get("/:id", protect, getWorkLogController);
router.put("/:id", protect, updateWorkLogController);
router.delete("/:id", protect, deleteWorkLogController);

export default router;
