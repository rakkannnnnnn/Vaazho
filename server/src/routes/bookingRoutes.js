const express = require("express");

const {
  checkAvailability,
  createBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// Check room availability
router.get("/availability", checkAvailability);

// Create booking
router.post("/", createBooking);

module.exports = router;