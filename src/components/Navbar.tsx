import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropOpen(false);
  };

  const navLink = "text-gray-600 hover:text-indigo-600 font-medium transition-colors";
  const activeLink = "text-indigo-600 font-semibold";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <ShoppingBag size={26} className="text-indigo-600" />
            <span>ShopNest</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={({ isActive }) => isActive ? activeLink : navLink}>Home</NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? activeLink : navLink}>Shop</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? activeLink : navLink}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? activeLink : navLink}>Contact</NavLink>
            {user && (
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeLink : navLink}>Dashboard</NavLink>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 hover:bg-indigo-50 rounded-full transition-colors">
                  <ShoppingCart size={22} className="text-gray-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-indigo-100" />
                    <span className="text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {dropOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setDropOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">Dashboard</Link>
                      <Link to="/dashboard/profile" onClick={() => setDropOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">Profile</Link>
                      <Link to="/dashboard/my-orders" onClick={() => setDropOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">My Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Sign out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Sign in</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart size={22} className="text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-4 py-2 rounded-lg font-medium ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600"}`}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg font-medium text-gray-600">Dashboard</NavLink>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 font-medium">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 font-medium text-gray-600">Sign in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 font-medium text-indigo-600">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
