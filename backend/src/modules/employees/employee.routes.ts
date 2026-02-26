import { Router } from "express";
import {
  createEmployeeController,
  getEmployeesController,
  getEmployeeController,
  updateEmployeeController,
  deleteEmployeeController,
} from "./employee.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// Create employee (admin only)
router.post("/", protect, authorize("admin"), createEmployeeController);

// Get all (admin + manager)
router.get("/", protect, authorize("admin", "manager"), getEmployeesController);

// Get own profile
router.get("/me", protect, (req, res, next) => {
	const r: any = req;
	r.params = r.params || {};
	r.params.id = r.user?.id;
	return getEmployeeController(req as any, res, next);
});

// Update own profile (limited fields by role checks in controller)
router.put("/me", protect, (req, res, next) => {
	const r: any = req;
	r.params = r.params || {};
	r.params.id = r.user?.id;
	return updateEmployeeController(req as any, res, next);
});

// Get by id (admin, manager or owner via controller checks)
router.get("/:id", protect, authorize("admin", "manager", "employee"), getEmployeeController);

// Update (admin for general; employee for their own limited fields)
router.put("/:id", protect, authorize("admin", "manager", "employee"), updateEmployeeController);

// Delete (admin only)
router.delete("/:id", protect, authorize("admin"), deleteEmployeeController);

export default router;
