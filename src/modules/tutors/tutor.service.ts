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
  is_featured,
}: {
  page: number;
  pageSize: number;
  search: string;
  categoryId?: number;
  minPrice: number;
  maxPrice: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  is_featured?: string | boolean;
}) => {
  const whereClause: any = {
    role: UserRole.TUTOR,
    is_active: true,
    is_banned: false,
  };

  const tutorProfileConditions: any = {};

  if (categoryId) {
    tutorProfileConditions.categories = {
      some: {
        categoryId: categoryId,
      },
    };
  }

  if (is_featured !== undefined) {
    tutorProfileConditions.isFeatured =
      is_featured === "true" || is_featured === true;
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    tutorProfileConditions.hourlyRate = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  // Apply tutorProfile conditions if any exist
  if (Object.keys(tutorProfileConditions).length > 0) {
    whereClause.tutorProfile = tutorProfileConditions;
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

  let filteredTutors = tutors;
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filteredTutors = tutors.filter((tutor) => {
      const matchesBasicFields =
        tutor.name?.toLowerCase().includes(searchLower) ||
        tutor.email?.toLowerCase().includes(searchLower) ||
        tutor.bio?.toLowerCase().includes(searchLower) ||
        tutor.location?.toLowerCase().includes(searchLower);

      const matchesSubjects =
        tutor.tutorProfile?.subjects?.some((subject) =>
          subject.toLowerCase().includes(searchLower),
        ) || false;

      return matchesBasicFields || matchesSubjects;
    });
  }

  const total = filteredTutors.length;
  const paginatedTutors = filteredTutors.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return {
    data: paginatedTutors,
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
      receivedReviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        where: {
          isPublic: true,
        },
        orderBy: {
          createdAt: "desc",
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
