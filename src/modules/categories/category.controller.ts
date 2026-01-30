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

export const CategoryController = {
  getAllCategories,
  createCategory,
};
