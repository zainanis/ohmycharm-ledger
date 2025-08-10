import React from "react";
import Logo from "./logo";
import RouteSelect from "./RouteSelect";

const Sidebar = () => {
  return (
    <div>
      <div className="overflow-y sticky top-4 h-[calc(100vh-40px)]  ">
        <Logo />
        <RouteSelect />
      </div>
    </div>
  );
};

export default Sidebar;
