import express from "express";
import { TutorController } from "./tutor.controller";
import { authMiddleware, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", TutorController.getAllTutors);
router.get(
  "/:tutorId",
  authMiddleware(UserRole.TUTOR),
  TutorController.getTutorDetails,
);
router.get(
  "/reviews/me",
  authMiddleware(UserRole.TUTOR),
  TutorController.getTutorReviews,
);

export const TutorRoutes = router;
