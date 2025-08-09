import { Search } from "./Search";
import { CompleteSidebar } from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <CompleteSidebar />
      <div className="flex flex-col">
        <Search />
        {children}
      </div>
    </div>
  );
};

export default Layout;
