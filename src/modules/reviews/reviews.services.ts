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

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: data.tutorId },
  });

  if (tutorProfile) {
    const reviewStats = await prisma.review.aggregate({
      where: { tutorId: data.tutorId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const totalReviews = reviewStats._count.id;
    const averageRating = reviewStats._avg.rating || 0;

    await prisma.tutorProfile.update({
      where: { userId: data.tutorId },
      data: {
        totalReviews,
        averageRating: Number(averageRating.toFixed(2)),
      },
    });
  }

  return review;
};

export const ReviewService = {
  CreateReview,
};
