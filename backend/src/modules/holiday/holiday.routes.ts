import { Router } from "express";
import * as holidayController from "./holiday.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  createHolidaySchema,
  updateHolidaySchema,
} from "./holiday.validation";

const router: Router = Router();

/**
 * Admin Only
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(createHolidaySchema),
  holidayController.createHoliday
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateHolidaySchema),
  holidayController.updateHoliday
);

router.patch(
  "/:id/deactivate",
  protect,
  authorize("admin"),
  holidayController.deactivateHoliday
);

/**
 * All Authenticated
 */
router.get("/", protect, holidayController.getAllHolidays);
router.get("/:id", protect, holidayController.getHolidayById);

export default router;