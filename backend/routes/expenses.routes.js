const express = require("express");
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
} = require("../controllers/expenses.controller");
const validate = require("../middleware/validate");

const router = express.Router();

const expenseSchema = {
  name: { required: true, type: "string" },
  type: { required: true, type: "string", enum: ["Advertisement", "Goods Purchase"] },
  cost: { required: true },
  date: { required: true },
  paymentMode: { required: true, type: "string", enum: ["Cash", "Online"] },
};

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", validate(expenseSchema), createExpense);
router.put("/:id", updateExpenseById);
router.delete("/:id", deleteExpenseById);

module.exports = router;
