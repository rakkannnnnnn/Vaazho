const express = require("express");
const {
  getAllDestinations,
  getDestinationBySlug,
} = require("../controllers/destinationController");

const router = express.Router();

router.get("/", getAllDestinations);
router.get("/:slug", getDestinationBySlug);

module.exports = router;
