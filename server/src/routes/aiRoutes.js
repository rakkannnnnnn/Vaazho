const express = require("express");

const requireAuth = require("../middlewares/authMiddleware");
const {
  testAI,
  generateTravelPlan,
  saveAIPlan,
  getMyAIPlans,
  getAIPlanById,
  deleteAIPlan,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/test", testAI);
router.post("/plan", generateTravelPlan);
router.post("/plans", requireAuth, saveAIPlan);
router.get("/plans", requireAuth, getMyAIPlans);
router.get("/plans/:id", requireAuth, getAIPlanById);
router.delete("/plans/:id", requireAuth, deleteAIPlan);

module.exports = router;