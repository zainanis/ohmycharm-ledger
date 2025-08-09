import { ChevronFirst, ChevronLast } from "lucide-react";
import { createContext, useContext, useState } from "react";
import logo from "../assets/log.png";
import {
  Boxes,
  Package,
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Receipt,
} from "lucide-react";
const SidebarContext = createContext();

export const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <aside
      className={`h-screen ${
        expanded ? "flex" : "w-20"
      } transition-all duration-300`}
    >
      <nav className="h-full flex flex-col bg-white  shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logo}
            alt="default"
            className={`overflow-hidden transition-all ${
              expanded ? "w-15" : "w-0"
            }`}
          />

          {/* <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 mr-5"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button> */}
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
};

export const SidebarItem = ({ icon, text, active }) => {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
        active
          ? "bg-gradient-to-tr from-pink-200 to-pink-100 text-pink-800"
          : "hover:bg-pink-50 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
    </li>
  );
};

export const CompleteSidebar = () => {
  return (
    <Sidebar>
      <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
      <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" />
      <SidebarItem icon={<UserCircle size={20} />} text="Customers" />
      <SidebarItem icon={<Boxes size={20} />} text="Products" />
      <SidebarItem icon={<Package size={20} />} text="Orders" />
      <SidebarItem icon={<Receipt size={20} />} text="Ledger" />
    </Sidebar>
  );
};
