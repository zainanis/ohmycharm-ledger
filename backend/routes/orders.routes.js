const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderById);

module.exports = router;
