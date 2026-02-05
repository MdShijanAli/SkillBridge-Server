import { Request } from "express";
import { UserRole } from "../../middlewares/auth";
import { prisma } from "../../lib/prisma";

const GetStudentDashboardStats = async (requestedUser: Request["user"]) => {
  if (!requestedUser) {
    throw new Error("Please login to view the dashboard.");
  }
  if (requestedUser.role !== UserRole.STUDENT) {
    throw new Error("Only students can access the dashboard.");
  }

  const [
    totalBookings,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
    totalHoursResult,
    reviewsGiven,
    totalSpent,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count({
      where: { studentId: requestedUser.id },
    }),

    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: "CONFIRMED",
      },
    }),

    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: "COMPLETED",
      },
    }),

    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: "CANCELLED",
      },
    }),

    prisma.booking.aggregate({
      where: {
        studentId: requestedUser.id,
        status: "COMPLETED",
      },
      _sum: { duration: true },
    }),

    prisma.review.count({
      where: { studentId: requestedUser.id },
    }),

    prisma.booking.aggregate({
      where: {
        studentId: requestedUser.id,
        status: { in: ["COMPLETED", "CONFIRMED"] },
      },
      _sum: { price: true },
    }),

    prisma.booking.findMany({
      where: { studentId: requestedUser.id, status: "CONFIRMED" },
      take: 2,
      orderBy: { createdAt: "desc" },
      include: {
        tutor: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  const stats = {
    totalBookings,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
    totalHours: Number(totalHoursResult._sum.duration || 0) / 60,
    reviewsGiven,
    totalSpent: Number(totalSpent._sum.price || 0),
    completionRate:
      totalBookings > 0
        ? Math.round((completedSessions / totalBookings) * 100)
        : 0,
    recentBookings,
    name: requestedUser.name,
  };

  return stats;
};

export const DashboardService = {
  GetStudentDashboardStats,
};
