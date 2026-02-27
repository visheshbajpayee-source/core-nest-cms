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
>>>>>>> 99de3b1a199ee6fcea29f8a3e9ae1c00449a3d3f
