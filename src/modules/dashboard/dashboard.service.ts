import { Request } from "express";
import { UserRole } from "../../middlewares/auth";
import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";

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
        status: BookingStatus.CONFIRMED,
      },
    }),

    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: BookingStatus.COMPLETED,
      },
    }),

    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: BookingStatus.CANCELLED,
      },
    }),

    prisma.booking.aggregate({
      where: {
        studentId: requestedUser.id,
        status: BookingStatus.COMPLETED,
      },
      _sum: { duration: true },
    }),

    prisma.review.count({
      where: { studentId: requestedUser.id },
    }),

    prisma.booking.aggregate({
      where: {
        studentId: requestedUser.id,
        status: { in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED] },
      },
      _sum: { price: true },
    }),

    prisma.booking.findMany({
      where: { studentId: requestedUser.id, status: BookingStatus.CONFIRMED },
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

const GetTutorDashboardStats = async (requestedUser: Request["user"]) => {
  if (!requestedUser) {
    throw new Error("Please login to view the dashboard.");
  }
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can access the dashboard.");
  }

  const [
    totalSessions,
    upcomingSessions,
    totalEarnings,
    thisWeekEarnings,
    thisMonthEarnings,
    totalRating,
    totalStudents,
    hourlyRate,
    subjectCount,
    totalReviews,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        tutorId: requestedUser.id,
      },
    }),

    prisma.booking.count({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.CONFIRMED,
      },
    }),

    prisma.booking.aggregate({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.COMPLETED,
      },
      _sum: { price: true },
    }),

    prisma.booking.aggregate({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.COMPLETED,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
      _sum: { price: true },
    }),

    prisma.booking.aggregate({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.COMPLETED,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { price: true },
    }),

    prisma.review.aggregate({
      where: {
        tutorId: requestedUser.id,
      },
      _avg: { rating: true },
    }),

    prisma.booking
      .groupBy({
        by: ["studentId"],
        where: { tutorId: requestedUser.id },
      })
      .then((groups) => groups.length),

    prisma.tutorProfile.findUnique({
      where: { userId: requestedUser.id },
      select: { hourlyRate: true },
    }),

    prisma.booking
      .groupBy({
        by: ["subject"],
        where: { tutorId: requestedUser.id },
      })
      .then((groups) => groups.length),

    prisma.review.count({
      where: { tutorId: requestedUser.id },
    }),
  ]);

  return {
    totalSessions,
    upcomingSessions,
    totalEarnings: Number(totalEarnings._sum.price || 0),
    thisWeekEarnings: Number(thisWeekEarnings._sum.price || 0),
    thisMonthEarnings: Number(thisMonthEarnings._sum.price || 0),
    totalRating: Number(totalRating._avg.rating || 0),
    totalStudents,
    hourlyRate: hourlyRate?.hourlyRate || 0,
    subjectCount,
    totalReviews,
  };
};

export const DashboardService = {
  GetStudentDashboardStats,
  GetTutorDashboardStats,
};
