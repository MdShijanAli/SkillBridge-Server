import express from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware(UserRole.STUDENT),
  DashboardController.GetStudentDashboardStats,
);
router.get(
  "/tutor-stats",
  authMiddleware(UserRole.TUTOR),
  DashboardController.getTutorDashboardStats,
);
router.get(
  "/admin-stats",
  authMiddleware(UserRole.ADMIN),
  DashboardController.GetAdminDashboardStats,
);

export const DashboardRoutes = router;
