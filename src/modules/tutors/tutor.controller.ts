import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { formatResultWithPagination } from "../../utils/formatResult";

const getAllTutors = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    categoryId,
    minPrice = 0,
    maxPrice = 200,
    sortBy,
    sortOrder,
  } = req.query;

  try {
    const tutors = await TutorService.getAllTutors({
      page: Number(page),
      pageSize: Number(limit),
      search: String(search),
      categoryId: categoryId ? Number(categoryId) : undefined,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder:
        sortOrder === "asc" || sortOrder === "desc"
          ? (sortOrder as "asc" | "desc")
          : undefined,
    });

    formatResultWithPagination(
      res,
      tutors.data,
      "Tutors fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: tutors.total,
      },
      "/tutors",
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutors",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getTutorDetails = async (req: Request, res: Response) => {
  const { tutorId } = req.params;

  try {
    const tutor = await TutorService.getTutorById(tutorId as string);

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Tutor details fetched successfully",
      data: tutor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getTutorReviews = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  try {
    const response = await TutorService.getTutorReviews(requestedUser);
    res.status(200).json({
      success: true,
      message: "Tutor reviews fetched successfully",
      data: response,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor reviews",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

export const TutorController = {
  getAllTutors,
  getTutorDetails,
  getTutorReviews,
};
