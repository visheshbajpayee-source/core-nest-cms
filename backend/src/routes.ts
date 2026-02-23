import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";

const router: Router = Router();

router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);

export default router;
