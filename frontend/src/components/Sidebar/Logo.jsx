import React from "react";
import logo from "../../assets/log.png";

const Logo = () => {
  return (
    <div
      className="flex items-center gap-3 px-2 py-3 mb-5"
      style={{ borderBottom: "1px solid var(--sidebar-border)" }}
    >
      <img
        src={logo}
        className="size-9 rounded-lg shrink-0 object-cover"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
      />
      <div className="leading-tight">
        <span
          className="block text-sm font-semibold"
          style={{ color: "var(--sidebar-text-active)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
        >
          OhMyCharm
        </span>
        <span
          className="block text-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Sukaina Ali
        </span>
      </div>
    </div>
  );
};

export default Logo;
