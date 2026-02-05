import express from "express";
import { ReviewController } from "./reviews.controller";
import { authMiddleware, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UserRole.STUDENT),
  ReviewController.CreateReview,
);

export const ReviewRoutes = router;
