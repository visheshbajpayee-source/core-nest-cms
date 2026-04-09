import { Router } from "express";
import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from "./task.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "./task.validation";

const router: Router = Router();

router.use(protect);

// Create task (admin and manager only)
router.post(
  "/",
  authorize("admin", "manager"),
  validate(createTaskSchema),
  createTaskController
);

// Get all tasks (role-based visibility)
router.get("/", getTasksController);

// Get single task
router.get("/:id", getTaskController);

// Update task (all roles but with restrictions)
router.put("/:id", validate(updateTaskSchema), updateTaskController);

// Delete task (admin and manager only)
router.delete("/:id", authorize("admin", "manager"), deleteTaskController);

export default router;
