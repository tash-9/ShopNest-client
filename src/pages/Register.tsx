import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created! Welcome to ShopNest 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  const perks = ["Free shipping on orders over $50", "Exclusive member deals", "Easy order tracking", "30-day return policy"];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left info panel */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-10 text-white">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl mb-8">
            <ShoppingBag size={24} /> ShopNest
          </Link>
          <h2 className="text-3xl font-bold mb-3">Join millions of shoppers</h2>
          <p className="text-indigo-200 mb-8 leading-relaxed">Create your free account and start discovering amazing products at unbeatable prices.</p>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm">
                <CheckCircle size={18} className="text-indigo-300 flex-shrink-0" /> {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xl mb-2">
              <ShoppingBag size={24} /> ShopNest
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Start shopping in under a minute</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required
                placeholder="John Smith"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${form.password.length < 6 ? "w-1/3 bg-red-400" : form.password.length < 10 ? "w-2/3 bg-amber-400" : "w-full bg-green-500"}`} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} required
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${form.confirm && form.confirm !== form.password ? "border-red-300" : "border-gray-200"}`} />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
