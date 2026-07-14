import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Package, ShoppingBag, Users, DollarSign, PlusCircle, ArrowRight } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Order } from "../../types";

const PIE_COLORS = ["#6366f1", "#a78bfa", "#f59e0b", "#34d399", "#f87171"];

export default function DashboardHome() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      Promise.all([api.get("/stats"), api.get("/orders?limit=5")]).then(([s, o]) => {
        setStats(s.data);
        setOrders(o.data.items);
      }).catch(() => {}).finally(() => setLoadingStats(false));
    } else {
      api.get("/orders/mine?limit=5").then((r) => {
        setOrders(r.data.items);
      }).catch(() => {}).finally(() => setLoadingStats(false));
    }
  }, [isAdmin]);

  const statCards = isAdmin && stats ? [
    { label: "Total Users", value: stats.users, icon: Users, color: "bg-indigo-50 text-indigo-600", trend: "+12%" },
    { label: "Active Products", value: stats.products, icon: Package, color: "bg-purple-50 text-purple-600", trend: "+8%" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "bg-amber-50 text-amber-600", trend: "+23%" },
    { label: "Total Revenue", value: `$${Number(stats.revenue).toLocaleString("en-US", { maximumFractionDigits: 0 })}`, icon: DollarSign, color: "bg-green-50 text-green-600", trend: "+18%" },
  ] : [];

  const orderStatusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening in your store today.</p>
        </div>
        <Link to="/dashboard/products/add"
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
          <PlusCircle size={16} /> Add Product
        </Link>
      </div>

      {/* Admin stat cards */}
      {isAdmin && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{card.trend}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts (admin only) */}
      {isAdmin && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-5">Orders by Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.orderChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Products by Category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-5">Products by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.categoryChart} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category }) => category}>
                  {stats.categoryChart.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800">{isAdmin ? "Recent Orders" : "My Recent Orders"}</h3>
          <Link to={isAdmin ? "/dashboard/all-orders" : "/dashboard/my-orders"}
            className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loadingStats ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <ShoppingBag size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                  {isAdmin && <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>}
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</td>
                    {isAdmin && <td className="py-3 px-3 text-gray-700">{order.buyerName}</td>}
                    <td className="py-3 px-3 text-gray-600">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${orderStatusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links for non-admins */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: "/shop", icon: ShoppingBag, label: "Browse Shop", desc: "Discover new products", color: "text-indigo-600 bg-indigo-50" },
            { to: "/dashboard/products/add", icon: PlusCircle, label: "Add a Product", desc: "List something for sale", color: "text-purple-600 bg-purple-50" },
            { to: "/dashboard/products/manage", icon: Package, label: "My Products", desc: "View & manage listings", color: "text-amber-600 bg-amber-50" },
          ].map((item) => (
            <Link key={item.to} to={item.to}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
