import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const handleOrder = async () => {
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.zip) {
      return toast.error("Please fill in all shipping fields");
    }
    setPlacing(true);
    try {
      const items = cart.map((i) => ({ productId: i.productId, name: i.name, image: i.image, price: i.price, quantity: i.quantity }));
      await api.post("/orders", { items, shippingAddress: address, paymentMethod: "card" });
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/dashboard/my-orders");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link to="/shop" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          {step === "cart" ? `Shopping Cart (${totalItems} items)` : "Checkout"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items / Shipping form */}
          <div className="lg:col-span-2 space-y-4">
            {step === "cart" ? (
              <>
                {shipping === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-green-700">
                    <Truck size={16} /> You qualify for <strong>free shipping</strong>!
                  </div>
                )}
                {cart.map((item) => (
                  <div key={item.productId} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                    <Link to={`/products/${item.productId}`}>
                      <img src={item.image} alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl bg-gray-50 hover:opacity-80 transition-opacity"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/80"; }} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId}`}>
                        <h3 className="font-semibold text-gray-800 text-sm hover:text-indigo-600 transition-colors line-clamp-2">{item.name}</h3>
                      </Link>
                      <p className="text-indigo-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-semibold text-gray-800">Shipping Information</h3>
                {[
                  { key: "fullName", label: "Full Name", placeholder: "John Smith", type: "text" },
                  { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel" },
                  { key: "address", label: "Street Address", placeholder: "123 Main Street, Apt 4B", type: "text" },
                  { key: "city", label: "City", placeholder: "San Francisco", type: "text" },
                  { key: "zip", label: "ZIP Code", placeholder: "94105", type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder}
                      value={address[field.key as keyof typeof address]}
                      onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {step === "cart" ? (
                <button onClick={() => setStep("checkout")}
                  className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              ) : (
                <div className="space-y-3 mt-5">
                  <button onClick={handleOrder} disabled={placing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
                    {placing ? "Placing Order..." : "Place Order"}
                  </button>
                  <button onClick={() => setStep("cart")}
                    className="w-full border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Back to Cart
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">Secure checkout with 256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
