const mongoose = require("mongoose");
const Expense = require("../models/Expense");

const buildExpensePayload = (body = {}) => {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const amount = Number(body.amount);
  const date = body.date ? new Date(body.date) : null;

  return {
    title,
    category,
    description,
    amount,
    date,
  };
};

const createExpense = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const payload = buildExpensePayload(req.body);

    if (!payload.title) {
      return res.status(400).json({
        success: false,
        message: "Expense title is required.",
      });
    }

    if (!payload.category) {
      return res.status(400).json({
        success: false,
        message: "Expense category is required.",
      });
    }

    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Expense amount must be a valid positive number.",
      });
    }

    if (!payload.date || Number.isNaN(payload.date.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Valid expense date is required.",
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title: payload.title,
      category: payload.category,
      amount: payload.amount,
      date: payload.date,
      description: payload.description,
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      expense,
    });
  } catch (error) {
    console.error("CREATE EXPENSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create expense.",
    });
  }
};

const getMyExpenses = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("GET MY EXPENSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenses.",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { expenseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID.",
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    const payload = buildExpensePayload(req.body);

    if (req.body.title !== undefined && !payload.title) {
      return res.status(400).json({
        success: false,
        message: "Expense title is required.",
      });
    }

    if (req.body.category !== undefined && !payload.category) {
      return res.status(400).json({
        success: false,
        message: "Expense category is required.",
      });
    }

    if (req.body.amount !== undefined) {
      if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Expense amount must be a valid positive number.",
        });
      }
      expense.amount = payload.amount;
    }

    if (req.body.title !== undefined) {
      expense.title = payload.title;
    }

    if (req.body.category !== undefined) {
      expense.category = payload.category;
    }

    if (req.body.date !== undefined) {
      if (!payload.date || Number.isNaN(payload.date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Valid expense date is required.",
        });
      }
      expense.date = payload.date;
    }

    if (req.body.description !== undefined) {
      expense.description = payload.description;
    }

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      expense,
    });
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update expense.",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { expenseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID.",
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    await expense.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete expense.",
    });
  }
};

module.exports = {
  createExpense,
  getMyExpenses,
  updateExpense,
  deleteExpense,
};
