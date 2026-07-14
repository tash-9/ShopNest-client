import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";

const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty", "Toys", "Automotive", "Food & Grocery", "Health"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const setParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({ sort: "newest" });
  };

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { sort, page: String(page), limit: "12" };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minRating) params.minRating = minRating;

    api.get("/products", { params }).then((r) => {
      setProducts(r.data.items);
      setTotal(r.data.total);
      setPages(r.data.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [searchParams]);

  const hasFilters = !!(search || category || minPrice || maxPrice || minRating);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop All Products</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={(e) => setParam("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            {/* Sort */}
            <select value={sort} onChange={(e) => setParam("sort", e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {/* Filter toggle mobile */}
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-white">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* ── Sidebar Filters ── */}
        <aside className={`flex-shrink-0 w-64 space-y-6 ${filterOpen ? "block" : "hidden"} sm:block`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</p>
              <div className="space-y-1.5">
                <button onClick={() => setParam("category", "")}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!category ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                  All Categories
                </button>
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setParam("category", c)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${category === c ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setParam("minPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setParam("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>
            </div>

            {/* Min Rating */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Minimum Rating</p>
              <div className="space-y-1.5">
                {["", "4", "3", "2"].map((r) => (
                  <button key={r} onClick={() => setParam("minRating", r)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${minRating === r ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    {r ? `${r}★ & above` : "Any Rating"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${total.toLocaleString()} product${total !== 1 ? "s" : ""} found`}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline flex items-center gap-1 sm:hidden">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="text-indigo-600 font-medium text-sm hover:underline">Clear all filters</button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <ProductCard key={i} product={{} as Product} skeleton />)
              : products.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(pages, 7) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(page + 1)} disabled={page === pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
