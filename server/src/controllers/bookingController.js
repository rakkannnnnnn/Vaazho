import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.query;

    // Validate required fields
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Room, dates and guests are required.",
      });
    }

    // Validate ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID.",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const guestCount = Number(guests);

    // Validate dates
    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    // Validate guests
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Guests must be a positive number.",
      });
    }

    // Find room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    // Check capacity
    if (guestCount > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `Room can accommodate a maximum of ${room.capacity} guests.`,
      });
    }

    // Check overlapping bookings
    const overlappingBooking = await Booking.findOne({
      room: room._id,
      status: {
        $in: ["pending", "confirmed"],
      },
      checkIn: {
        $lt: endDate,
      },
      checkOut: {
        $gt: startDate,
      },
    });

    if (overlappingBooking) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "Room is not available for the selected dates.",
      });
    }

    // Calculate number of nights
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const numberOfNights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / millisecondsPerDay
    );

    // IMPORTANT:
    // Price comes from MongoDB, not the frontend.
    const pricePerNight = Number(room.price);

    const totalAmount = pricePerNight * numberOfNights;

    return res.status(200).json({
      success: true,
      available: true,
      room: {
        id: room._id,
        capacity: room.capacity,
      },
      pricing: {
        pricePerNight,
        numberOfNights,
        totalAmount,
      },
      dates: {
        checkIn: startDate,
        checkOut: endDate,
      },
      guests: guestCount,
    });
  } catch (error) {
    console.error("CHECK AVAILABILITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check room availability.",
      error: process.env.NODE_ENV === "development"
        ? error.message
        : undefined,
    });
  }
};


export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;

    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Room, dates and guests are required.",
      });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID.",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const guestCount = Number(guests);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Guests must be a positive number.",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    if (guestCount > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `Room can accommodate a maximum of ${room.capacity} guests.`,
      });
    }

    // Check availability again immediately before booking
    const overlappingBooking = await Booking.findOne({
      room: room._id,
      status: {
        $in: ["pending", "confirmed"],
      },
      checkIn: {
        $lt: endDate,
      },
      checkOut: {
        $gt: startDate,
      },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: "Room is no longer available for these dates.",
      });
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const numberOfNights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / millisecondsPerDay
    );

    // Backend is the source of truth for pricing
    const pricePerNight = Number(room.price);
    const totalAmount = pricePerNight * numberOfNights;

    // Clerk authentication
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /*
      IMPORTANT:

      Your Booking model currently expects:

      user: ObjectId -> User collection

      But Clerk gives us a Clerk user ID string.

      Therefore, DO NOT directly put req.auth.userId
      into Booking.user unless your User model stores
      Clerk IDs as ObjectIds-compatible references.

      For now this section should be connected to
      your User/Clerk synchronization.
    */

    return res.status(501).json({
      success: false,
      message:
        "Booking creation requires Clerk user to MongoDB User mapping. Availability is ready.",
    });

  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};