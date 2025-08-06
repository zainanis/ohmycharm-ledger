const { Product } = require("../models/index");

const createProduct = async (req, res) => {
  try {
    const { name, price, description, status } = req.body;
    if (status === "") {
      status = undefined;
    }
    const product = await Product.create({ name, price, description, status });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, status } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, status },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct)
      return res.status(404).json({ msg: "Product not found" });

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
