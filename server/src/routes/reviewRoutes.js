const express = require("express");
const {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
  respondToReview,
} = require("../controllers/reviewController");
const requireAuth = require("../middlewares/authMiddleware");
const requireOwner = require("../middlewares/ownerMiddleware");

const router = express.Router();

router.post("/", requireAuth, createReview);
router.get("/property/:propertyId", getPropertyReviews);
router.put("/:reviewId", requireAuth, updateReview);
router.delete("/:reviewId", requireAuth, deleteReview);
router.patch("/:reviewId/response", requireAuth, requireOwner, respondToReview);

module.exports = router;
