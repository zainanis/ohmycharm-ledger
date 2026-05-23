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
    paymentMode: {
      type: String,
      enum: ["Cash", "Online"],
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    delivery: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

orderSchema.index({ orderDate: -1 });
orderSchema.index({ sentDate: -1 });
orderSchema.index({ recieveDate: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentMode: 1 });
orderSchema.index({ customerId: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
