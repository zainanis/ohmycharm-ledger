const { Ledger } = require("../models/index");
const getAllLedger = async (req, res) => {
  try {
    const allEntries = await Ledger.find()
      .populate({
        path: "orderId",
        populate: { path: "customerId", select: "name" },
        select: "customerId",
      })
      .populate({ path: "expenseId", select: "name" });

    const formattedEntries = allEntries.map((entry) => {
      const hasOrder = entry.orderId ? true : false;

      return {
        _id: entry._id,
        date: entry.date,
        type: entry.type,
        paymentMode: entry.paymentMode,
        amount: entry.amount,
        source: hasOrder ? entry.orderId.customerId.name : entry.expenseId.name,
      };
    });

    console.log(allEntries);
    res.status(200).json(formattedEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllLedger };
