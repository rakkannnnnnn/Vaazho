const express = require("express");
const {
  getAllProperties,
  getPropertiesByDestinationSlug,
  getPropertyBySlug,
} = require("../controllers/propertyController");

const router = express.Router();

router.get("/", getAllProperties);
router.get("/destination/:destinationSlug", getPropertiesByDestinationSlug);
router.get("/:slug", getPropertyBySlug);

module.exports = router;
