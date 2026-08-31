const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Razorpay order
router.post("/create-order", requireAuth, createPaymentOrder);

// Verify Razorpay payment
router.post("/verify", requireAuth, verifyPayment);

module.exports = router;