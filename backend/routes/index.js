const express = require("express");
const productsRouter = require("./product.routes");
const customerRouter = require("./customer.routes");
const orderRouter = require("./orders.routes");
const expenseRouter = require("./expenses.routes");
const ledgerRouter = require("./ledger.routes");

const router = express.Router();

router.use("/products", productsRouter);
router.use("/customers", customerRouter);
router.use("/orders", orderRouter);
router.use("/expenses", expenseRouter);
router.use("/ledger", ledgerRouter);
module.exports = router;
