import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <ShoppingBag size={24} className="text-indigo-400" />
              ShopNest
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Your ultimate shopping destination. Discover thousands of products across every category with fast shipping and unbeatable prices.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/login", label: "Sign In" },
                { to: "/register", label: "Create Account" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm hover:text-indigo-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty", "Toys"].map((c) => (
                <li key={c}>
                  <Link to={`/shop?category=${c}`} className="text-sm hover:text-indigo-400 transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-indigo-400 flex-shrink-0" />
                <span>House#22 Road#11 Mohammadpur, Dhaka</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-indigo-400 flex-shrink-0" />
                <a href="tel:+8802233445568" className="hover:text-indigo-400 transition-colors">+8801223344556</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-indigo-400 flex-shrink-0" />
                <a href="mailto:support@shopnest.com" className="hover:text-indigo-400 transition-colors">support@shopnest.com</a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Mon–Fri: 9AM–6PM</p>
              <p className="text-xs font-medium text-indigo-400">24/7 Online Support Available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
