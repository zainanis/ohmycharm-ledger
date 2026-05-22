import { useEffect, useState } from "react";
import api from "../utils/client.js";
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
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  CreditCard,
  Gem,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const BAR_COLORS = [
  "#d4856a",
  "#c9976b",
  "#e8b4a0",
  "#dab896",
  "#e8c9b8",
  "#c4a0c0",
  "#b89aaa",
  "#d4b0c8",
  "#c0a8c0",
  "#a89098",
  "#d0a8b8",
  "#e0b8c8",
];

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { display: false }, grid: { display: false } },
    y: {
      grid: { color: "#f5edf2" },
      ticks: { color: "#8a7380", font: { size: 11 } },
    },
  },
};

const ORDER_CHART_OPTS = {
  ...CHART_OPTS,
  scales: {
    ...CHART_OPTS.scales,
    y: {
      ...CHART_OPTS.scales.y,
      ticks: {
        ...CHART_OPTS.scales.y.ticks,
        stepSize: 1,
        callback: (v) => (Number.isInteger(v) ? v : null),
      },
    },
  },
};

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-5">
    <div className="stat-grid">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton rounded-2xl" style={{ height: 110 }} />
      ))}
    </div>
    <div className="chart-grid">
      <div className="skeleton rounded-2xl" style={{ height: 340 }} />
      <div className="skeleton rounded-2xl" style={{ height: 340 }} />
      <div className="skeleton rounded-2xl" style={{ height: 340 }} />
    </div>
  </div>
);

const MONTH_NAMES = [
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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/api/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="page-card ">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="page-body">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const { stats, charts } = data;
  const monthLabels = Object.keys(charts.monthly);
  const currentMonthName = MONTH_NAMES[new Date().getMonth()];

  const monthlyOrdersData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Orders Per Month",
        data: monthLabels.map((k) => charts.monthly[k].orders),
        backgroundColor: BAR_COLORS,
        borderRadius: 4,
      },
    ],
  };
  const dailyData = {
    labels: Object.keys(charts.daily),
    datasets: [
      {
        label: "Orders Per Day",
        data: Object.values(charts.daily),
        backgroundColor: BAR_COLORS,
        borderRadius: 4,
      },
    ],
  };
  const revenueChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Revenue Per Month",
        data: monthLabels.map((k) => charts.monthly[k].revenue),
        fill: true,
        borderColor: "#8b2252",
        backgroundColor: "rgba(139,34,82,0.06)",
        tension: 0.4,
        pointBackgroundColor: "#8b2252",
        pointRadius: 4,
      },
    ],
  };
  const expenseChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Expenses Per Month",
        data: monthLabels.map((k) => charts.monthly[k].expenses),
        fill: true,
        borderColor: "#c9976b",
        backgroundColor: "rgba(201,151,107,0.06)",
        tension: 0.4,
        pointBackgroundColor: "#c9976b",
        pointRadius: 4,
      },
    ],
  };
  const statusLabels = Object.keys(charts.orderStatus);
  const orderStatusData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusLabels.map((k) => charts.orderStatus[k]),
        backgroundColor: [
          "#8b2252",
          "#c9976b",
          "#d4856a",
          "#b89aaa",
          "#a8325f",
          "#c4a0c0",
        ],
        hoverOffset: 6,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="page-card ">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="page-body">
        {/* Stat cards */}
        <div className="stat-grid">
          <Card
            title="Orders this month"
            data={stats.ordersThisMonth}
            icon={ShoppingBag}
          />
          <Card
            title="Revenue this month"
            data={`${Number(stats.revenueThisMonth).toLocaleString()} PKR`}
            icon={TrendingUp}
            accent="var(--gold)"
          />
          <Card
            title="Overall revenue"
            data={`${Number(stats.totalRevenue).toLocaleString()} PKR`}
            icon={DollarSign}
            accent="#16a34a"
          />
          <Card
            title="Overall expense"
            data={`${Number(stats.totalExpense).toLocaleString()} PKR`}
            icon={CreditCard}
            accent="#dc2626"
          />
          <Card
            title="Net profit"
            data={`${Number(stats.netProfit).toLocaleString()} PKR`}
            icon={Gem}
            accent={stats.netProfit >= 0 ? "#16a34a" : "#dc2626"}
          />
        </div>

        {/* Charts row */}
        <div className="chart-grid">
          {/* Orders charts */}
          <div className="chart-panel">
            <h2>Orders</h2>
            <div className="charts-row">
              <div>
                <p className="chart-sub-label">{currentMonthName} — daily</p>
                <div className="chart-wrapper">
                  <Bar data={dailyData} options={ORDER_CHART_OPTS} />
                </div>
              </div>
              <div>
                <p className="chart-sub-label">Sales per month</p>
                <div className="chart-wrapper">
                  <Bar data={monthlyOrdersData} options={ORDER_CHART_OPTS} />
                </div>
              </div>
            </div>
          </div>

          {/* Order status doughnut */}
          <div className="doughnut-panel">
            <div className="flex flex-col items-center gap-2">
              <p className="chart-sub-label">Order Status</p>
              <div
                style={{
                  position: "relative",
                  width: 180,
                  height: 180,
                  flexShrink: 0,
                }}
              >
                <Doughnut
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    cutout: "70%",
                  }}
                />
              </div>
            </div>
            <div className="doughnut-legend">
              {statusLabels.map((label, i) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background:
                        orderStatusData.datasets[0].backgroundColor[i],
                    }}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue + Expense charts */}
          <div className="chart-panel">
            <h2>Finance</h2>
            <div className="charts-row">
              <div>
                <p className="chart-sub-label">Revenue per month</p>
                <div className="chart-wrapper">
                  <Line data={revenueChartData} options={CHART_OPTS} />
                </div>
              </div>
              <div>
                <p className="chart-sub-label">Expenses per month</p>
                <div className="chart-wrapper">
                  <Line data={expenseChartData} options={CHART_OPTS} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
