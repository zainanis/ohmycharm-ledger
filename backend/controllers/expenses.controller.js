const { Expense } = require("../models/index");
const getAllExpenses = async (req, res) => {
  try {
    const allExpenses = await Expense.find();

    res.status(200).json(allExpenses);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) return res.status(404).json("Expense not found.");

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const createExpense = async (req, res) => {
  try {
    const { name, type, cost, description } = req.body;

    const newExpense = await Expense.create({ name, type, cost, description });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const updateExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, cost, description } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(type && { type }),
        ...(cost && { cost }),
        ...(description && { description }),
      },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!updatedExpense) return res.status(404).json("Expense not found.");

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const deleteExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedexpense = await Expense.findByIdAndDelete(id);

    if (!deletedexpense) return res.status(404).json("Expense not found.");

    res.status(200).json("Expense deleted successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
};
