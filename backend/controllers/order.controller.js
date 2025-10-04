const {
  Product,
  Order,
  ProdOrder,
  Customer,
  Ledger,
} = require("../models/index");

const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      customerId,
      status,
      orderDate,
      sentDate,
      recieveDate,
      paymentMode,
      products,
      discount = 0,
    } = req.body;

    if (!(await Customer.findById(customerId)))
      return res.status(404).json("Customer does not exist.");

    if (!products || products.length <= 0) {
      return res.status(400).json("No products provided for the order.");
    }
    session.startTransaction();
    const [newOrder] = await Order.create(
      [
        {
          customerId,
          status,
          orderDate,
          sentDate,
          recieveDate,
          paymentMode,
          discount,
          totalAmount: 0,
        },
      ],
      { session }
    );
    let totalAmount = 0;
    const prodOrderDocs = [];

    for (const item of products) {
      const product = await Product.findById(item._id);

      if (!product) return res.status(404).json("prodcut does not exists");

      const [newprodorder] = await ProdOrder.create(
        [
          {
            productId: product._id,
            orderId: newOrder._id,
            quantity: item.quantity,
          },
        ],
        { session }
      );

      totalAmount += newprodorder.totalPrice;
      prodOrderDocs.push(newprodorder);
    }
    totalAmount = totalAmount - discount;
    newOrder.totalAmount = totalAmount;
    await newOrder.save({ session });

    await Ledger.create(
      [
        {
          date: orderDate,
          type: "Profit",
          orderId: newOrder._id,
          paymentMode: paymentMode,
          amount: totalAmount,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ order: newOrder, items: prodOrderDocs });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
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
    const order = await Order.findById(id);
    if (!order) return res.status(404).json("Order does not exists");
    const products = await ProdOrder.find({ orderId: id }).populate(
      "productId",
      "name price"
    );
    res.status(200).json({ order, products });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateOrderById = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json("Order does not exists");

    const {
      status,
      orderDate,
      sentDate,
      recieveDate,
      paymentMode,
      products,
      discount,
    } = req.body;
    let totalAmount = 0;

    let prodOrderDocs = [];

    if (products) {
      session.startTransaction();

      await ProdOrder.deleteMany({ orderId: id }, { session });

      for (const item of products) {
        const product = await Product.findById(item._id);

        if (!product) return res.status(404).json("prodcut does not exists");

        const [newprodorder] = await ProdOrder.create(
          [
            {
              productId: product._id,
              orderId: id,
              quantity: item.quantity,
            },
          ],

          { session }
        );
        totalAmount = totalAmount - discount;
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
        ...(paymentMode && { paymentMode }),
        ...(discount && { discount }),
        ...(products && { totalAmount }),
      },

      { new: true, runValidators: true, session }
    );

    await Ledger.findOneAndUpdate(
      { orderId: id },

      {
        date: orderDate,
        type: "Profit",
        paymentMode: paymentMode,
        amount: totalAmount,
      },

      { session, runValidators: true }
    );

    await session.commitTransaction();
    res.status(200).json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json(error.message);
  } finally {
    session.endSession();
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) return res.status(404).json("Order doesnot exist.");

    await ProdOrder.deleteMany({ orderId: id });

    await Ledger.deleteOne({ orderId: id });
    res.status(200).json("Order deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
