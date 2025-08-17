const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Advertisement", "Goods Purchase"],
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Online"],
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
