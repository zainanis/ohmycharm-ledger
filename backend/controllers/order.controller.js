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

    if (!products || products.length <= 0)
      return res.status(400).json("No products provided for the order.");

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
      const product = await Product.findById(item._id, null, { session });

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json("product does not exist");
      }

      const computedPrice = product.price * item.quantity;
      const [newprodorder] = await ProdOrder.create(
        [
          {
            productId: product._id,
            orderId: newOrder._id,
            quantity: item.quantity,
            totalPrice: computedPrice,
          },
        ],
        { session }
      );

      totalAmount += computedPrice;
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
    const {
      status, paymentMode, sortBy = "orderDate",
      from, to, search,
      page = 1, limit = 20,
    } = req.query;

    const dateField = ["orderDate", "sentDate", "recieveDate"].includes(sortBy) ? sortBy : "orderDate";
    const match = {};

    if (status) match.status = status;
    if (paymentMode) match.paymentMode = paymentMode;
    if (from || to) {
      match[dateField] = {};
      if (from) match[dateField].$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        match[dateField].$lte = toDate;
      }
    }
    const skip = (Number(page) - 1) * Number(limit);

    if (search) {
      const customers = await Customer.find(
        { name: { $regex: search, $options: "i" } },
        "_id"
      ).lean();
      match.customerId = { $in: customers.map((c) => c._id) };
    }

    const [total, data] = await Promise.all([
      Order.countDocuments(match),
      Order.find(match)
        .populate("customerId", "name")
        .sort({ [dateField]: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
    ]);

    res.status(200).json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [order, products] = await Promise.all([
      Order.findById(id).populate("customerId", "name email phoneNumber address").lean(),
      ProdOrder.find({ orderId: id }).populate("productId", "name price").lean(),
    ]);
    if (!order) return res.status(404).json("Order does not exists");
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

    session.startTransaction();

    if (products) {
      await ProdOrder.deleteMany({ orderId: id }, { session });

      for (const item of products) {
        const product = await Product.findById(item._id, null, { session });

        if (!product) {
          await session.abortTransaction();
          return res.status(404).json("product does not exist");
        }

        const computedPrice = product.price * item.quantity;
        const [newprodorder] = await ProdOrder.create(
          [
            {
              productId: product._id,
              orderId: id,
              quantity: item.quantity,
              totalPrice: computedPrice,
            },
          ],
          { session }
        );
        totalAmount += computedPrice;
        prodOrderDocs.push(newprodorder);
      }
      totalAmount = totalAmount - (discount ?? 0);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        ...(status !== undefined && { status }),
        ...(orderDate !== undefined && { orderDate }),
        ...(sentDate !== undefined && { sentDate }),
        ...(recieveDate !== undefined && { recieveDate }),
        ...(paymentMode !== undefined && { paymentMode }),
        ...(discount !== undefined && { discount }),
        ...(products && { totalAmount }),
      },
      { new: true, runValidators: true, session }
    );

    if (products) {
      await Ledger.findOneAndUpdate(
        { orderId: id },
        {
          ...(orderDate !== undefined && { date: orderDate }),
          ...(paymentMode !== undefined && { paymentMode }),
          amount: totalAmount,
        },
        { session, runValidators: true }
      );
    }

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
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    await session.startTransaction();

    const deletedOrder = await Order.findByIdAndDelete(id, { session });

    if (!deletedOrder) {
      await session.abortTransaction();
      return res.status(404).json("Order doesnot exist.");
    }

    await ProdOrder.deleteMany({ orderId: id }, { session });
    await Ledger.deleteOne({ orderId: id }, { session });

    await session.commitTransaction();
    res.status(200).json("Order deleted");
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json(error.message);
  } finally {
    session.endSession();
  }
};
const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery } = req.body;
    if (typeof delivery !== "number" || delivery < 0)
      return res.status(400).json("delivery must be a non-negative number");
    const updated = await Order.findByIdAndUpdate(
      id,
      { delivery },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json("Order does not exist");
    res.status(200).json(updated);
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
  updateDelivery,
};
