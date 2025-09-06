import React from "react";
import Logo from "./Logo";
import RouteSelect from "./RouteSelect";
import { IoMenu } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div>
      <IoMenu size={30} className="sm:hidden" />

      <div className="overflow-y sticky top-4 h-[calc(100vh-40px)]   ">
        <Logo />
        <RouteSelect />
      </div>
    </div>
  );
};

export default Sidebar;
