import { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../state/orderSlice.js";
import { setExpenses } from "../state/expenseSlice.js";
import Card from "../components/utils/Card.jsx";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ loading: false, what: null });
  const allOrders = useSelector((state) => state.orders.allOrders);
  const allExpenses = useSelector((state) => state.expenses.allExpenses);

  useEffect(() => {
    if (allOrders.length === 0) {
      setLoading({ loading: true, what: "Orders" });
      axios
        .get("http://localhost:5001/api/orders")
        .then((res) => {
          dispatch(setOrders(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading({ loading: false, what: null });
        });
    }
    if (allExpenses.length === 0) {
      setLoading({ loading: true, what: "Expenses" });
      axios
        .get("http://localhost:5001/api/expenses")
        .then((res) => {
          dispatch(setExpenses(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading({ loading: false, what: null });
        });
    }
  }, []);
  const barColors = [
    "#FFB3BA", // Pastel red
    "#FFDFBA", // Pastel orange
    "#FFFFBA", // Pastel yellow
    "#BAFFC9", // Pastel green
    "#BAE1FF", // Pastel blue
    "#D7BAFF", // Pastel purple
    "#FFC0CB", // Light pink
    "#B0E0E6", // Powder blue
    "#FADADD", // Pale pink
    "#E6E6FA", // Lavender
    "#FFE4B5", // Moccasin
    "#E0FFFF", // Light cyan
  ];

  const groupByMonthExpenses = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthExpenses = {};
    let totalExpense = 0;

    const actual = new Date();
    const now = new Date(actual.getFullYear(), actual.getMonth(), 1);

    const aYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const monthExpense = {
      [monthNames[now.getMonth()]]: 0,
    };

    const monthsInRange = [];

    for (let i = 11; i >= 1; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthsInRange.push(key);
      monthExpenses[key] = 0;
    }

    allExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);

      if (expenseDate >= aYearAgo && expenseDate <= now) {
        const key = `${
          monthNames[expenseDate.getMonth()]
        } ${expenseDate.getFullYear()}`;

        if (monthExpenses.hasOwnProperty(key)) {
          monthExpenses[key] += expense.cost;
          totalExpense += expense.cost;
        }
      }
      if (
        expenseDate.getFullYear() === now.getFullYear() &&
        expenseDate.getMonth() === now.getMonth()
      ) {
        monthExpense[monthNames[now.getMonth()]] += expense.cost;
      }
    });

    return {
      monthName: monthNames[now.getMonth()],
      monthExpense: monthExpense,
      monthExpenses: monthExpenses,
      totalExpense: totalExpense,
    };
  };

  const { monthName, monthExpense, monthExpenses, totalExpense } =
    groupByMonthExpenses();

  const groupByMonthOrders = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthCounts = {};
    const monthRevenue = {};
    const orderStatus = {};
    let totalRevenue = 0;

    const actual = new Date();
    const now = new Date(actual.getFullYear(), actual.getMonth(), 1);

    const aYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const monthsInRange = [];

    for (let i = 11; i >= 1; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthsInRange.push(key);
      monthCounts[key] = 0;
      monthRevenue[key] = 0;
    }

    allOrders.forEach((order) => {
      const orderDate = new Date(order.orderDate);

      if (orderDate >= aYearAgo && orderDate <= now) {
        console.log(order);
        const key = `${
          monthNames[orderDate.getMonth()]
        } ${orderDate.getFullYear()}`;

        if (monthCounts.hasOwnProperty(key)) {
          monthCounts[key]++;
          monthRevenue[key] += order.totalAmount;
          totalRevenue += order.totalAmount;
        }
      }

      if (!orderStatus[order.status]) {
        orderStatus[order.status] = 1;
      } else if (orderStatus[order.status]) {
        orderStatus[order.status] += 1;
      }
    });

    return {
      orderStatus: orderStatus,
      monthCounts: monthCounts,
      monthRevenue: monthRevenue,
      totalRevenue: totalRevenue,
    };
  };

  const { orderStatus, monthCounts, monthRevenue, totalRevenue } =
    groupByMonthOrders();
  console.log("status" + JSON.stringify(orderStatus));
  const ordersThisMonth = () => {
    let runningCount = 0;
    let runningTotal = 0;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthCounts = {};

    const actual = new Date();
    const monthStart = new Date(actual.getFullYear(), actual.getMonth(), 1);
    const monthEnd = new Date(actual.getFullYear(), actual.getMonth() + 1, 0);
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      monthCounts["day " + day] = 0;
    }

    let key = null;
    allOrders.forEach((order) => {
      const orderDate = new Date(order.orderDate);

      if (orderDate >= monthStart && orderDate <= monthEnd) {
        runningTotal += order.totalAmount;
        const day = orderDate.getDate();
        if (!monthCounts["day " + day]) {
          monthCounts["day " + day] = 1;
          runningCount++;
        } else {
          monthCounts["day " + day]++;
          runningCount++;
        }
      }
    });

    return {
      month: monthNames[actual.getMonth()],
      days: monthCounts,
      runningCount: runningCount,
      runningTotal: runningTotal,
    };
  };

  const ordersMonth = ordersThisMonth();

  const chartData = {
    labels: Object.keys(monthCounts),
    datasets: [
      {
        label: "Orders Per Month",
        data: Object.values(monthCounts),
        backgroundColor: barColors,
        borderColor: barColors,
      },
    ],
  };
  const monthData = {
    labels: Object.keys(ordersMonth.days),
    datasets: [
      {
        label: "Orders Per Day",
        data: Object.values(ordersMonth.days),
        backgroundColor: barColors,
        borderColor: barColors,
      },
    ],
  };

  const revenueChartData = {
    labels: Object.keys(monthRevenue),
    datasets: [
      {
        label: "Revenue Per Month",
        data: Object.values(monthRevenue),
        fill: false,
        borderColor: "#4bc0c0",
        backgroundColor: "#4bc0c0",
        tension: 0.3,
      },
    ],
  };
  const expenseChartData = {
    labels: Object.keys(monthExpenses),
    datasets: [
      {
        label: "Expenses Per Month",
        data: Object.values(monthExpenses),
        fill: true,
        borderColor: "#4bc0c0",
        backgroundColor: "#4bc0c0",
        tension: 0.3,
      },
    ],
  };

  const orderStatusData = {
    labels: Object.keys(orderStatus),
    datasets: [
      {
        label: "Order Status",
        data: Object.values(orderStatus),
        backgroundColor: [
          "#FF6384", // red
          "#36A2EB", // blue
          "#FFCE56", // yellow
          "#4BC0C0", // teal
          "#9966FF", // purple
          "#FF9F40", // orange
        ],
        hoverOffset: 6,
      },
    ],
  };
  const doughnutOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // This removes the labels from x-axis
        },
        grid: {
          display: false, // Optional: remove grid lines if desired
        },
      },
    },
  };

  const orderChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // This removes the labels from x-axis
        },
        grid: {
          display: false, // Optional: remove grid lines if desired
        },
      },
      y: {
        ticks: {
          stepSize: 1, // Ensures increments of 1
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null; // Hides decimal values just in case
          },
        },
      },
    },
  };
  console.log(monthExpense);
  return (
    <div className="bg-white rounded-lg pb-4 shadow  p-6 flex flex-col gap-4 max-w-7xl">
      <h2 className="font-bold text-4xl text-pink-900">Dashboard</h2>
      {loading.loading ? (
        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="text-pink-800 font-bold text-xl animate-pulse">
            Loading {loading.what}...
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-4 justify-between">
            <Card title="Orders this month" data={ordersMonth.runningCount} />
            <Card title="Revenue this month" data={ordersMonth.runningTotal} />
            <div className="w-30 flex flex-col items-center gap-0">
              <Doughnut data={orderStatusData} options={doughnutOptions} />
              <h1 className="font-semibold">Order Status</h1>
            </div>
            <Card title="Overall revenue" data={totalRevenue} />
            <Card title="Overall expense" data={totalExpense} />
            {/* <Card title="Expense this month" data={monthExpense[monthName]} /> */}
          </div>

          <div className="flex  justify-between  border-1 border-stone-200 rounded-xl min-w-full">
            <div className="flex gap-6 flex-col rounded-2xl p-6">
              <h1 className="mb-2 font-bold text-2xl">Orders </h1>
              <div className="w-xl">
                <div className="">
                  <p className="mb-2 text-lg font-semibold">
                    {ordersMonth.month}
                  </p>
                  <Bar data={monthData} options={orderChartOptions} />
                </div>
                <div className="">
                  <p className="mb-2 text-lg font-semibold">Sales per Month</p>
                  <Bar data={chartData} options={orderChartOptions} />
                </div>
              </div>
            </div>

            <div className="flex gap-6 flex-col  rounded-2xl p-6">
              <h1 className="mb-2 font-bold text-2xl">Profit and Expenses </h1>

              <div className="w-xl">
                <p className="mb-2 text-lg font-semibold">Revenue per Month</p>
                <Line data={revenueChartData} options={chartOptions} />
              </div>

              <div className="w-xl">
                <p className="mb-2 text-lg font-semibold">Expense per Month</p>
                <Line data={expenseChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
