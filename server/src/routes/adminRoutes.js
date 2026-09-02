const express = require("express");
const {
  getUsers,
  getProperties,
  getDestinations,
  getBookings,
  getPayments,
  getReviews,
  getAdminSummary,
} = require("../controllers/adminController");
const requireAuth = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/summary", requireAuth, requireAdmin, getAdminSummary);
router.get("/users", requireAuth, requireAdmin, getUsers);
router.get("/properties", requireAuth, requireAdmin, getProperties);
router.get("/destinations", requireAuth, requireAdmin, getDestinations);
router.get("/bookings", requireAuth, requireAdmin, getBookings);
router.get("/payments", requireAuth, requireAdmin, getPayments);
router.get("/reviews", requireAuth, requireAdmin, getReviews);

module.exports = router;
