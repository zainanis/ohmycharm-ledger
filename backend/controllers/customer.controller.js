const { Customer, Order } = require("../models/index");

const getAllCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find({});
    res.status(200).json(allCustomers);
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
        name,
        address,
        phoneNumber,
        email,
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
  try {
    const { id } = req.params;

    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer)
      return res.status(404).json("Customer does not exist.");
    res.status(200).json({ msg: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
