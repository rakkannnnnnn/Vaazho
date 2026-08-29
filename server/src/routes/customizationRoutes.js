const express = require("express");
const { getCustomizations } = require("../controllers/customizationController");

const router = express.Router();

// GET /api/customizations - Retrieve all active customizations
router.get("/", getCustomizations);

module.exports = router;
