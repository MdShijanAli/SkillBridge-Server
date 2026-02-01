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
router.put(
  "/:id",
  authMiddleware(UserRole.TUTOR),
  AvalablityController.updateAvailabilityService,
);
router.delete(
  "/:id",
  authMiddleware(UserRole.TUTOR),
  AvalablityController.deleteAvailabilityService,
);
router.patch(
  "/:id/status",
  authMiddleware(UserRole.TUTOR),
  AvalablityController.changeStatusService,
);

export const AvailabilityRoutes = router;
