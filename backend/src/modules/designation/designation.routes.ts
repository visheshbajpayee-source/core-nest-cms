import { Router } from "express";
import * as designationController from "./designation.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
    createDesignationSchema,
    updateDesignationSchema,
} from "./designation.validation";

const router: Router = Router();

/**
 * Admin Only Routes
 */
router.post(
    "/",
    protect,
    authorize("admin"),
    validate(createDesignationSchema),
    designationController.createDesignation
);

router.patch(
    "/:id",
    protect,
    authorize("admin"),
    validate(updateDesignationSchema),
    designationController.updateDesignation
);

router.patch(
    "/:id/deactivate",
    protect,
    authorize("admin"),
    designationController.deactivateDesignation
);

/**
 * Accessible to all authenticated users
 */
router.get(
    "/",
    protect,
    designationController.getAllDesignations
);

router.get(
    "/:id",
    protect,
    designationController.getDesignationById
);

export default router;