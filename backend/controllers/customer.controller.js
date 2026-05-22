const { Customer, Order, ProdOrder, Ledger } = require("../models/index");
const mongoose = require("mongoose");

const getAllCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;

    const match = {};
    if (search) match.name = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [total, data] = await Promise.all([
      Customer.countDocuments(match),
      Customer.find(match).sort({ name: 1 }).skip(skip).limit(Number(limit)),
    ]);

    res.status(200).json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, address, phoneNumber, email } = req.body;

    if (!name || !address || !phoneNumber)
      return res
        .status(400)
        .json("Name, Address, and Phone Number are required fields.");

    const newCustomer = await Customer.create({
      name,
      address,
      phoneNumber,
      email,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) return res.status(404).json("Customer does not exist.");

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCustomerOrdersById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) return res.status(404).json("Customer does not exist.");
    const customerOrders = await Order.find({ customerId: id });

    res.status(200).json(customerOrders);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, address, phoneNumber, email } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        ...(name !== undefined && { name }),
        ...(address !== undefined && { address }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(email !== undefined && { email }),
      },
      { runValidators: true, new: true }
    );
    if (!updatedCustomer)
      return res.status(404).json("Customer does not exist.");

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteUserById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    await session.startTransaction();

    const deletedCustomer = await Customer.findByIdAndDelete(id, { session });
    if (!deletedCustomer) {
      await session.abortTransaction();
      return res.status(404).json("Customer does not exist.");
    }

    const customerOrders = await Order.find({ customerId: id }, "_id", { session });
    const orderIds = customerOrders.map((o) => o._id);

    if (orderIds.length > 0) {
      await ProdOrder.deleteMany({ orderId: { $in: orderIds } }, { session });
      await Ledger.deleteMany({ orderId: { $in: orderIds } }, { session });
      await Order.deleteMany({ customerId: id }, { session });
    }

    await session.commitTransaction();
    res.status(200).json({ msg: "Customer deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  getCustomerOrdersById,
  updateCustomerById,
  deleteUserById,
};
