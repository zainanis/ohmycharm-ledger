import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router";
import logo from "../assets/log.png";

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
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
