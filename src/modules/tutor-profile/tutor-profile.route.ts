import express from "express";
import { TutorProfileController } from "./tutor-profile.controller";
import { authMiddleware, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UserRole.TUTOR),
  TutorProfileController.createTutorProfile,
);
router.put(
  "/",
  authMiddleware(UserRole.TUTOR),
  TutorProfileController.updateTutorProfile,
);
router.get(
  "/",
  authMiddleware(UserRole.TUTOR),
  TutorProfileController.getTutorProfile,
);

export const TutorProfileRoutes = router;
