import express, { type Application } from "express";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import {
  betterAuthMiddleware,
  betterAuthErrorHandler,
} from "./middlewares/betterAuthErrorHandler";
import { UserRoutes } from "./modules/users/user.route";
import { CategoryRoutes } from "./modules/categories/category.route";
import { AvailabilityRoutes } from "./modules/availability/availability.route";
import { TutorProfileRoutes } from "./modules/tutor-profile/tutor-profile.route";
import { TutorRoutes } from "./modules/tutors/tutor.route";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", betterAuthMiddleware, async (req, res, next) => {
  try {
    await toNodeHandler(auth)(req, res);
  } catch (error: any) {
    betterAuthErrorHandler(error, req, res, next);
  }
});

app.use("/api/users", UserRoutes);
app.use("/api/tutors", TutorRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/availabilities", AvailabilityRoutes);
app.use("/api/tutor-profiles", TutorProfileRoutes);

app.use("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Blog Management API");
});

app.use(errorHandler);
app.use(notFoundHandler);
export const PORT = process.env.PORT || 5000;

export default app;
