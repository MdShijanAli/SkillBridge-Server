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
  const categoriesData = await prisma.category.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      name: { contains: search, mode: "insensitive" },
      description: { contains: search, mode: "insensitive" },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const total = await prisma.category.count({
    where: {
      name: { contains: search, mode: "insensitive" },
      description: { contains: search, mode: "insensitive" },
    },
  });
  return { data: categoriesData, total };
};

const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
};

const updateCategory = async (id: number, data: Partial<Category>) => {
  const category = await prisma.category.update({
    where: { id },
    data,
  });
  return category;
};

const deleteCategory = async (id: number) => {
  await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
