import { useEffect, useState } from "react";
import { Users, Search, Shield, ShieldOff } from "lucide-react";
import api from "../../services/api";
import { User } from "../../types";
import toast from "react-hot-toast";

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: "10" };
      if (statusFilter) params.status = statusFilter;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get("/users", { params });
      setUsers(res.data.items);
      setPages(res.data.pages);
      setTotal(res.data.total);
      setPage(p);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [statusFilter, roleFilter]);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    setUpdating(user._id);
    try {
      await api.patch(`/users/${user._id}/status`, { status: newStatus });
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus === "active" ? "activated" : "blocked"}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const changeRole = async (user: User, role: string) => {
    setUpdating(user._id);
    try {
      await api.patch(`/users/${user._id}/role`, { role });
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, role: role as User["role"] } : u));
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const ROLE_COLORS: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    seller: "bg-blue-100 text-blue-700",
    buyer: "bg-gray-100 text-gray-600",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <p className="text-gray-500 text-sm mt-1">{total} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
          <option value="buyer">Buyer</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No users found</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-4">User</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <div key={user._id} className={`px-6 py-4 grid grid-cols-12 gap-4 items-center ${updating === user._id ? "opacity-50" : ""}`}>
                  {/* User */}
                  <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-indigo-50 flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`; }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-12 sm:col-span-3">
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>

                  {/* Role */}
                  <div className="col-span-4 sm:col-span-2">
                    <select value={user.role}
                      onChange={(e) => changeRole(user, e.target.value)}
                      disabled={updating === user._id}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 capitalize ${ROLE_COLORS[user.role]}`}>
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="col-span-4 sm:col-span-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-4 sm:col-span-2 flex justify-end">
                    <button onClick={() => toggleStatus(user)} disabled={updating === user._id}
                      title={user.status === "active" ? "Block user" : "Activate user"}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${user.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                      {user.status === "active" ? <><ShieldOff size={13} /> Block</> : <><Shield size={13} /> Activate</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-400">Page {page} of {pages}</p>
                <div className="flex gap-2">
                  <button onClick={() => fetchUsers(page - 1)} disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
                  <button onClick={() => fetchUsers(page + 1)} disabled={page === pages}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
