const express = require("express");
const {
  createExpense,
  getMyExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, createExpense);
router.get("/", requireAuth, getMyExpenses);
router.put("/:expenseId", requireAuth, updateExpense);
router.delete("/:expenseId", requireAuth, deleteExpense);

module.exports = router;
