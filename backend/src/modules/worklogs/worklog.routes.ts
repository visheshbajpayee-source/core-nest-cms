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


const router: Router = Router({ mergeParams: true });

// POST /worklogs or POST /:employeeId/worklogs
router.post("/", protect, createWorkLogController);

// GET /worklogs or GET /:employeeId/worklogs
router.get("/", protect, getWorkLogsController);

// shorthand for own logs
router.get("/me", protect, (req, res, next) => {
  const r: any = req;
  r.query = r.query || {};
  r.query.employee = r.user?.id;
  return getWorkLogsController(req as any, res, next);
});

// Daily summary (mounted route provides employeeId param when used)
router.get("/summary", protect, dailySummaryController);
router.get("/me/summary", protect, (req, res, next) => {
  const r: any = req;
  r.query = r.query || {};
  r.query.employeeId = r.user?.id;
  return dailySummaryController(req as any, res, next);
});

router.get("/:id", protect, getWorkLogController);
router.put("/:id", protect, updateWorkLogController);
router.delete("/:id", protect, deleteWorkLogController);

export default router;
