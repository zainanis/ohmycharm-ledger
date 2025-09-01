import { useEffect, useState } from "react";

import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../state/orderSlice.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ loading: false, what: null });
  const allOrders = useSelector((state) => state.orders.allOrders);

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

  const groupByMonth = () => {
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
        const key = `${
          monthNames[orderDate.getMonth()]
        } ${orderDate.getFullYear()}`;

        if (monthCounts.hasOwnProperty(key)) {
          monthCounts[key]++;
          monthRevenue[key] += order.totalAmount;
        }
      }
    });

    return { monthCounts: monthCounts, monthRevenue: monthRevenue };
  };

  const { monthCounts, monthRevenue } = groupByMonth();

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
      monthCounts[day] = 0;
    }

    let key = null;
    allOrders.forEach((order) => {
      const orderDate = new Date(order.orderDate);

      if (orderDate >= monthStart && orderDate <= monthEnd) {
        runningTotal += order.totalAmount;
        const day = orderDate.getDate();
        if (!monthCounts[day]) {
          monthCounts[day] = 1;
          runningCount++;
        } else {
          monthCounts[day]++;
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
        label: "Orders Per Month",
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
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[100vh] p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div>Orders this month :{ordersMonth.runningCount}</div>
      <div>Revenue this month :{ordersMonth.runningTotal}</div>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex justify-between gap-6">
          <div className="flex-1 min-w-lg">
            <p className="mb-2 text-lg font-semibold">orders this month</p>
            <Bar data={monthData} options={chartOptions} />
          </div>
          <div className="flex-1 min-w-lg">
            <p className="mb-2 text-lg font-semibold">orders per month</p>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="mb-2 text-lg font-semibold">revenue per month</p>
          <Line data={revenueChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
