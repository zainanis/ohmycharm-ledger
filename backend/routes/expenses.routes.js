const express = require("express");
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
} = require("../controllers/expenses.controller");
const router = express.Router();

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.put("/:id", updateExpenseById);
router.delete("/:id", deleteExpenseById);

module.exports = { router };
