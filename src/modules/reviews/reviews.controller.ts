import { Request, Response } from "express";
import { ReviewService } from "./reviews.services";

const CreateReview = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  try {
    const review = await ReviewService.CreateReview(req.body, requestedUser);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create review",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

export const ReviewController = {
  CreateReview,
};
