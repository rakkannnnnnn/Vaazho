const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Customization = require("../models/Customization");
const User = require("../models/User");

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

    // Authoritative room pricing from MongoDB
    const pricePerNight = Number(room.pricePerNight ?? room.price ?? 0);
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
// CREATE BOOKING
// =====================================================
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, customizations = [] } = req.body;

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

    // Calculate nights
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfNights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / millisecondsPerDay
    );

    // Backend is the single source of truth for room pricing
    const pricePerNight = Number(room.pricePerNight ?? room.price ?? 0);
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

    // Final total calculation
    const finalTotal = roomTotal + customizationTotal;

    // =====================================================
    // RESOLVE USER (Clerk or Guest)
    // =====================================================
    let userRecord = null;
    const clerkId = req.auth?.userId || req.body.clerkId || req.headers["x-clerk-user-id"];

    if (clerkId) {
      userRecord = await User.findOne({ clerkId });
      if (!userRecord && req.body.email) {
        try {
          userRecord = await User.create({
            clerkId,
            email: req.body.email,
            firstName: req.body.firstName || "",
            lastName: req.body.lastName || "",
          });
        } catch (uErr) {
          console.warn("Could not upsert user record:", uErr.message);
        }
      }
    } else if (req.body.userId && mongoose.Types.ObjectId.isValid(req.body.userId)) {
      userRecord = await User.findById(req.body.userId);
    }

    // Create authoritative booking
    const booking = await Booking.create({
      user: userRecord?._id || undefined,
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

module.exports = {
  checkAvailability,
  createBooking,
};