const express = require("express");
const cors = require("cors");

const destinationRoutes = require("./routes/destinationRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VAZHO API is running",
  });
});

app.use("/api/destinations", destinationRoutes);
app.use("/api/properties", propertyRoutes);

module.exports = app;