import express from "express";
import { SubjectController } from "./subject.controller";

const router = express.Router();

router.get("/popular", SubjectController.getAllPopularSubjects);

export const SubjectRoutes = router;
