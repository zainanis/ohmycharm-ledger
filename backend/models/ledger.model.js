const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["Profit", "Advertisement", "Goods Purchase"],
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Online"],
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;
