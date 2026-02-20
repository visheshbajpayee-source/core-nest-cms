import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRouter from "./modules/employees/employee.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRouter)

export default router;
