const mongoose = require("mongoose");

const User = require("../models/User");
const Property = require("../models/Property");
const Destination = require("../models/Destination");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Review = require("../models/Review");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("ADMIN GET USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate("destination")
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      properties.map(async (property) => {
        const roomCount = await Room.countDocuments({ property: property._id });
        return {
          ...property.toObject(),
          roomCount,
          status: property.featured ? "Featured" : "Active",
        };
      })
    );

    return res.status(200).json({
      success: true,
      properties: enriched,
    });
  } catch (error) {
    console.error("ADMIN GET PROPERTIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch properties.",
    });
  }
};

const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      destinations,
    });
  } catch (error) {
    console.error("ADMIN GET DESTINATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch destinations.",
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email role")
      .populate("property", "name location")
      .populate("room", "name pricePerNight")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("ADMIN GET BOOKINGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings.",
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate("property", "name")
      .select("_id user property totalAmount paymentStatus createdAt paymentId")
      .sort({ createdAt: -1 });

    const payments = bookings.map((booking) => ({
      bookingId: booking._id,
      user: booking.user ? booking.user.name : "Unknown User",
      property: booking.property ? booking.property.name : "Unknown Property",
      amount: Number(booking.totalAmount || 0),
      paymentStatus: booking.paymentStatus || "unpaid",
      paymentDate: booking.createdAt,
      paymentId: booking.paymentId || null,
    }));

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("ADMIN GET PAYMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch payments.",
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name email")
      .populate("property", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("ADMIN GET REVIEWS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch reviews.",
    });
  }
};

const getAdminSummary = async (req, res) => {
  try {
    const [userCount, propertyCount, destinationCount, bookingCount, reviewCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Destination.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
    ]);

    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      summary: {
        totalUsers: userCount,
        totalProperties: propertyCount,
        totalDestinations: destinationCount,
        totalBookings: bookingCount,
        totalRevenue,
        totalReviews: reviewCount,
      },
    });
  } catch (error) {
    console.error("ADMIN SUMMARY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard summary.",
    });
  }
};

module.exports = {
  getUsers,
  getProperties,
  getDestinations,
  getBookings,
  getPayments,
  getReviews,
  getAdminSummary,
};
