import React from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { LuBoxes } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { NavLink } from "react-router";

const routes = [
  { path: "/",         title: "Dashboard", Icon: BiSolidDashboard },
  { path: "/products", title: "Products",  Icon: LuBoxes },
  { path: "/customers",title: "Customers", Icon: MdAccountCircle },
  { path: "/expenses", title: "Expenses",  Icon: AiFillDollarCircle },
  { path: "/orders",   title: "Orders",    Icon: FaShoppingCart },
  { path: "/ledger",   title: "Ledger",    Icon: BsFillFileEarmarkSpreadsheetFill },
];

const RouteSelect = ({ onNavClick }) => {
  return (
    <nav className="flex flex-col gap-0.5">
      {routes.map(({ path, title, Icon }) => (
        <Route key={path} icon={Icon} title={title} path={path} onNavClick={onNavClick} />
      ))}
    </nav>
  );
};

export default RouteSelect;

const Route = ({ icon, title, path, onNavClick }) => {
  const Icon = icon;
  return (
    <NavLink
      to={path}
      end={path === "/"}
      onClick={onNavClick}
      className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
      style={({ isActive }) =>
        isActive
          ? {
              background: "var(--sidebar-active)",
              color: "var(--sidebar-text-active)",
              boxShadow: "inset 0 0 0 1px var(--sidebar-active-border)",
            }
          : {
              color: "var(--sidebar-text)",
            }
      }
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains("active")) {
          e.currentTarget.style.background = "var(--sidebar-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.style.boxShadow) {
          e.currentTarget.style.background = "";
        }
      }}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={15}
            style={{ color: isActive ? "var(--sidebar-icon-active)" : "inherit", flexShrink: 0 }}
          />
          <span>{title}</span>
        </>
      )}
    </NavLink>
  );
};
