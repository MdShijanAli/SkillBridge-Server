import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.get("/:userId", UserController.getUserDetails);
router.patch("/:userId/status", UserController.changeUserStatus);

export const UserRoutes = router;
