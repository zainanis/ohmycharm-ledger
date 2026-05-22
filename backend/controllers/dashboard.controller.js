const { Order, Expense } = require("../models/index");

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const yearStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // --- Stats ---
    const [orderStats] = await Order.aggregate([
      {
        $facet: {
          thisMonth: [
            { $match: { orderDate: { $gte: monthStart, $lt: monthEnd } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
          ],
          overall: [
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
          ],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          monthly: [
            { $match: { orderDate: { $gte: yearStart, $lt: monthEnd } } },
            {
              $group: {
                _id: {
                  year: { $year: "$orderDate" },
                  month: { $month: "$orderDate" },
                },
                count: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
          daily: [
            { $match: { orderDate: { $gte: monthStart, $lt: monthEnd } } },
            {
              $group: {
                _id: { $dayOfMonth: "$orderDate" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const [expenseStats] = await Expense.aggregate([
      {
        $facet: {
          overall: [{ $group: { _id: null, totalExpense: { $sum: "$cost" } } }],
          monthly: [
            { $match: { date: { $gte: yearStart, $lt: monthEnd } } },
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                },
                amount: { $sum: "$cost" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
        },
      },
    ]);

    const MONTH_NAMES = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    // Build 12-month skeleton (including current month via i=0)
    const monthlyMap = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = { orders: 0, revenue: 0, expenses: 0 };
    }

    for (const m of orderStats.monthly) {
      const key = `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`;
      if (key in monthlyMap) {
        monthlyMap[key].orders = m.count;
        monthlyMap[key].revenue = m.revenue;
      }
    }
    for (const m of expenseStats.monthly) {
      const key = `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`;
      if (key in monthlyMap) monthlyMap[key].expenses = m.amount;
    }

    // Build daily skeleton for current month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyMap = {};
    for (let d = 1; d <= daysInMonth; d++) dailyMap[`day ${d}`] = 0;
    for (const d of orderStats.daily) dailyMap[`day ${d._id}`] = d.count;

    const orderStatusMap = {};
    for (const s of orderStats.byStatus) orderStatusMap[s._id] = s.count;

    const thisMonth = orderStats.thisMonth[0] ?? { count: 0, revenue: 0 };
    const totalRevenue = orderStats.overall[0]?.totalRevenue ?? 0;
    const totalExpense = expenseStats.overall[0]?.totalExpense ?? 0;

    res.status(200).json({
      stats: {
        ordersThisMonth: thisMonth.count,
        revenueThisMonth: thisMonth.revenue,
        totalRevenue,
        totalExpense,
        netProfit: totalRevenue - totalExpense,
      },
      charts: {
        monthly: monthlyMap,
        daily: dailyMap,
        orderStatus: orderStatusMap,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard };
