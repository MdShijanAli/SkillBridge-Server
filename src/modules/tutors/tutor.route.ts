import express from "express";
import { TutorController } from "./tutor.controller";

const router = express.Router();

router.get("/", TutorController.getAllTutors);
router.get("/:tutorId", TutorController.getTutorDetails);

export const TutorRoutes = router;
