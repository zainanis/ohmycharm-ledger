const express = require("express");
const router = express.Router();

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.put("/:id", updateExpenseById);
router.delete("/:id", deleteExpenseById);

module.exports = { router };
