const express = require("express");
const {
  getDashboard,
  getOwnerProperties,
  createOwnerProperty,
  updateOwnerProperty,
  deleteOwnerProperty,
  getOwnerPropertyRooms,
  createOwnerRoom,
  updateOwnerRoom,
  deleteOwnerRoom,
  getOwnerBookings,
  getOwnerCustomizations,
  createOwnerCustomization,
  updateOwnerCustomization,
  deleteOwnerCustomization,
} = require("../controllers/ownerController");
const requireAuth = require("../middlewares/authMiddleware");
const requireOwner = require("../middlewares/ownerMiddleware");

const router = express.Router();

router.get("/dashboard", requireAuth, requireOwner, getDashboard);

router.get("/properties", requireAuth, requireOwner, getOwnerProperties);
router.post("/properties", requireAuth, requireOwner, createOwnerProperty);
router.put("/properties/:propertyId", requireAuth, requireOwner, updateOwnerProperty);
router.delete("/properties/:propertyId", requireAuth, requireOwner, deleteOwnerProperty);

router.get("/properties/:propertyId/rooms", requireAuth, requireOwner, getOwnerPropertyRooms);
router.post("/properties/:propertyId/rooms", requireAuth, requireOwner, createOwnerRoom);
router.put("/rooms/:roomId", requireAuth, requireOwner, updateOwnerRoom);
router.delete("/rooms/:roomId", requireAuth, requireOwner, deleteOwnerRoom);

router.get("/bookings", requireAuth, requireOwner, getOwnerBookings);

router.get("/customizations", requireAuth, requireOwner, getOwnerCustomizations);
router.post("/customizations", requireAuth, requireOwner, createOwnerCustomization);
router.put("/customizations/:customizationId", requireAuth, requireOwner, updateOwnerCustomization);
router.delete("/customizations/:customizationId", requireAuth, requireOwner, deleteOwnerCustomization);

module.exports = router;
