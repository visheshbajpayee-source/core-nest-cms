import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes"; 
import departmentRoutes from "./modules/department/department.routes";
import designationRoutes from "./modules/designation/designation.routes";
// import attendanceRoutes from "./modules/attendance/attendance.routes";
import leaveRoutes from "./modules/leave/leave.routes";
import worklogRoutes from "./modules/worklogs/worklog.routes";
import announcementRoutes from "./modules/announcements/announcement.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";
import holidayRoutes from "./modules/holidays/holiday.routes";
import documentRoutes from "./modules/documents/document.routes";

const router: Router = Router();

router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);

router.use("/departments", departmentRoutes);
router.use("/designations", designationRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leaves", leaveRoutes);
router.use("/worklogs", worklogRoutes);
router.use("/announcements", announcementRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/holidays", holidayRoutes);
router.use("/documents", documentRoutes);

export default router;
