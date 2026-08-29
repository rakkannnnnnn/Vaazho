const express = require("express");
const cors = require("cors");

const destinationRoutes = require("./routes/destinationRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


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

app.use("/api/destinations", destinationRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/bookings", bookingRoutes);


// =====================================================
// EXPORT APP
// =====================================================

module.exports = app;