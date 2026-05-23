const mongoose = require("mongoose");
const Product = require("./product.model");

const prodOrderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

prodOrderSchema.pre("save", async function (next) {
  if (this.totalPrice != null) return next(); // already computed by controller, skip fetch
  try {
    const options = this.$session() ? { session: this.$session() } : {};
    const product = await Product.findById(this.productId, null, options);
    if (!product) return next(new Error("Product not found"));
    this.totalPrice = product.price * this.quantity;
    next();
  } catch (err) {
    next(err);
  }
});

prodOrderSchema.index({ orderId: 1 });

const ProdOrder = mongoose.model("ProdOrder", prodOrderSchema);

module.exports = ProdOrder;
