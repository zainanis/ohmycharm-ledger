import { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router";
import logo from "../assets/log.png";
import api from "../utils/client.js";
import { queryClient } from "../main.jsx";

const prefetchTargets = [
  { key: ["products",  1, "All", ""],                    url: "/api/products",  params: { page: 1, limit: 12 } },
  { key: ["customers", 1, ""],                           url: "/api/customers", params: { page: 1, limit: 12 } },
  { key: ["orders",    1, "All", "status", "orderDate", "", "", ""], url: "/api/orders",   params: { page: 1, limit: 20, sortBy: "orderDate" } },
  { key: ["expenses",  1, "All", "type",   "", ""],      url: "/api/expenses",  params: { page: 1, limit: 20 } },
  { key: ["ledger",    1, "All", "type",   "", ""],      url: "/api/ledger",    params: { page: 1, limit: 20 } },
];

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentRoute = location.pathname.split("/")[1] || "dashboard";
    const t = setTimeout(() => {
      prefetchTargets.forEach(({ key, url, params }) => {
        if (key[0] === currentRoute) return; // active page fetches its own data
        queryClient.prefetchQuery({
          queryKey: key,
          queryFn: () => api.get(url, { params }).then((r) => r.data),
          staleTime: 2 * 60 * 1000,
        });
      });
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <div className="mobile-topbar">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} className="size-7 rounded-lg object-cover" />
          <span style={{ color: "var(--sidebar-text-active)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 600 }}>
            OhMyCharm
          </span>
        </div>
      </div>

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 overflow-y-auto min-h-screen" style={{ minWidth: 0 }}>
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
