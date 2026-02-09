import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { formatResultWithPagination } from "../../utils/formatResult";

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    console.error("Error creating category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = "", filter = "" } = req.query;
  try {
    const categories = await CategoryService.getAllCategories({
      page: Number(page),
      pageSize: Number(limit),
      search: String(search),
      filter: String(filter),
      userRole: req.user?.role,
    });
    formatResultWithPagination(
      res,
      categories.data,
      "Categories fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: categories.total,
      },
      "/categories",
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      data: null,
    });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryService.getCategoryById(Number(categoryId));
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Category details fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category details",
      data: null,
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryService.updateCategory(
      Number(categoryId),
      req.body,
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    console.error("Error updating category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryService.deleteCategory(Number(categoryId));
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: null,
    });
  } catch (error: any) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const changeCategoryStatus = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { isActive } = req.body;
  const requestedUser = req.user;
  try {
    const updatedCategory = await CategoryService.changeCategoryStatus(
      Number(categoryId),
      Boolean(isActive),
      requestedUser,
    );
    res.status(200).json({
      success: true,
      message: "Category status updated successfully",
      data: updatedCategory,
    });
  } catch (error: any) {
    console.error("Error updating category status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update category status",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

export const CategoryController = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus,
};
