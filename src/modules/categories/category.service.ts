import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Category) => {
  const category = await prisma.category.create({
    data,
  });
  return category;
};

const getAllCategories = async ({
  page,
  pageSize,
  search,
  filter,
}: {
  page: number;
  pageSize: number;
  search: string;
  filter: string;
}) => {
  const whereClause: any = {};

  if (search && search.trim()) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const categoriesData = await prisma.category.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: whereClause,
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      _count: {
        select: {
          tutorCategories: true,
        },
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false,
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  const categoriesWithCount = categoriesData.map((category) => ({
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: undefined,
  }));

  const total = await prisma.category.count({
    where: whereClause,
  });

  return { data: categoriesWithCount, total };
};

const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          tutorCategories: true,
        },
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false,
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!category) return null;

  return {
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: undefined,
  };
};

const updateCategory = async (id: number, data: Partial<Category>) => {
  const category = await prisma.category.update({
    where: { id },
    data,
    include: {
      _count: {
        select: {
          tutorCategories: true,
        },
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false,
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  return {
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: undefined,
  };
};

const deleteCategory = async (id: number) => {
  const category = await prisma.category.delete({
    where: { id },
  });
  return category;
};

const changeCategoryStatus = async (
  id: number,
  isActive: boolean,
  requestedUser: any,
) => {
  if (requestedUser.role !== "ADMIN" && requestedUser.role !== "TUTOR") {
    throw new Error("Unauthorized to change category status");
  }
  const category = await prisma.category.update({
    where: { id },
    data: { isActive },
    include: {
      _count: {
        select: {
          tutorCategories: true,
        },
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false,
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  return {
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: undefined,
  };
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus,
};
