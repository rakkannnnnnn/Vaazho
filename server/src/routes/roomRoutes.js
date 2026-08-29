const express = require("express");
const {
  getAllRooms,
  getRoomsByPropertySlug,
  getRoomBySlug,
} = require("../controllers/roomController");

const router = express.Router();

router.get("/", getAllRooms);
router.get("/property/:propertySlug", getRoomsByPropertySlug);
router.get("/:slug", getRoomBySlug);

module.exports = router;
