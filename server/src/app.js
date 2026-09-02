const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const customizationRoutes = require("./routes/customizationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const {
  standardLimiter,
  authLimiter,
  aiLimiter,
  bookingLimiter,
  reviewLimiter,
} = require("./middlewares/rateLimiters");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS."));
  },
}));
app.use(express.json({ limit: "1mb" }));
app.use(standardLimiter);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VAZHO API is running",
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingLimiter, bookingRoutes);
app.use("/api/customizations", customizationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewLimiter, reviewRoutes);

app.use((error, req, res, next) => {
  if (error.message === "Origin is not allowed by CORS.") {
    return res.status(403).json({ success: false, message: error.message });
  }
  return next(error);
});

// =====================================================
// EXPORT APP
// =====================================================

module.exports = app;