import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../contexts/CartContext";

interface Props {
  product: Product;
  skeleton?: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-9 bg-gray-200 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product, skeleton }: Props) {
  const { addToCart } = useCart();
  if (skeleton) return <SkeletonCard />;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link to={`/products/${product._id}`} className="relative block overflow-hidden h-56 bg-gray-50 flex-shrink-0">
        <img
          src={product.images[0] || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=No+Image"; }}
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-2 py-1 rounded-lg font-medium">
          {product.category}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-indigo-600 font-semibold mb-1">{product.brand}</p>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.shortDescription}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
