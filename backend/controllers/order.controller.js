const Product = require("../models/product.model");
const Order = require("../models/order.model");
const ProdOrder = require("../models/prodorder.model");

const createOrder = async (req, res) => {
  try {
    const { customerId, status, orderDate, sentDate, recieveDate, products } =
      req.body;

    if (!products || products.length === 0) {
      return res.status(400).json("No products provided for the order.");
    }

    const newOrder = await Order.create({
      customerId,
      status,
      orderDate,
      sentDate,
      recieveDate,
      totalAmount: 0,
    });

    let totalAmount = 0;
    const prodOrderDocs = [];

    for (const item of products) {
      const product = await Product.findById(item._id);

      if (!product) return res.status(404).json("prodcut does not exists");

      const newprodorder = await ProdOrder.create({
        productId: product._id,
        orderId: newOrder._id,
        quantity: item.quantity,
      });

      totalAmount += newprodorder.totalPrice;
      prodOrderDocs.push(newprodorder);
    }
    newOrder.totalAmount = totalAmount;
    await newOrder.save();

    res.status(201).json({ order: newOrder, items: prodOrderDocs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find().populate("customerId", "name");
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = Order.findById(id);
    if (!order) return res.status(404).json("Order does not exists");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updareOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = Order.findById(id);
    if (!order) return res.status(404).json("Order does not exists");

    const { status, orderDate, sentDate, recieveDate, products } = req.body;
    let totalAmount = 0;
    let prodOrderDocs = [];

    if (products) {
      await ProdOrder.deleteMany({ orderId: id });
      for (const item of products) {
        const product = await Product.findById(item._id);

        if (!product) return res.status(404).json("prodcut does not exists");

        const newprodorder = await ProdOrder.create({
          productId: product._id,
          orderId: newOrder._id,
          quantity: item.quantity,
        });

        totalAmount += newprodorder.totalPrice;
        prodOrderDocs.push(newprodorder);
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(orderDate && { orderDate }),
        ...(sentDate && { sentDate }),
        ...(recieveDate && { recieveDate }),
        ...(products && { totalAmount }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports = { createOrder, getAllOrders, getOrderById, updareOrderById };
