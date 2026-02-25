import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  createDocumentController,
  deleteDocumentController,
  getDocumentController,
  getDocumentsController,
  updateDocumentController,
} from "./documents.controller";
import {
  createDocumentSchema,
  updateDocumentSchema,
} from "./documents.validation";

const router: Router = Router();

router.use(protect);

router.post(
  "/",
  authorize("admin", "employee"),
  validate(createDocumentSchema),
  createDocumentController
);

router.get("/", authorize("admin", "manager", "employee"), getDocumentsController);
router.get("/:id", authorize("admin", "manager", "employee"), getDocumentController);

router.put(
  "/:id",
  authorize("admin", "employee"),
  validate(updateDocumentSchema),
  updateDocumentController
);

router.delete("/:id", authorize("admin", "employee"), deleteDocumentController);

export default router;
