import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const updateUser = async (userId: string, userData: Partial<User>) => {
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
}: {
  page: number;
  pageSize: number;
  search: string;
  filter: string;
}) => {
  const userData = await prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    },
  });
  const total = await prisma.user.count({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    },
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

const changeUserStatus = async (userId: string, is_active: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { is_active: is_active ? true : false },
  });
  return updatedUser;
};

const bannedUser = async (userId: string, is_banned: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { is_banned: is_banned ? true : false },
  });
  return updatedUser;
};

export const UserService = {
  updateUser,
  getAllUsers,
  getUserDetails,
  changeUserStatus,
  bannedUser,
};
