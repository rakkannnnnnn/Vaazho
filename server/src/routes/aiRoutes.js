const express = require("express");

const requireAuth = require("../middlewares/authMiddleware");
const {
  testAI,
  generateTravelPlan,
  saveAIPlan,
  getMyAIPlans,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/test", testAI);
router.post("/plan", generateTravelPlan);
router.post("/plans", requireAuth, saveAIPlan);
router.get("/plans", requireAuth, getMyAIPlans);

module.exports = router;