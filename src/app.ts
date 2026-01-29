import express, { type Application } from "express";
import dotenv from "dotenv";
// import { PostRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
// import { CommentRouter } from "./modules/comment/comment.route";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFound";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));

// app.use("/posts", PostRouter);
// app.use("/comments", CommentRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Blog Management API");
});

app.use(errorHandler);
app.use(notFoundHandler);
export const PORT = process.env.PORT || 5000;

export default app;
