import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import {
  employeeReportController,
  departmentReportController,
  projectReportController,
} from "./reports.controller";

const router: Router = Router();

// GET /reports/employee?employeeId=&start=&end=
router.get("/employee", protect, employeeReportController);

// GET /reports/department?departmentId=&start=&end=
router.get("/department", protect, departmentReportController);

// GET /reports/project?projectId=&start=&end=
router.get("/project", protect, projectReportController);

export default router;
