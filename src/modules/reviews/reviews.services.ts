import { Request } from "express";
import { UserRole } from "../../middlewares/auth";
import { ReviewUncheckedCreateInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const CreateReview = async (
  data: ReviewUncheckedCreateInput,
  requestedUser: Request["user"],
) => {
  console.log("Review Data:", data);
  console.log("Requested User in CreateReview:", requestedUser);
  if (!requestedUser) {
    throw new Error("Please login to create a review.");
  }
  if (requestedUser.role !== UserRole.STUDENT) {
    throw new Error("Only students can create reviews.");
  }

  const reviewData = { ...data, studentId: requestedUser.id };

  const review = await prisma.review.create({
    data: {
      ...reviewData,
    },
  });
  return review;
};

export const ReviewService = {
  CreateReview,
};
