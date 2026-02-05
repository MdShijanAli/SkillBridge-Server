import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const getAllTutors = async ({
  page,
  pageSize,
  search,
  categoryId,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
}: {
  page: number;
  pageSize: number;
  search: string;
  categoryId?: number;
  minPrice: number;
  maxPrice: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const whereClause: any = {
    role: UserRole.TUTOR,
    is_active: true,
    is_banned: false,
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ],
  };

  if (categoryId) {
    whereClause.tutorProfile = {
      categories: {
        some: {
          categoryId: categoryId,
        },
      },
    };
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    whereClause.tutorProfile = {
      ...whereClause.tutorProfile,
      hourlyRate: {
        gte: minPrice,
        lte: maxPrice,
      },
    };
  }

  let orderByClause: any = { createdAt: "desc" };

  if (sortBy && sortOrder) {
    const tutorProfileFields = [
      "hourlyRate",
      "totalReviews",
      "averageRating",
      "yearsExperience",
    ];

    if (tutorProfileFields.includes(sortBy)) {
      orderByClause = {
        tutorProfile: {
          [sortBy]: sortOrder,
        },
      };
    } else {
      orderByClause = {
        [sortBy]: sortOrder,
      };
    }
  }

  const tutors = await prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: whereClause,
    include: {
      tutorProfile: {
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          availability: true,
        },
      },
    },
    orderBy: orderByClause,
  });

  const total = await prisma.user.count({
    where: whereClause,
  });

  return {
    data: tutors,
    total,
  };
};

const getTutorById = async (userId: string) => {
  const tutor = await prisma.user.findUnique({
    where: {
      id: userId,
      role: UserRole.TUTOR,
      is_active: true,
      is_banned: false,
    },
    include: {
      tutorProfile: {
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          availability: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  return tutor;
};

const getTutorReviews = async (requestedUser: Request["user"]) => {
  if (!requestedUser) {
    throw new Error("Please login to view reviews.");
  }
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can view their reviews.");
  }

  const reviews = await prisma.review.findMany({
    where: { tutorId: requestedUser.id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
        },
      },
      booking: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  getTutorReviews,
};
