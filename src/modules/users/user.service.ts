import { prisma } from "../../lib/prisma";

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

export const UserService = {
  getAllUsers,
};
