import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../services/api";
import { Order } from "../../types";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: "10" };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/orders", { params });
      setOrders(res.data.items);
      setPages(res.data.pages);
      setTotal(res.data.total);
      setPage(p);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: status as Order["status"] } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) =>
    o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
    o.buyerEmail.toLowerCase().includes(search.toLowerCase()) ||
    o._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or order ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
            <p className="text-gray-400 text-sm">No orders found</p>
          </div>
        ) : (
          filtered.map((order) => {
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setExpanded((e) => e === order._id ? null : order._id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{order.buyerName} · {order.buyerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-50 px-6 py-5 space-y-4">
                    {/* Status update */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-600 font-medium">Update Status:</span>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map((s) => (
                          <button key={s} onClick={() => updateStatus(order._id, s)}
                            disabled={order.status === s || updating === order._id}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${order.status === s ? STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-indigo-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-white"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/40"; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">×{item.quantity} at ${item.price.toFixed(2)}</p>
                          </div>
                          <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping */}
                    <div className="bg-gray-50 rounded-xl p-4 text-sm">
                      <p className="font-semibold text-gray-700 mb-1">Ship to:</p>
                      <p className="text-gray-600">{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
                      <p className="text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => fetchOrders(page - 1)} disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Previous</button>
          <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {pages}</span>
          <button onClick={() => fetchOrders(page + 1)} disabled={page === pages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      )}
    </div>
  );
}
