import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { formatResultWithPagination } from "../../utils/formatResult";
import { BookingStatus } from "../../../generated/prisma/enums";

const CreateBooking = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  const data = req.body;

  try {
    const response = await BookingService.CreateBooking(data, requestedUser);
    res.status(201).json({
      message: "Booking created successfully",
      success: true,
      data: response,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create booking",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const GetBookingsForTutor = async (req: Request, res: Response) => {
  const tutorId = req.params.tutorId;
  const requestedUser = req.user;
  try {
    const bookings = await BookingService.getAllBookingsForTutor(
      tutorId,
      requestedUser,
    );
    res.status(200).json({
      message: "Bookings for tutor fetched successfully",
      success: true,
      data: bookings.data,
      total: bookings.total,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const GetAllBookings = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  const { page = 1, limit = 10, search } = req.query;
  try {
    const bookings = await BookingService.getAllBookings(
      requestedUser,
      Number(page),
      Number(limit),
      search as string | undefined,
    );
    formatResultWithPagination(
      res,
      bookings.data,
      "Bookings fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: bookings.total,
      },
      "/bookings",
    );
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve all bookings",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  const userId = req.params.userId;
  const { page = 1, limit = 10, search } = req.query;
  try {
    const bookings = await BookingService.getMyBookings(
      userId,
      requestedUser,
      Number(page),
      Number(limit),
      search as string | undefined,
    );
    formatResultWithPagination(
      res,
      bookings.data,
      "Your bookings fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: bookings.total,
      },
      "/bookings/me/" + userId,
    );
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve your bookings",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const GetBookingById = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const requestedUser = req.user;
  try {
    const booking = await BookingService.GetBookingById(
      Number(bookingId),
      requestedUser,
    );
    res.status(200).json({
      message: "Booking retrieved successfully",
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve the booking",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const DeleteBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const requestedUser = req.user;
  try {
    await BookingService.DeleteBooking(Number(bookingId), requestedUser);
    res.status(200).json({
      message: "Booking deleted successfully",
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to delete the booking",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const ChangeBookingStatus = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const { status } = req.body;
  const requestedUser = req.user;
  try {
    const updatedBooking = await BookingService.ChangeBookingStatus(
      Number(bookingId),
      status,
      requestedUser,
    );
    res.status(200).json({
      message: "Booking status updated successfully",
      success: true,
      data: updatedBooking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

export const BookingController = {
  CreateBooking,
  GetBookingsForTutor,
  GetAllBookings,
  getMyBookings,
  GetBookingById,
  DeleteBooking,
  ChangeBookingStatus,
};
