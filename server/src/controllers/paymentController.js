const Razorpay = require("razorpay");
const crypto = require("crypto");

const Booking = require("../models/Booking");
const {
  createVoucherForBooking,
} = require("../controllers/bookingController");
const {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
} = require("../services/emailService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Make sure this booking belongs to the logged-in user
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to pay for this booking.",
      });
    }

    // Prevent payment for already-paid booking
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid.",
      });
    }

    // Backend is the source of truth for amount
    const amountInPaise = Math.round(booking.totalAmount * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount.",
      });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: userId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    booking.razorpayOrderId = order.id;

    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully.",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      booking: {
        id: booking._id,
        totalAmount: booking.totalAmount,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order.",
    });
  }
};

// =====================================================
// VERIFY PAYMENT
// =====================================================

const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (
      !bookingId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required.",
      });
    }

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Verify booking ownership
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to verify this payment.",
      });
    }

    // IMPORTANT:
    // Use the Razorpay order ID stored in our database.
    if (
      !booking.razorpayOrderId ||
      booking.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order.",
      });
    }

    // Prevent duplicate verification
    if (booking.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "Payment is already verified.",
        booking,
      });
    }

    // =================================================
    // HMAC SHA256 SIGNATURE VERIFICATION
    // =================================================

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${booking.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    const receivedBuffer = Buffer.from(razorpay_signature);
    const generatedBuffer = Buffer.from(generatedSignature);

    const isValid =
      receivedBuffer.length === generatedBuffer.length &&
      crypto.timingSafeEqual(receivedBuffer, generatedBuffer);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    // =================================================
    // PAYMENT VERIFIED
    // =================================================

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentId = razorpay_payment_id;
    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    await booking.save();

    const customerEmail = booking.customerEmail || req.user?.email;
    let voucher = null;

    try {
      voucher = await createVoucherForBooking(booking);
    } catch (voucherError) {
      console.error("Voucher generation failed after successful payment:", voucherError);
    }

    try {
      if (customerEmail && voucher) {
        await sendBookingConfirmationEmail({
          email: customerEmail,
          booking,
          voucher,
        });
      }
    } catch (emailError) {
      console.error("Booking confirmation email failed after successful payment:", emailError);
    }

    try {
      if (customerEmail) {
        await sendPaymentConfirmationEmail({
          email: customerEmail,
          booking,
          paymentId: razorpay_payment_id,
        });
      }
    } catch (emailError) {
      console.error("Payment confirmation email failed after successful payment:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      booking,
      voucher,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment.",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};