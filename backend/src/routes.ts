import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes"; 

const router: Router = Router();

router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);


export default router;
