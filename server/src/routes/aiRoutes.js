const express = require("express");

const { testAI } = require("../controllers/aiController");

const router = express.Router();

router.post("/test", testAI);

module.exports = router;