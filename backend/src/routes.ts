import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import worklogRoutes from "./modules/worklogs/worklog.routes";

const router: Router = Router();

router.use("/login", authRoutes);
router.use("/employees", employeeRoutes);
// Keep existing top-level worklogs route
router.use("/worklogs", worklogRoutes);

// Mount worklogs under employee id: /:employeeId/worklogs
router.use("/:employeeId/worklogs", worklogRoutes);

export default router;
