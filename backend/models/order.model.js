const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["Placed", "In Progress", "Sent", "Delivered"],
      default: "Placed",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    sentDate: {
      type: Date,
    },
    recieveDate: {
      type: Date,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
