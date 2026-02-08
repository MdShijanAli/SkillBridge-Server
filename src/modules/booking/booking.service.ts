import { Request } from "express";
import { BookingUncheckedCreateInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";
import { BookingStatus } from "../../../generated/prisma/client";

const CreateBooking = async (
  data: BookingUncheckedCreateInput,
  requestedUser: Request["user"],
) => {
  if (!requestedUser) {
    throw new Error("Please login to create a booking.");
  }

  if (requestedUser.role !== UserRole.STUDENT) {
    throw new Error("Only students can create bookings.");
  }

  const bookingData = { ...data, studentId: requestedUser.id };

  const booking = await prisma.booking.create({
    data: {
      ...bookingData,
    },
  });
  return booking;
};

const getMyBookings = async (
  userId: string | number,
  requestedUser: Request["user"],
  page: number,
  limit: number,
  search?: string,
) => {
  if (!requestedUser) {
    throw new Error("Please login to view your bookings.");
  }
  if (requestedUser.id !== userId) {
    throw new Error("You are not authorized to view these bookings.");
  }
  if (requestedUser.role !== UserRole.STUDENT) {
    throw new Error("Only students can view their bookings.");
  }

  const whereClause = {
    studentId: userId,
    ...(search && {
      OR: [
        {
          tutor: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          tutor: {
            tutorProfile: {
              bio: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    }),
  };

  const bookings = await prisma.booking.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: whereClause,
    include: {
      tutor: {
        include: {
          tutorProfile: true,
        },
      },
      student: true,
      category: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalBookings = await prisma.booking.count({
    where: whereClause,
  });
  return { data: bookings, total: totalBookings };
};

const getAllBookingsForTutor = async (
  tutorId: string,
  requestedUser: Request["user"],
) => {
  if (!requestedUser) {
    throw new Error("Please login to view bookings.");
  }
  if (requestedUser.id !== tutorId) {
    throw new Error("You are not authorized to view these bookings.");
  }
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can view their bookings.");
  }

  const whereClause = {
    tutorId: tutorId,
  };

  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      tutor: {
        include: {
          tutorProfile: true,
        },
      },
      student: true,
      category: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalBookings = await prisma.booking.count({
    where: whereClause,
  });
  return { data: bookings, total: totalBookings };
};

const getAllBookings = async (
  requestedUser: Request["user"],
  page: number,
  limit: number,
  search?: string,
) => {
  if (!requestedUser) {
    throw new Error("Please login to view all bookings.");
  }
  if (requestedUser.role !== UserRole.ADMIN) {
    throw new Error("Only admins can view all bookings.");
  }

  const whereClause = search
    ? {
        OR: [
          {
            tutor: {
              tutorProfile: {
                bio: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            student: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : undefined;

  const bookings = await prisma.booking.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: whereClause,
    include: {
      tutor: {
        include: {
          tutorProfile: true,
        },
      },
      student: true,
      category: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalBookings = await prisma.booking.count({
    where: whereClause,
  });

  return { data: bookings, total: totalBookings };
};

const GetBookingById = async (
  bookingId: number,
  requestedUser: Request["user"],
) => {
  if (!requestedUser) {
    throw new Error("Please login to view the booking.");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      tutor: {
        include: {
          tutorProfile: true,
        },
      },
      student: true,
    },
  });
  return booking;
};

const DeleteBooking = async (
  bookingId: number,
  requestedUser: Request["user"],
) => {
  if (!requestedUser) {
    throw new Error("Please login to delete the booking.");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (
    requestedUser.role === UserRole.STUDENT &&
    booking.studentId !== requestedUser.id
  ) {
    throw new Error("You are not authorized to delete this booking.");
  }

  if (
    requestedUser.role === UserRole.TUTOR &&
    booking.tutorId !== requestedUser.id
  ) {
    throw new Error("You are not authorized to delete this booking.");
  }

  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
};

const ChangeBookingStatus = async (
  bookingId: number,
  status: BookingStatus,
  requestedUser: Request["user"],
) => {
  if (!requestedUser) {
    throw new Error("Please login to change the booking status.");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  if (!booking) {
    throw new Error("Booking not found.");
  }
  if (
    requestedUser.role === UserRole.TUTOR &&
    booking.tutorId !== requestedUser.id
  ) {
    throw new Error(
      "You are not authorized to change the status of this booking.",
    );
  }
  if (
    requestedUser.role === UserRole.STUDENT &&
    booking.studentId !== requestedUser.id
  ) {
    throw new Error(
      "You are not authorized to change the status of this booking.",
    );
  }
  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
  });
};

export const BookingService = {
  CreateBooking,
  getMyBookings,
  getAllBookingsForTutor,
  getAllBookings,
  GetBookingById,
  DeleteBooking,
  ChangeBookingStatus,
};
