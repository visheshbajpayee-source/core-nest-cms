import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";

const router: Router = Router();

router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
