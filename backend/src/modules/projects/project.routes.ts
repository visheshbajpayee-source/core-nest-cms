import { Router } from "express";
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "./project.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation";

const router: Router = Router();

router.use(protect);

router.post(
  "/",
  authorize("admin", "manager"),
  validate(createProjectSchema),
  createProjectController
);

router.get("/", authorize("admin", "manager"), getProjectsController);

router.get("/:id", authorize("admin", "manager"), getProjectController);

router.put(
  "/:id",
  authorize("admin", "manager"),
  validate(updateProjectSchema),
  updateProjectController
);

router.delete(
  "/:id",
  authorize("admin", "manager"),
  deleteProjectController
);

export default router;
