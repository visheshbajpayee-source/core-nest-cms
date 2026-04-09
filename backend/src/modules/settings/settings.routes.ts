import { Router } from "express";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { upload } from "../../common/middlewares/upload.middleware";
import {
  changePasswordController,
  getSystemSettingsController,
  getUserSettingsController,
  updateNotificationPreferencesController,
  updateProfilePictureController,
  updateSystemSettingsController,
} from "./settings.controller";
import {
  changePasswordSchema,
  updateNotificationPreferencesSchema,
  updateProfilePictureSchema,
  updateSystemSettingsSchema,
} from "./settings.validation";

const router: Router = Router();

router.use(protect);

// System settings (admin only)
router.get("/system", authorize("admin"), getSystemSettingsController);

router.put(
  "/system",
  authorize("admin"),
  validate(updateSystemSettingsSchema),
  updateSystemSettingsController
);

// User settings (current authenticated user)
router.get("/me", getUserSettingsController);

router.put(
  "/me/password",
  validate(changePasswordSchema),
  changePasswordController
);

router.put(
  "/me/profile-picture",
  upload.single("profilePicture"),
  updateProfilePictureController
);

router.put(
  "/me/notifications",
  validate(updateNotificationPreferencesSchema),
  updateNotificationPreferencesController
);

export default router;
