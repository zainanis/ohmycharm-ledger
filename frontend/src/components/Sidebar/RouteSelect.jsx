import React from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { LuBoxes } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { NavLink } from "react-router";

const routes = [
  {
    path: "/",
    title: "Dashboard",
    Icon: BiSolidDashboard,
  },
  {
    path: "/products",
    title: "Products",
    Icon: LuBoxes,
  },
  {
    path: "/customers",
    title: "Customers",
    Icon: MdAccountCircle,
  },
  {
    path: "/expenses",
    title: "Expenses",
    Icon: AiFillDollarCircle,
  },
  {
    path: "/orders",
    title: "Orders",
    Icon: FaShoppingCart,
  },
  {
    path: "/ledger",
    title: "Ledger",
    Icon: BsFillFileEarmarkSpreadsheetFill,
  },
];

const RouteSelect = () => {
  return (
    <div className="space-y-1">
      {routes.map(({ path, title, Icon }) => {
        return <Route Icon={Icon} title={title} path={path} />;
      })}
    </div>
  );
};

export default RouteSelect;

const Route = ({ Icon, title, path }) => {
  return (
    <NavLink
      className={({
        isActive,
      }) => `flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 
        text-sm transition-[box-shadow_background-color_color] ${
          isActive
            ? "bg-white text-stone-950 shadow"
            : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
        }`}
      to={path}
    >
      {({ isActive }) => (
        <>
          <Icon className={isActive ? "text-pink-900" : ""} />
          <span>{title}</span>
        </>
      )}
    </NavLink>
  );
};
