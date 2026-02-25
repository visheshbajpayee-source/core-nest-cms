import { Router } from "express";
import {
  createAnnouncementController,
  getAnnouncementsController,
  getArchivedAnnouncementsController,
} from "./announcement.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router = Router();

// Create: admin (all) or manager (department)
router.post("/", protect, authorize("admin", "manager"), createAnnouncementController);

// Get active announcements (for current user)
router.get("/", protect, getAnnouncementsController);

// Archived (expired) announcements
router.get("/archive", protect, getArchivedAnnouncementsController);

export default router;
