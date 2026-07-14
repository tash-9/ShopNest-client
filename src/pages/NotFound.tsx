import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-6xl font-bold text-indigo-600 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Go Home
          </Link>
          <Link to="/shop" className="border border-indigo-200 text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
