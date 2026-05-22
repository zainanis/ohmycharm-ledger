import React from "react";
import Logo from "./Logo";
import RouteSelect from "./RouteSelect";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop overlay (mobile only) */}
      <div
        className={`sidebar-backdrop ${isOpen ? "sidebar-backdrop--open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <Logo />
        <RouteSelect onNavClick={onClose} />
      </aside>
    </>
  );
};

export default Sidebar;
