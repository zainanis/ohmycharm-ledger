import React from "react";

import logo from "../../assets/log.png";

const Logo = () => {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300 ">
      <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full">
        <img src={logo} className="size-10 rounded shrink-0" />
        <div className="text-start">
          <span className="text-sm font-bold block">OhMyCharm</span>
          <span className="text-xs block text-stone-500">Sukaina Ali</span>
        </div>
      </button>
    </div>
  );
};

export default Logo;
