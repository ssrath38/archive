import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      {/* Mobile Toggle Button */}
      <div className="z-20 flex bg-gray-900 p-4 text-white md:hidden">
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      {/* sidebar */}
      <div
        className={`absolute min-h-screen w-64 transform bg-gray-900 text-white md:relative ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }transition-transform z-20 duration-300 md:static md:block md:translate-x-0`}
      >
        <AdminSidebar />
      </div>
      {/* Main Content */}
      <div className="flex-grow overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
