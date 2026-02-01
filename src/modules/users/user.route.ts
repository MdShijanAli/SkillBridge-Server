import express from "express";
import { UserController } from "./user.controller";
import { authMiddleware, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", authMiddleware(UserRole.ADMIN), UserController.getAllUsers);

router.put(
  "/:userId",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  UserController.updateUser,
);
router.get(
  "/:userId",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  UserController.getUserDetails,
);
router.patch(
  "/:userId/status",
  authMiddleware(UserRole.ADMIN),
  UserController.changeUserStatus,
);
router.patch(
  "/:userId/ban",
  authMiddleware(UserRole.ADMIN),
  UserController.bannedUser,
);
router.delete(
  "/:userId",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  UserController.deleteUser,
);

export const UserRoutes = router;
