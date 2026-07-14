import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Truck, Shield, RefreshCcw, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import { Product } from "../types";
import { useCart } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"overview" | "specs" | "reviews">("overview");

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then((r) => {
      setProduct(r.data);
      // fetch related
      return api.get(`/products?category=${r.data.category}&limit=4`);
    }).then((r) => {
      setRelated(r.data.items.filter((p: Product) => p._id !== id));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
      <div>
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product not found</h2>
        <Link to="/shop" className="text-indigo-600 font-medium hover:underline">Back to shop</Link>
      </div>
    </div>
  );

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images.length > 0 ? product.images : ["https://via.placeholder.com/600x500?text=No+Image"];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-indigo-600">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-6 border-r border-gray-50">
              <div className="relative bg-gray-50 rounded-xl overflow-hidden mb-4" style={{ height: 400 }}>
                <img
                  src={images[imgIdx]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x500?text=No+Image"; }}
                />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${imgIdx === i ? "border-indigo-600" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/64"; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{product.brand}</span>
                <span className="text-xs text-gray-400">{product.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                  </>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.shortDescription}</p>

              {/* Qty + Add */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold text-lg">−</button>
                  <span className="w-12 text-center font-semibold text-gray-800">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold text-lg">+</button>
                </div>
                <button onClick={() => addToCart(product, qty)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>

              <div className={`text-xs font-semibold mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "✗ Out of Stock"}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-50">
                {[
                  { icon: Truck, label: "Free Shipping", sub: "Orders $50+" },
                  { icon: Shield, label: "Buyer Protection", sub: "100% guaranteed" },
                  { icon: RefreshCcw, label: "Easy Returns", sub: "30-day policy" },
                ].map((g) => (
                  <div key={g.label} className="text-center">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                      <g.icon size={16} className="text-indigo-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{g.label}</p>
                    <p className="text-xs text-gray-400">{g.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-10">
          <div className="flex border-b border-gray-100">
            {(["overview", "specs", "reviews"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-8 py-4 text-sm font-semibold capitalize transition-colors ${tab === t ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
                {t === "specs" ? "Specifications" : t}
              </button>
            ))}
          </div>
          <div className="p-8">
            {tab === "overview" && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                {product.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {tab === "specs" && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4">Technical Specifications</h3>
                {Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700 min-w-32">{k}</span>
                        <span className="text-sm text-gray-600">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">No specifications available.</p>}
              </div>
            )}
            {tab === "reviews" && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">{product.rating.toFixed(1)}</div>
                    <div className="flex gap-0.5 justify-center my-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{product.reviewCount.toLocaleString()} reviews</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 italic">Detailed customer reviews are aggregated from verified purchases. Sign in to leave a review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:gap-3 transition-all text-sm">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
