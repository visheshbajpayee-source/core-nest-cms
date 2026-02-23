import { Router } from "express";
import {
	createEmployeeController,
	getEmployeesController,
	getEmployeeController,
	updateEmployeeController,
	deleteEmployeeController,
} from "./employee.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import { createEmployeeSchema } from "./employee.validation";
import authenticate from "../../common/middlewares/auth.middleware";
import authorize from "../../common/middlewares/role.middleware";

const router: Router = Router();

// Create employee (admin only)
router.post("/", authenticate, authorize("admin"), validate(createEmployeeSchema), createEmployeeController);

// Get all (admin + manager)
router.get("/", authenticate, authorize("admin", "manager"), getEmployeesController);

// Get own profile
router.get("/me", authenticate, (req, res, next) => {
	const user = (req as any).user;
	return getEmployeeController({ params: { id: user.id } } as any, res, next);
});

// Get by id (admin, manager or owner via controller checks)
router.get("/:id", authenticate, getEmployeeController);

// Update (admin for general; employee for their own limited fields)
router.put("/:id", authenticate, updateEmployeeController);

// Delete (admin only)
router.delete("/:id", authenticate, authorize("admin"), deleteEmployeeController);

export default router;