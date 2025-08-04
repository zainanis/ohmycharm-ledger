const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);

module.exports = router;
