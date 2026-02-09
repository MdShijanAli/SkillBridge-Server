import express from "express";
import { CategoryController } from "./category.controller";
import {
  authMiddleware,
  optionalAuthMiddleware,
  UserRole,
} from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR),
  CategoryController.createCategory,
);
router.get("/", optionalAuthMiddleware, CategoryController.getAllCategories);
router.get("/:categoryId", CategoryController.getCategoryById);
router.put(
  "/:categoryId",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR),
  CategoryController.updateCategory,
);
router.delete(
  "/:categoryId",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR),
  CategoryController.deleteCategory,
);
router.patch(
  "/:categoryId/status",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR),
  CategoryController.changeCategoryStatus,
);

export const CategoryRoutes = router;
