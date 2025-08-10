import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <main className="bg-stone-100 text-stone-950 grid gap-4 p-4 grid-cols-[220px_1fr] ">
      <Sidebar />
      <Outlet />
    </main>
  );
};

export default Layout;
