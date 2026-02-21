import { Request } from "express";
import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const updateUser = async (
  userId: string,
  userData: Partial<User>,
  requestedUser: Partial<User>,
) => {
  if (requestedUser.id !== userId && requestedUser.role !== "ADMIN") {
    throw new Error(
      "You are not authorized to update this user. You can only update your own profile.",
    );
  }
  if (
    requestedUser.role === UserRole.TUTOR ||
    (requestedUser.role === UserRole.STUDENT && userData.role)
  ) {
    delete userData.role;
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: userData,
  });
  return updatedUser;
};

const getAllUsers = async ({
  page,
  pageSize,
  search,
  filter,
  role,
}: {
  page: number;
  pageSize: number;
  search: string;
  filter: string;
  role?: string;
}) => {
  const whereClause: any = {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ],
  };

  if (role) {
    whereClause.role = role;
  }

  const userData = await prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: whereClause,
    include: {
      tutorProfile: true,
      studentBookings: true,
      tutorBookings: true,
      reviews: true,
      receivedReviews: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const total = await prisma.user.count({
    where: whereClause,
  });

  const users = {
    data: userData,
    total,
  };
  return users;
};

const getUserDetails = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};

const changeUserStat = async (
  userId: string,
  updateData: Record<string, boolean | string>,
) => {
  const fieldName = Object.keys(updateData)[0];

  if (!fieldName) {
    throw new Error("No field provided to update");
  }

  const value = updateData[fieldName];

  const booleanValue =
    typeof value === "string"
      ? value === "true" || value === "1"
      : Boolean(value);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { [fieldName]: booleanValue },
  });
  return updatedUser;
};

const deleteUser = async (userId: string, requestedUser: Partial<User>) => {
  if (requestedUser.id !== userId && requestedUser.role !== "ADMIN") {
    throw new Error(
      "You are not authorized to delete this user. You can only delete your own profile.",
    );
  }
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deletedUser;
};

export const UserService = {
  updateUser,
  getAllUsers,
  getUserDetails,
  changeUserStat,
  deleteUser,
};
