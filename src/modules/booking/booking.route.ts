import express from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UserRole.STUDENT),
  BookingController.CreateBooking,
);
router.get(
  "/:bookingId",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  BookingController.GetBookingById,
);
router.get(
  "/tutor/:tutorId",
  authMiddleware(UserRole.TUTOR),
  BookingController.GetBookingsForTutor,
);
router.get(
  "/",
  authMiddleware(UserRole.ADMIN),
  BookingController.GetAllBookings,
);
router.get(
  "/me/:userId",
  authMiddleware(UserRole.STUDENT),
  BookingController.getMyBookings,
);
router.delete(
  "/:bookingId",
  authMiddleware(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  BookingController.DeleteBooking,
);

router.patch(
  "/:bookingId/status",
  authMiddleware(UserRole.TUTOR, UserRole.STUDENT),
  BookingController.ChangeBookingStatus,
);

export const BookingRoutes = router;
