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
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// Create employee (admin only)
router.post("/",  createEmployeeController);

// Get all (admin + manager)
router.get("/",  getEmployeesController);

// Get own profile
router.get("/me",  (req, res, next) => {
	const r: any = req;
	r.params = r.params || {};
	r.params.id = r.user?.id;
	return getEmployeeController(req as any, res, next);
});

// Get by id (admin, manager or owner via controller checks)
router.get("/:id", getEmployeeController);

// Update (admin for general; employee for their own limited fields)
router.put("/:id", updateEmployeeController);

// Delete (admin only)
router.delete("/:id",  deleteEmployeeController);

export default router;