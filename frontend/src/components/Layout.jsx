import { Sidebar, SidebarItem } from "./Sidebar";
import {
  Boxes,
  Package,
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Receipt,
} from "lucide-react";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
        <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" />
        <SidebarItem icon={<UserCircle size={20} />} text="Customers" />
        <SidebarItem icon={<Boxes size={20} />} text="Products" />
        <SidebarItem icon={<Package size={20} />} text="Orders" />
        <SidebarItem icon={<Receipt size={20} />} text="Ledger" />
      </Sidebar>
      {children}
    </div>
  );
};

export default Layout;
