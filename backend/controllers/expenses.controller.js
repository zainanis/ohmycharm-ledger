const { Expense, Ledger } = require("../models/index");
const mongoose = require("mongoose");

const getAllExpenses = async (req, res) => {
  try {
    const { type, paymentMode, from, to, page = 1, limit = 20 } = req.query;

    const match = {};
    if (type) match.type = type;
    if (paymentMode) match.paymentMode = paymentMode;
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        match.date.$lte = toDate;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [total, data] = await Promise.all([
      Expense.countDocuments(match),
      Expense.find(match).sort({ date: 1 }).skip(skip).limit(Number(limit)),
    ]);

    res.status(200).json({ data, total, page: Number(page), limit: Number(limit) });
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
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(cost !== undefined && { cost }),
        ...(date !== undefined && { date }),
        ...(paymentMode !== undefined && { paymentMode }),
        ...(description !== undefined && { description }),
      },
      {
        runValidators: true,
        new: true,
        session,
      }
    );

    if (!updatedExpense) {
      await session.abortTransaction();
      return res.status(404).json("Expense not found.");
    }

    await Ledger.findOneAndUpdate(
      { expenseId: id },
      {
        ...(type !== undefined && { type }),
        ...(paymentMode !== undefined && { paymentMode }),
        ...(cost !== undefined && { amount: cost }),
        ...(date !== undefined && { date }),
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
    const deletedexpense = await Expense.findByIdAndDelete(id, { session });

    if (!deletedexpense) {
      await session.abortTransaction();
      return res.status(404).json("Expense not found.");
    }

    await Ledger.findOneAndDelete({ expenseId: id }, { session });
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
