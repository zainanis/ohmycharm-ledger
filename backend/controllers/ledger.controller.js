const { Ledger } = require("../models/index");

const getAllLedger = async (req, res) => {
  try {
    const { type, paymentMode, from, to, page = 1, limit = 20 } = req.query;

    const match = {};
    if (type && type !== "All") {
      const types = type.split(",").map((t) => t.trim());
      match.type = types.length === 1 ? types[0] : { $in: types };
    }
    if (paymentMode && paymentMode !== "All") match.paymentMode = paymentMode;
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        match.date.$lte = toDate;
      }
    }

    // Fetch all matching entries sorted by date to compute running totals correctly
    const allEntries = await Ledger.find(match)
      .populate({
        path: "orderId",
        populate: { path: "customerId", select: "name" },
        select: "customerId",
      })
      .populate({ path: "expenseId", select: "name" })
      .sort({ date: 1 });

    let running = 0;
    const formatted = allEntries.map((entry) => {
      running = entry.type === "Profit"
        ? running + entry.amount
        : running - entry.amount;

      let source = "Unknown";
      if (entry.orderId && entry.orderId.customerId) source = entry.orderId.customerId.name;
      else if (entry.expenseId) source = entry.expenseId.name;

      return {
        _id: entry._id,
        date: entry.date,
        type: entry.type,
        paymentMode: entry.paymentMode,
        amount: entry.amount,
        source,
        runningTotal: Number(running.toFixed(2)),
      };
    });

    const total = formatted.length;
    const skip = (Number(page) - 1) * Number(limit);
    const data = formatted.slice(skip, skip + Number(limit));

    res.status(200).json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllLedger };
