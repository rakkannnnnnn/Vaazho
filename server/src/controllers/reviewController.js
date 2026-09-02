const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Property = require("../models/Property");
const Review = require("../models/Review");

const getUserId = (req) => req.user?._id || req.user?.id;

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const reviewQuery = (query) =>
  query
    .populate("user", "name")
    .populate("property", "name slug")
    .sort({ createdAt: -1 });

const createReview = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { property: propertyId, booking: bookingId, rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    if (!propertyId || !isValidObjectId(propertyId)) {
      return res.status(400).json({ success: false, message: "A valid property is required." });
    }

    if (!bookingId || !isValidObjectId(bookingId)) {
      return res.status(400).json({ success: false, message: "A valid booking is required." });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5." });
    }

    if (typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Comment is required." });
    }

    const [property, booking, existingReview] = await Promise.all([
      Property.findById(propertyId).select("_id owner"),
      Booking.findOne({ _id: bookingId, user: userId }).select("_id property status"),
      Review.findOne({ booking: bookingId, user: userId }).select("_id"),
    ]);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (!booking || booking.property.toString() !== propertyId.toString()) {
      return res.status(403).json({ success: false, message: "You can only review a property from your own booking." });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cancelled bookings cannot be reviewed." });
    }

    if (existingReview) {
      return res.status(409).json({ success: false, message: "This booking has already been reviewed." });
    }

    const review = await Review.create({
      user: userId,
      property: propertyId,
      booking: bookingId,
      rating: numericRating,
      comment: comment.trim(),
    });

    const populatedReview = await reviewQuery(Review.findById(review._id));
    return res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "This booking has already been reviewed." });
    }
    console.error("CREATE REVIEW ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to create review." });
  }
};

const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ success: false, message: "Invalid property ID." });
    }

    const property = await Property.findById(propertyId).select("_id");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    const [reviews, aggregate] = await Promise.all([
      reviewQuery(Review.find({ property: propertyId })),
      Review.aggregate([
        { $match: { property: new mongoose.Types.ObjectId(propertyId) } },
        { $group: { _id: "$property", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
      ]),
    ]);

    const stats = aggregate[0] || { averageRating: 0, reviewCount: 0 };
    return res.status(200).json({
      success: true,
      reviews,
      averageRating: Number((stats.averageRating || 0).toFixed(2)),
      reviewCount: stats.reviewCount || 0,
    });
  } catch (error) {
    console.error("GET PROPERTY REVIEWS ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch property reviews." });
  }
};

const updateReview = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID." });
    }

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or access denied." });
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5." });
      }
      review.rating = numericRating;
    }

    if (comment !== undefined) {
      if (typeof comment !== "string" || !comment.trim()) {
        return res.status(400).json({ success: false, message: "Comment is required." });
      }
      review.comment = comment.trim();
    }

    await review.save();
    const populatedReview = await reviewQuery(Review.findById(review._id));
    return res.status(200).json({ success: true, review: populatedReview });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to update review." });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID." });
    }

    const review = await Review.findOneAndDelete({ _id: reviewId, user: getUserId(req) });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or access denied." });
    }

    return res.status(200).json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to delete review." });
  }
};

const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { ownerResponse } = req.body;
    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID." });
    }
    if (typeof ownerResponse !== "string" || !ownerResponse.trim()) {
      return res.status(400).json({ success: false, message: "Owner response is required." });
    }

    const review = await Review.findById(reviewId).populate("property", "owner");
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    if (!review.property?.owner || review.property.owner.toString() !== getUserId(req).toString()) {
      return res.status(403).json({ success: false, message: "Only the property owner can respond." });
    }

    review.ownerResponse = ownerResponse.trim();
    await review.save();
    const populatedReview = await reviewQuery(Review.findById(review._id));
    return res.status(200).json({ success: true, review: populatedReview });
  } catch (error) {
    console.error("RESPOND TO REVIEW ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to save owner response." });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
  respondToReview,
};
