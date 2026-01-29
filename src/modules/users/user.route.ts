import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.get("/:userId", UserController.getUserDetails);

export const UserRouter = router;
