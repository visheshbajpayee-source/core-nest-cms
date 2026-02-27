import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes"; 
import departmentRoutes from "./modules/department/department.routes";
import designationRoutes from "./modules/designation/designation.routes";
import leaveRoutes from "./modules/leaves/leave.routes";
import worklogRoutes from "./modules/worklogs/worklog.routes";
import announcementRoutes from "./modules/announcements/announcement.routes";
import projectRoutes from "./modules/projects/project.routes";
import reportsRoutes from "./modules/reports/reports.routes";
import taskRoutes from "./modules/tasks/task.routes";
import holidayRoutes from "./modules/holiday/holiday.routes";
import documentRoutes from "./modules/documents/documents.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import leaveTypeRoutes from "./modules/leaveTypes/leaveType.routes";
<<<<<<< HEAD
import leaveRoutes from "./modules/leaves/leave.routes";
import leaveBalanceRoutes from "./modules/leaveBalance/leaveBalance.routes";

=======
import leaveBalanceRoutes from "./modules/leaveBalance/leaveBalance.routes";
>>>>>>> 99de3b1a199ee6fcea29f8a3e9ae1c00449a3d3f
const router: Router = Router();

router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/holidays", holidayRoutes);

router.use("/leave-types", leaveTypeRoutes);
router.use("/leaves", leaveRoutes);
router.use("/leave-balance", leaveBalanceRoutes);
router.use("/departments", departmentRoutes);
// Keep existing top-level worklogs route
router.use("/worklogs", worklogRoutes);

// Mount worklogs under employee id: /:employeeId/worklogs
router.use("/:employeeId/worklogs", worklogRoutes);
router.use("/projects", projectRoutes);
router.use("/reports", reportsRoutes);
router.use("/tasks", taskRoutes);
router.use("/documents", documentRoutes);
router.use("/attendance", attendanceRoutes);

router.use("/settings", settingsRoutes);


router.use("/leave-types", leaveTypeRoutes);
router.use("/leaves", leaveRoutes);
router.use("/departments", departmentRoutes);
router.use("/designations", designationRoutes);
router.use("/worklogs", worklogRoutes);
router.use("/:employeeId/worklogs", worklogRoutes);
router.use("/announcements", announcementRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/documents", documentRoutes);
export default router;
