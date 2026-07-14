import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, X } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty", "Toys", "Automotive", "Food & Grocery", "Health"];

export default function AddProduct() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    stock: "",
    imageUrl: "",
    tag: "",
    tags: [] as string[],
    specKey: "",
    specValue: "",
    specifications: {} as Record<string, string>,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const addTag = () => {
    if (form.tag.trim() && !form.tags.includes(form.tag.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, f.tag.trim()], tag: "" }));
    }
  };

  const removeTag = (t: string) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const addSpec = () => {
    if (form.specKey.trim() && form.specValue.trim()) {
      setForm((f) => ({ ...f, specifications: { ...f.specifications, [f.specKey.trim()]: f.specValue.trim() }, specKey: "", specValue: "" }));
    }
  };

  const removeSpec = (k: string) => setForm((f) => {
    const specs = { ...f.specifications };
    delete specs[k];
    return { ...f, specifications: specs };
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.category) return toast.error("Please select a category");
    setSaving(true);
    try {
      await api.post("/products", {
        name: form.name,
        shortDescription: form.shortDescription,
        description: form.description,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        category: form.category,
        brand: form.brand,
        stock: parseInt(form.stock || "0"),
        images: form.imageUrl ? [form.imageUrl] : [],
        tags: form.tags,
        specifications: form.specifications,
      });
      toast.success("Product listed successfully!");
      navigate("/dashboard/products/manage");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Product</h1>
      <p className="text-gray-500 text-sm mb-8">Fill in the details below to list your product on ShopNest.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-gray-800">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title *</label>
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description *</label>
            <input type="text" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required
              placeholder="Brief one-line description (shown on cards)"
              maxLength={120}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <p className="text-xs text-gray-400 mt-1">{form.shortDescription.length}/120 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description *</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} required
              rows={5} placeholder="Detailed description of your product, features, what's included, etc."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand *</label>
              <input type="text" value={form.brand} onChange={(e) => set("brand", e.target.value)} required
                placeholder="e.g. Sony, Nike, Apple"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-gray-800">Pricing & Stock</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price ($) *</label>
              <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required
                min="0" step="0.01" placeholder="49.99"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price ($)</label>
              <input type="number" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)}
                min="0" step="0.01" placeholder="69.99 (optional)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)}
                min="0" placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Product Image</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://example.com/product-image.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          {form.imageUrl && (
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Tags</h3>
          <div className="flex gap-2">
            <input type="text" value={form.tag} onChange={(e) => set("tag", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag and press Enter"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <button type="button" onClick={addTag}
              className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium">
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <span key={t} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {t}
                  <button onClick={() => removeTag(t)} className="text-indigo-400 hover:text-indigo-700"><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Specifications</h3>
          <div className="flex gap-2">
            <input type="text" value={form.specKey} onChange={(e) => set("specKey", e.target.value)}
              placeholder="Key (e.g. Battery Life)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <input type="text" value={form.specValue} onChange={(e) => set("specValue", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpec(); } }}
              placeholder="Value (e.g. 30 hours)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <button type="button" onClick={addSpec}
              className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium">
              Add
            </button>
          </div>
          {Object.entries(form.specifications).length > 0 && (
            <div className="space-y-2">
              {Object.entries(form.specifications).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                  <span className="text-sm"><span className="font-medium text-gray-700">{k}:</span> <span className="text-gray-600">{v}</span></span>
                  <button onClick={() => removeSpec(k)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={15} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
            <PlusCircle size={18} />
            {saving ? "Adding Product..." : "Add Product"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard/products/manage")}
            className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
