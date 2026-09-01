const express = require("express");

const {
    checkAvailability,
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getVoucherByBookingId,
} = require("../controllers/bookingController");
const requireAuth = require("../middlewares/authMiddleware");



const router = express.Router();



// Check room availability (public)
router.get("/availability", checkAvailability);

// Get current authenticated user's bookings (must be defined before /:bookingId)
router.get("/my", requireAuth, getMyBookings);

// Get single booking details
router.get("/:bookingId", requireAuth, getBookingById);

router.get("/:bookingId/voucher", requireAuth, getVoucherByBookingId);

// Cancel booking
router.patch("/:bookingId/cancel", requireAuth, cancelBooking);

// Create booking (protected)
router.post("/", requireAuth, createBooking);


module.exports = router;