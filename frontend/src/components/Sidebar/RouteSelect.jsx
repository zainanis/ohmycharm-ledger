import React from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { LuBoxes } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { NavLink } from "react-router";

const routes = [
  { path: "/",          title: "Dashboard", Icon: BiSolidDashboard },
  { path: "/products",  title: "Products",  Icon: LuBoxes },
  { path: "/customers", title: "Customers", Icon: MdAccountCircle },
  { path: "/expenses",  title: "Expenses",  Icon: AiFillDollarCircle },
  { path: "/orders",    title: "Orders",    Icon: FaShoppingCart },
  { path: "/ledger",    title: "Ledger",    Icon: BsFillFileEarmarkSpreadsheetFill },
];

const RouteSelect = ({ onNavClick }) => {
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
      style={({ isActive }) =>
        isActive
          ? {
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: "0.85rem",
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: "none",
              transition: "all 0.18s cubic-bezier(0.22,1,0.36,1)",
              background: "rgba(0,0,0,0.22)",
              color: "#fff8fc",
              boxShadow: "inset 3px 0 0 #c9976b, inset 0 0 0 1px rgba(255,255,255,0.06)",
              letterSpacing: "0.01em",
            }
          : {
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: "0.85rem",
              fontWeight: 400,
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: "none",
              transition: "all 0.18s cubic-bezier(0.22,1,0.36,1)",
              color: "rgba(255, 210, 228, 0.72)",
              letterSpacing: "0.01em",
            }
      }
      onMouseEnter={(e) => {
        if (e.currentTarget.getAttribute("aria-current") !== "page") {
          e.currentTarget.style.background = "rgba(0,0,0,0.14)";
          e.currentTarget.style.color = "#fff8fc";
        }
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget.getAttribute("aria-current") !== "page") {
          e.currentTarget.style.background = "";
          e.currentTarget.style.color = "rgba(255, 210, 228, 0.72)";
        }
      }}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={15}
            style={{
              color: isActive ? "#e8b87a" : "inherit",
              flexShrink: 0,
              transition: "color 0.18s",
            }}
          />
          <span>{title}</span>
        </>
      )}
    </NavLink>
  );
};
