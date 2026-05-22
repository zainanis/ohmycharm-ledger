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

ledgerSchema.pre("validate", function (next) {
  const hasOrder = !!this.orderId;
  const hasExpense = !!this.expenseId;
  if (hasOrder === hasExpense) {
    return next(new Error("A ledger entry must have exactly one of orderId or expenseId"));
  }
  next();
});

const Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;
