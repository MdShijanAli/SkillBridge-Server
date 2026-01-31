import express from "express";
import { AvalablityController } from "./availability.controller";
import { authMiddleware, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UserRole.TUTOR),
  AvalablityController.createAvailabilityService,
);
router.get("/", AvalablityController.getAllAvailabilities);

export const AvailabilityRoutes = router;
