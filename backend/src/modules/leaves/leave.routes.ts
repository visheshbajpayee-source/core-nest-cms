<<<<<<< HEAD
import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { applyLeaveController } from "./leave.controller";
import { authorize } from "../../common/middlewares/role.middleware";
import { updateLeaveStatusController } from "./leave.controller";
import { getMyLeavesController } from "./leave.controller";
import {getAllLeavesController} from "./leave.controller";
const router: Router = Router();

router.post("/", protect, applyLeaveController);
router.get("/me", protect, getMyLeavesController)

router.get(
  "/",
  protect,
  authorize("admin"),
getAllLeavesController
);
router.patch(
  "/:id",
  protect,
  authorize("admin", "manager"),
  updateLeaveStatusController
)
export default router;
=======
import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { applyLeaveController } from "./leave.controller";
import { authorize } from "../../common/middlewares/role.middleware";
import { updateLeaveStatusController } from "./leave.controller";
import { getMyLeavesController } from "./leave.controller";
import {getAllLeavesController} from "./leave.controller";
const router: Router = Router();

router.post("/", protect, applyLeaveController);
router.get("/me", protect, getMyLeavesController)

router.get(
  "/",
  protect,
  authorize("admin"),
getAllLeavesController
);
router.patch(
  "/:id",
  protect,
  authorize("admin", "manager"),
  updateLeaveStatusController
)
export default router;
>>>>>>> 66cf4dbc786a79629489e24c2d9cddb19660c10a
