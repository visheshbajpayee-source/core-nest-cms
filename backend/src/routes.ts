import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import designationRoutes from "./modules/designation/designation.routes";
import departmentRoutes from "./modules/department/department.routes";

const router: Router = Router();

router.use("/designations", designationRoutes);
router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);

export default router;
