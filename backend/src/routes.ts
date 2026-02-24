import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import projectRoutes from "./modules/projects/project.routes";

const router: Router = Router();

router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/projects", projectRoutes);

export default router;
