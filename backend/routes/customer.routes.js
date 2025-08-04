const express = require("express");
const {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  getCustomerOrdersById,
  updateCustomerById,
  deleteUserById,
} = require("../controllers/customer.controller");
const router = express.Router();

router.get("/", getAllCustomers);
router.post("/", createCustomer);
router.get("/:id", getCustomerById);
router.get("/:id/orders", getCustomerOrdersById);
router.put("/:id", updateCustomerById);
router.delete("/:id", deleteUserById);

module.exports = router;
