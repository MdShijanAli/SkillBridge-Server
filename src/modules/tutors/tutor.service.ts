import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const getAllTutors = async ({
  page,
  pageSize,
  search,
  categoryId,
}: {
  page: number;
  pageSize: number;
  search: string;
  categoryId?: number;
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

  // Filter by category if provided
  if (categoryId) {
    whereClause.tutorProfile = {
      categories: {
        some: {
          categoryId: categoryId,
        },
      },
    };
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
    orderBy: {
      createdAt: "desc",
    },
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
  const tutor = await prisma.user.findFirst({
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
          availability: true,
        },
      },
      receivedReviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return tutor;
};

export const TutorService = {
  getAllTutors,
  getTutorById,
};
