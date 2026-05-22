const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function groupByMonthExpenses(allExpenses) {
  const monthExpenses = {};
  let totalExpense = 0;

  const actual = new Date();
  const now = new Date(actual.getFullYear(), actual.getMonth(), 1);
  const nextMonth = new Date(actual.getFullYear(), actual.getMonth() + 1, 1);
  const aYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthExpense = { [MONTH_NAMES[now.getMonth()]]: 0 };

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthExpenses[`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`] = 0;
  }

  allExpenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    if (expenseDate >= aYearAgo && expenseDate < nextMonth) {
      const key = `${MONTH_NAMES[expenseDate.getMonth()]} ${expenseDate.getFullYear()}`;
      if (key in monthExpenses) {
        monthExpenses[key] += expense.cost;
        totalExpense += expense.cost;
      }
    }
    if (
      expenseDate.getFullYear() === now.getFullYear() &&
      expenseDate.getMonth() === now.getMonth()
    ) {
      monthExpense[MONTH_NAMES[now.getMonth()]] += expense.cost;
    }
  });

  return {
    monthName: MONTH_NAMES[now.getMonth()],
    monthExpense,
    monthExpenses,
    totalExpense,
  };
}

export function groupByMonthOrders(allOrders) {
  const monthCounts = {};
  const monthRevenue = {};
  const orderStatus = {};
  let totalRevenue = 0;

  const actual = new Date();
  const now = new Date(actual.getFullYear(), actual.getMonth(), 1);
  const nextMonth = new Date(actual.getFullYear(), actual.getMonth() + 1, 1);
  const aYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    monthCounts[key] = 0;
    monthRevenue[key] = 0;
  }

  allOrders.forEach((order) => {
    const orderDate = new Date(order.orderDate);
    if (orderDate >= aYearAgo && orderDate < nextMonth) {
      const key = `${MONTH_NAMES[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
      if (key in monthCounts) {
        monthCounts[key]++;
        monthRevenue[key] += order.totalAmount;
        totalRevenue += order.totalAmount;
      }
    }
    orderStatus[order.status] = (orderStatus[order.status] ?? 0) + 1;
  });

  return { orderStatus, monthCounts, monthRevenue, totalRevenue };
}

export function ordersThisMonth(allOrders) {
  let runningCount = 0;
  let runningTotal = 0;
  const monthCounts = {};

  const actual = new Date();
  const monthStart = new Date(actual.getFullYear(), actual.getMonth(), 1);
  const monthEnd = new Date(actual.getFullYear(), actual.getMonth() + 1, 0);

  for (let day = 1; day <= monthEnd.getDate(); day++) {
    monthCounts["day " + day] = 0;
  }

  allOrders.forEach((order) => {
    const orderDate = new Date(order.orderDate);
    if (orderDate >= monthStart && orderDate <= monthEnd) {
      runningTotal += order.totalAmount;
      const day = orderDate.getDate();
      monthCounts["day " + day]++;
      runningCount++;
    }
  });

  return {
    month: MONTH_NAMES[actual.getMonth()],
    days: monthCounts,
    runningCount,
    runningTotal,
  };
}
