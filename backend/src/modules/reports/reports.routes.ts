import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import {
  employeeReportController,
  departmentReportController,
  projectReportController,
  exportWorklogSummaryCsv,
} from "./reports.controller";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();
router.use(protect);

// GET /reports/employee?employeeId=&start=&end=
router.get("/employee", protect, employeeReportController);

// GET /reports/department?departmentId=&start=&end=
router.get("/department", protect, departmentReportController);

// GET /reports/project?projectId=&start=&end=
router.get("/project", protect, projectReportController);

router.get(
  "/worklogs/summary/export/csv",
  authorize("admin", "manager", "employee"),
  exportWorklogSummaryCsv
);

export default router;
