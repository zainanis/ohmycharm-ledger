const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  updateDelivery,
} = require("../controllers/order.controller");
const validate = require("../middleware/validate");

const router = express.Router();

const orderSchema = {
  customerId: { required: true, type: "string" },
  paymentMode: { required: true, type: "string", enum: ["Cash", "Online"] },
  products: { required: true },
};

router.post("/", validate(orderSchema), createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderById);
router.patch("/:id/delivery", updateDelivery);
router.delete("/:id", deleteOrderById);

module.exports = router;
