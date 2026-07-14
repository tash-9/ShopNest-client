import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Eye, PlusCircle, Package, Search } from "lucide-react";
import api from "../../services/api";
import { Product } from "../../types";
import toast from "react-hot-toast";

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/products/seller/mine?page=${p}&limit=10`);
      setProducts(res.data.items);
      setPages(res.data.pages);
      setTotal(res.data.total);
      setPage(p);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts(page);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">{total} product{total !== 1 ? "s" : ""} listed</p>
        </div>
        <Link to="/dashboard/products/add"
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
          <PlusCircle size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, brand..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No products found</h3>
            <p className="text-sm text-gray-400 mb-5">{search ? "Try a different search term" : "You haven't listed any products yet"}</p>
            {!search && (
              <Link to="/dashboard/products/add" className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <div key={product._id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                  {/* Product */}
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                    <img src={product.images[0] || "https://via.placeholder.com/56"}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/56"; }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-400 truncate">{product.brand}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-4 sm:col-span-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{product.category}</span>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 sm:col-span-2">
                    <p className="font-semibold text-gray-900 text-sm">${product.price.toFixed(2)}</p>
                    {product.originalPrice > product.price && (
                      <p className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="col-span-2 sm:col-span-1">
                    <span className={`text-xs font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                      {product.stock > 0 ? product.stock : "Out"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-2">
                    <Link to={`/products/${product._id}`}
                      className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deleting === product._id}
                      className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-400">Page {page} of {pages}</p>
                <div className="flex gap-2">
                  <button onClick={() => fetchProducts(page - 1)} disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
                  <button onClick={() => fetchProducts(page + 1)} disabled={page === pages}
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
