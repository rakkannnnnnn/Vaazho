const express = require("express");

const { testAI, generateTravelPlan } = require("../controllers/aiController");

const router = express.Router();

router.post("/test", testAI);
router.post("/plan", generateTravelPlan);

module.exports = router;