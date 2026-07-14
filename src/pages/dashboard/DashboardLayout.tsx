import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, ShoppingBag, Package, PlusCircle,
  Users, ClipboardList, LogOut, ShoppingCart, Menu, X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", end: true, icon: LayoutDashboard, label: "Overview" },
    { to: "/dashboard/profile", icon: User, label: "My Profile" },
    { to: "/dashboard/my-orders", icon: ShoppingBag, label: "My Orders" },
    { to: "/dashboard/products/add", icon: PlusCircle, label: "Add Product" },
    { to: "/dashboard/products/manage", icon: Package, label: "My Products" },
    ...(user?.role === "admin" ? [
      { to: "/dashboard/all-users", icon: Users, label: "All Users" },
      { to: "/dashboard/all-orders", icon: ClipboardList, label: "All Orders" },
    ] : []),
  ];

  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* User info */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-indigo-600 font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={link} onClick={() => setSidebarOpen(false)}>
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <NavLink to="/shop" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <ShoppingCart size={18} /> Back to Shop
        </NavLink>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dashboard</p>
        </div>
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dashboard</p>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-800 text-sm">Dashboard</span>
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
