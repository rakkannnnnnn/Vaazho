const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Customization = require("../models/Customization");

// =====================================================
// CHECK AVAILABILITY
// =====================================================
const checkAvailability = async (req, res) => {
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
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
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
        message: "Invalid date format.",
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
        message: "Guests must be a positive integer.",
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

    // Authoritative room pricing strictly from Room.pricePerNight in MongoDB
    const pricePerNight = Number(room.pricePerNight ?? 0);
    const roomTotal = pricePerNight * numberOfNights;

    return res.status(200).json({
      success: true,
      available: true,
      room: {
        id: room._id,
        name: room.name,
        capacity: room.capacity,
      },
      pricing: {
        pricePerNight,
        numberOfNights,
        roomTotal,
        totalAmount: roomTotal,
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
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// CREATE BOOKING (Protected with Custom JWT Authentication)
// =====================================================
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, customizations = [] } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Validate required fields
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Room, dates and guests are required.",
      });
    }

    // Validate Room ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
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
        message: "Invalid date format.",
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
        message: "Guests must be a positive integer.",
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

    // Validate guest capacity
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

    // Calculate nights server-side
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfNights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / millisecondsPerDay
    );

    // Authoritative room pricing strictly from Room.pricePerNight in MongoDB
    const pricePerNight = Number(room.pricePerNight ?? 0);
    const roomTotal = pricePerNight * numberOfNights;

    // =====================================================
    // VALIDATE & CALCULATE CUSTOMIZATIONS
    // =====================================================
    let bookingCustomizations = [];
    let customizationTotal = 0;

    if (customizations && customizations.length > 0) {
      if (!Array.isArray(customizations)) {
        return res.status(400).json({
          success: false,
          message: "Customizations must be an array of IDs.",
        });
      }

      // Validate all customization IDs
      for (const customId of customizations) {
        if (!mongoose.Types.ObjectId.isValid(customId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid customization ID: ${customId}`,
          });
        }
      }

      // Deduplicate IDs
      const uniqueCustomizationIds = [...new Set(customizations.map(String))];

      // Fetch all customizations from MongoDB
      const foundCustomizations = await Customization.find({
        _id: { $in: uniqueCustomizationIds },
      });

      if (foundCustomizations.length !== uniqueCustomizationIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more customizations not found.",
        });
      }

      // Check if any customization is inactive
      const inactive = foundCustomizations.find((c) => !c.active);
      if (inactive) {
        return res.status(400).json({
          success: false,
          message: `Customization "${inactive.name}" is currently not active.`,
        });
      }

      // Calculate each customization amount
      for (const item of foundCustomizations) {
        let calculatedAmount = 0;

        switch (item.pricingType) {
          case "per-night":
            calculatedAmount = Number(item.price) * numberOfNights;
            break;
          case "per-person":
            calculatedAmount = Number(item.price) * guestCount;
            break;
          case "per-booking":
          default:
            calculatedAmount = Number(item.price) * 1;
            break;
        }

        customizationTotal += calculatedAmount;

        bookingCustomizations.push({
          customization: item._id,
          name: item.name,
          price: Number(item.price),
          pricingType: item.pricingType,
          calculatedAmount,
        });
      }
    }

    // Authoritative final total calculation
    const finalTotal = roomTotal + customizationTotal;

    // Create authoritative booking in MongoDB tied to authenticated user
    const booking = await Booking.create({
      user: req.user._id,
      property: room.property,
      room: room._id,
      checkIn: startDate,
      checkOut: endDate,
      guests: guestCount,
      numberOfNights,
      pricePerNight,
      roomTotal,
      customizations: bookingCustomizations,
      customizationTotal,
      totalAmount: finalTotal,
      status: "confirmed",
      paymentStatus: "unpaid",
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking: {
        _id: booking._id,
        user: booking.user,
        room: booking.room,
        property: booking.property,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        numberOfNights: booking.numberOfNights,
        pricePerNight: booking.pricePerNight,
        roomTotal: booking.roomTotal,
        customizations: booking.customizations,
        customizationTotal: booking.customizationTotal,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking.",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// GET MY BOOKINGS (Authenticated Customer)
// =====================================================
const getMyBookings = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .populate("property", "name slug location address images rating featured")
      .populate(
        "room",
        "name slug pricePerNight capacity bedType roomSize amenities images featured"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// GET BOOKING DETAILS (Authenticated Customer)
// =====================================================
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate("property", "name slug location address images amenities rating description")
      .populate(
        "room",
        "name slug pricePerNight capacity bedType roomSize amenities images description"
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Check ownership against the authenticated user's MongoDB ObjectId
    const bookingUserId = booking.user?._id
      ? booking.user._id.toString()
      : booking.user?.toString();

    if (!bookingUserId || bookingUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking.",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("GET BOOKING BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking details.",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// CANCEL BOOKING (Authenticated Customer)
// =====================================================
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Verify ownership
    const bookingUserId = booking.user?.toString();

    if (!bookingUserId || bookingUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking.",
      });
    }

    // Check cancellation rules: cannot cancel if already cancelled or completed
    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled.",
      });
    }

    // Perform cancellation: update status, keep record and payment status
    booking.status = "cancelled";
    await booking.save();

    // Populate for response
    await booking.populate([
      { path: "property", select: "name slug location address images rating" },
      { path: "room", select: "name slug pricePerNight capacity bedType roomSize amenities images" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking.",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  checkAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};