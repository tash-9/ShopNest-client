import { useEffect, useState } from "react";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../services/api";
import { Order } from "../../types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/mine?page=${p}&limit=10`);
      setOrders(res.data.items);
      setPages(res.data.pages);
      setPage(p);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const toggle = (id: string) => setExpanded((e) => (e === id ? null : id));

  if (loading) return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-20">
          <ShoppingBag size={48} className="text-gray-200 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 mb-1">No orders yet</h3>
          <p className="text-sm text-gray-400">Your order history will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expanded === order._id;
            const stepIdx = STATUS_STEPS.indexOf(order.status);

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <button onClick={() => toggle(order._id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShoppingBag size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-gray-50 px-6 py-5 space-y-5">
                    {/* Progress tracker */}
                    {order.status !== "cancelled" && (
                      <div className="flex items-center gap-0">
                        {STATUS_STEPS.map((s, i) => (
                          <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${i <= stepIdx ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                              {i < stepIdx ? "✓" : i + 1}
                            </div>
                            <div className="flex-1 mx-1">
                              <p className={`text-xs capitalize font-medium ${i <= stepIdx ? "text-indigo-600" : "text-gray-400"}`}>{s}</p>
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`h-0.5 flex-1 mx-1 ${i < stepIdx ? "bg-indigo-600" : "bg-gray-100"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/48"; }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-sm font-bold text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-700">{order.shippingAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment</h4>
                        <p className="text-sm text-gray-700 capitalize">{order.paymentMethod}</p>
                        <div className="mt-2 text-sm space-y-1 text-gray-600">
                          <div className="flex justify-between"><span>Items</span><span>${order.total.toFixed(2)}</span></div>
                          <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1 mt-1"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => fetchOrders(page - 1)} disabled={page === 1}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {pages}</span>
              <button onClick={() => fetchOrders(page + 1)} disabled={page === pages}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
