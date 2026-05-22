const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const validate = require("../middleware/validate");

const router = express.Router();

const productSchema = {
  name: { required: true, type: "string" },
  price: { required: true },
};

router.post("/", validate(productSchema), createProduct);

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
