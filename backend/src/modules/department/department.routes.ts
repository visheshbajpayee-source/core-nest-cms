import { Router } from "express";
import * as departmentController from "./department.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "./department.validation";

const router:Router = Router();

/**
 * Admin Only Routes
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(createDepartmentSchema),
  departmentController.createDepartment
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateDepartmentSchema),
  departmentController.updateDepartment
);

router.patch(
  "/:id/deactivate",
  protect,
  authorize("admin"),
  departmentController.deactivateDepartment
);

/**
 * Accessible to all authenticated users
 */
router.get(
  "/",
  protect,
  departmentController.getAllDepartments
);

router.get(
  "/:id",
  protect,
  departmentController.getDepartmentById
);

export default router;