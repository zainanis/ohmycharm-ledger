const { Product } = require("../models/index");

const createProduct = async (req, res) => {
  try {
    const { name, price, description, status } = req.body;
    const product = await Product.create({
      name,
      price,
      description,
      ...(status && { status }),
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 12 } = req.query;

    const match = {};
    if (status) match.status = status;
    if (search) match.name = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [total, data] = await Promise.all([
      Product.countDocuments(match),
      Product.find(match).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ]);

    res.status(200).json({ data, total, page: Number(page), limit: Number(limit) });
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
