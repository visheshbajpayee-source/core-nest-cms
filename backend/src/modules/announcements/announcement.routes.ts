import { Router } from "express";
import {
  createAnnouncementController,
  getAnnouncementsController,
  getArchivedAnnouncementsController,
  deleteAnnouncementController,
  updateAnnouncementController,
} from "./announcement.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// Routes for announcements
// POST / - create an announcement. Allowed roles: admin (can create org-wide) and manager (department only)
router.post("/", protect, authorize("admin", "manager"), createAnnouncementController);

// GET / - fetch active announcements relevant to the authenticated user
router.get("/", protect, getAnnouncementsController);

// GET /archive - fetch expired/archived announcements relevant to the authenticated user
router.get("/archive", protect, getArchivedAnnouncementsController);

router.delete('/:id', protect, authorize("admin"), deleteAnnouncementController);

router.patch('/:id',protect,authorize('admin'),updateAnnouncementController);
export default router;
