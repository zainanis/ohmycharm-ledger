const { Expense, Ledger } = require("../models/index");
const mongoose = require("mongoose");

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
  const session = await mongoose.startSession();

  try {
    const { name, type, cost, description, date, paymentMode } = req.body;
    await session.startTransaction();
    const [newExpense] = await Expense.create(
      [{ name, type, cost, date, description, paymentMode }],
      { session }
    );
    await Ledger.create(
      [
        {
          type: type,
          expenseId: newExpense._id,
          paymentMode: paymentMode,
          amount: cost,
          date: date,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json(newExpense);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json(error.message);
  } finally {
    await session.endSession();
  }
};
const updateExpenseById = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { name, type, cost, description, date, paymentMode } = req.body;
    await session.startTransaction();

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(type && { type }),
        ...(cost && { cost }),
        ...(date && { date }),
        ...(paymentMode && { paymentMode }),
        ...(description && { description }),
      },
      {
        runValidators: true,
        new: true,
        session,
      }
    );

    if (!updatedExpense) return res.status(404).json("Expense not found.");

    await Ledger.findOneAndUpdate(
      { expenseId: id },
      {
        type: type,
        expenseId: id,
        paymentMode: paymentMode,
        amount: cost,
        date: date,
      },
      { session, runValidators: true }
    );
    await session.commitTransaction();

    res.status(200).json(updatedExpense);
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json(error.message);
  } finally {
    await session.endSession();
  }
};
const deleteExpenseById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;

    await session.startTransaction();
    const deletedexpense = await Expense.findByIdAndDelete(id);

    if (!deletedexpense) return res.status(404).json("Expense not found.");

    await Ledger.findOneAndDelete({ expenseId: id });
    await session.commitTransaction();

    res.status(200).json("Expense deleted successfully.");
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json(error.message);
  } finally {
    await session.endSession();
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
};
