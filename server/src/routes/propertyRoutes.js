const express = require("express");
const {
  getAllProperties,
  searchProperties,
  getPropertiesByDestinationSlug,
  getPropertyBySlug,
} = require("../controllers/propertyController");

const router = express.Router();

// Important: /search route must come BEFORE /:slug route
router.get("/search", searchProperties);
router.get("/", getAllProperties);
router.get("/destination/:destinationSlug", getPropertiesByDestinationSlug);
router.get("/:slug", getPropertyBySlug);

module.exports = router;
