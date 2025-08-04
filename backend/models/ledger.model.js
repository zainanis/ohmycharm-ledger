const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
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
  },
  { timestamps: true }
);

const Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;
