import { useState, FormEvent } from "react";
import { Camera, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.patch("/users/profile", form);
      updateUser(updated.data);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {/* Avatar preview */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-50">
          <div className="relative">
            <img src={form.avatar || user?.avatar} alt={user?.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 bg-indigo-50"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`; }} />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
              <Camera size={14} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={user?.email} disabled
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar URL</label>
            <input type="url" value={form.avatar} onChange={(e) => set("avatar", e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <p className="text-xs text-gray-400 mt-1">Paste a URL to a publicly accessible image</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
            <textarea value={form.address} onChange={(e) => set("address", e.target.value)}
              rows={3} placeholder="123 Main Street, San Francisco, CA 94105"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60">
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
