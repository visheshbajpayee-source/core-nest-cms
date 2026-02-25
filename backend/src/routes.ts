import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes"; 
import designationRoutes from "./modules/designation/designation.routes";
import departmentRoutes from "./modules/department/department.routes";
import worklogRoutes from "./modules/worklogs/worklog.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";
import documentRoutes from "./modules/documents/documents.routes";


const router: Router = Router();

router.use("/designations", designationRoutes);
router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);

router.use("/departments", departmentRoutes);
// Keep existing top-level worklogs route
router.use("/worklogs", worklogRoutes);

// Mount worklogs under employee id: /:employeeId/worklogs
router.use("/:employeeId/worklogs", worklogRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/documents", documentRoutes);
router.use("/attendance", attendanceRoutes);


export default router;
