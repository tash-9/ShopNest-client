import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Marquee from "react-fast-marquee";
import {
  ShoppingBag, Star, Truck, Shield, RefreshCcw, Headphones,
  ChevronLeft, ChevronRight, ArrowRight, Zap, TrendingUp, Award
} from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";

const heroSlides = [
  {
    title: "Discover Amazing Products",
    subtitle: "Shop the latest Electronics, Fashion & More",
    cta: "Shop Now",
    bg: "from-indigo-600 to-purple-700",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
  },
  {
    title: "Summer Collection 2025",
    subtitle: "New arrivals in Fashion & Lifestyle",
    cta: "Explore Collection",
    bg: "from-purple-600 to-pink-600",
    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
  },
  {
    title: "Tech Deals This Week",
    subtitle: "Up to 40% off on top Electronics brands",
    cta: "Grab Deals",
    bg: "from-indigo-700 to-blue-600",
    img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
  },
];

const categories = [
  { name: "Electronics", icon: "💻", color: "bg-blue-50 text-blue-700 border-blue-100", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300" },
  { name: "Fashion", icon: "👗", color: "bg-pink-50 text-pink-700 border-pink-100", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300" },
  { name: "Home & Garden", icon: "🏠", color: "bg-green-50 text-green-700 border-green-100", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300" },
  { name: "Sports", icon: "⚽", color: "bg-orange-50 text-orange-700 border-orange-100", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300" },
  { name: "Books", icon: "📚", color: "bg-amber-50 text-amber-700 border-amber-100", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300" },
  { name: "Beauty", icon: "💄", color: "bg-rose-50 text-rose-700 border-rose-100", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300" },
  { name: "Toys", icon: "🎮", color: "bg-purple-50 text-purple-700 border-purple-100", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300" },
  { name: "Health", icon: "💊", color: "bg-teal-50 text-teal-700 border-teal-100", img: "https://images.unsplash.com/photo-1544991936-9464fa57a27e?w=300" },
];

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50 across the US", color: "text-indigo-600 bg-indigo-50" },
  { icon: Shield, title: "Secure Payments", desc: "256-bit SSL encrypted checkout", color: "text-purple-600 bg-purple-50" },
  { icon: RefreshCcw, title: "Easy Returns", desc: "30-day hassle-free return policy", color: "text-pink-600 bg-pink-50" },
  { icon: Headphones, title: "24/7 Support", desc: "Real humans, always available", color: "text-indigo-600 bg-indigo-50" },
];

const testimonials = [
  { name: "Sarah Mitchell", role: "Verified Buyer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah", rating: 5, text: "ShopNest has completely transformed my online shopping experience. Fast delivery, great prices, and products that match the descriptions perfectly. I'm a customer for life!" },
  { name: "James Rodriguez", role: "Verified Buyer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=James", rating: 5, text: "I was skeptical at first, but after my first order arrived in two days with everything in perfect condition, I was hooked. The variety of products is incredible." },
  { name: "Emily Chen", role: "Verified Buyer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily", rating: 5, text: "Customer support is exceptional. Had a small issue with my order and they resolved it within minutes. This is how online shopping should work!" },
  { name: "Michael Thompson", role: "Verified Buyer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Michael", rating: 4, text: "Best prices I've found online for electronics. The Sony headphones I bought were $80 cheaper than anywhere else. Quality is absolutely genuine." },
];

const brands = ["Sony", "Apple", "Nike", "Samsung", "Dyson", "Levi's", "LEGO", "Hydro Flask", "The Ordinary", "Instant Pot"];

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days. Expedited shipping (1–2 days) is available at checkout. Free standard shipping on orders over $50." },
  { q: "Can I return a product if I'm not satisfied?", a: "Absolutely. We offer a 30-day hassle-free return policy. Simply initiate a return from your dashboard and we'll arrange a pickup." },
  { q: "Are the products authentic?", a: "Yes, 100%. We partner directly with brands and authorized distributors to ensure every product sold on ShopNest is genuine." },
  { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with a tracking number. You can also view real-time status in your Dashboard > My Orders." },
  { q: "Do you offer international shipping?", a: "Currently we ship within the US. International shipping to Canada, UK, and Australia is coming in Q3 2025." },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get("/products?limit=8").then((r) => {
      setFeatured(r.data.items);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const current = heroSlides[slide];

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className={`relative bg-gradient-to-br ${current.bg} overflow-hidden`} style={{ height: "65vh", minHeight: 480 }}>
        <div className="absolute inset-0">
          <img src={current.img} alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                <Zap size={14} /> New arrivals every day
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">{current.title}</h1>
              <p className="text-white/80 text-lg sm:text-xl mb-8">{current.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop" className="bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm">
                  {current.cta}
                </Link>
                <Link to="/register" className="border border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm backdrop-blur-sm">
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === slide ? "bg-white w-6" : "bg-white/40"}`} />
          ))}
        </div>

        {/* Arrows */}
        <button onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
          <ChevronRight size={20} />
        </button>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-500">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/shop?category=${cat.name}`}
                className="category-card flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md text-center">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Featured Products</h2>
              <p className="text-gray-500">Handpicked top picks just for you</p>
            </div>
            <Link to="/shop" className="flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all text-sm">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} product={{} as Product} skeleton />)
              : featured.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">ShopNest by the Numbers</h2>
            <p className="text-indigo-200">Trusted by shoppers across the US</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 2500000, suffix: "+", label: "Happy Customers", icon: "😊" },
              { value: 50000, suffix: "+", label: "Products Listed", icon: "📦" },
              { value: 98, suffix: "%", label: "Satisfaction Rate", icon: "⭐" },
              { value: 150, suffix: "+", label: "Brand Partners", icon: "🤝" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-1">
                  <CountUp end={stat.value} duration={2.5} separator="," />
                  {stat.suffix}
                </div>
                <p className="text-indigo-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trusted Brands</p>
        </div>
        <Marquee speed={40} gradient={false} pauseOnHover>
          {brands.map((brand) => (
            <div key={brand} className="mx-8 px-6 py-3 bg-white border border-gray-100 rounded-xl text-gray-600 font-semibold text-sm hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-pointer">
              {brand}
            </div>
          ))}
        </Marquee>
      </section>

      {/* ── HIGHLIGHTS / PROMO BANNERS ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 flex items-center justify-between overflow-hidden relative">
              <div className="relative z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Limited Time</span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-2">Electronics Sale</h3>
                <p className="text-indigo-200 text-sm mb-4">Up to 40% off on Sony, Apple & Samsung</p>
                <Link to="/shop?category=Electronics" className="bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors inline-block">
                  Shop Electronics
                </Link>
              </div>
              <div className="text-8xl opacity-30 absolute right-6">💻</div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 p-6 relative overflow-hidden">
                <span className="text-5xl opacity-20 absolute right-3 top-3">👗</span>
                <p className="text-xs font-bold text-pink-100 uppercase tracking-wider mb-1">New Arrivals</p>
                <h4 className="text-lg font-bold text-white mb-3">Fashion Collection</h4>
                <Link to="/shop?category=Fashion" className="text-xs font-semibold text-white underline underline-offset-2">Shop Now →</Link>
              </div>
              <div className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 relative overflow-hidden">
                <span className="text-5xl opacity-20 absolute right-3 top-3">🏠</span>
                <p className="text-xs font-bold text-amber-100 uppercase tracking-wider mb-1">Home Refresh</p>
                <h4 className="text-lg font-bold text-white mb-3">Home & Garden</h4>
                <Link to="/shop?category=Home+%26+Garden" className="text-xs font-semibold text-white underline underline-offset-2">Shop Now →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
            <p className="text-gray-500">Thousands of happy shoppers can't be wrong</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full bg-indigo-100" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about ShopNest</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                  <span className={`text-indigo-600 font-bold text-lg transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp size={40} className="text-indigo-200 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Get Exclusive Deals</h2>
          <p className="text-indigo-200 mb-8">Subscribe to our newsletter and get 10% off your first order plus weekly deals straight to your inbox.</p>
          <form onSubmit={(e) => { e.preventDefault(); setEmail(""); alert("Thanks for subscribing!"); }}
            className="flex gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" />
            <button type="submit" className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ── WHY SHOPNEST ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose ShopNest?</h2>
            <p className="text-gray-500">We're committed to making your shopping experience exceptional</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "Premium Quality", desc: "Every product is verified for authenticity and quality before being listed on our platform.", color: "text-indigo-600 bg-indigo-50" },
              { icon: Zap, title: "Lightning Fast", desc: "From browsing to checkout in under 60 seconds. Fast, intuitive, and built for real shoppers.", color: "text-purple-600 bg-purple-50" },
              { icon: Shield, title: "Buyer Protection", desc: "Shop with confidence. Our buyer protection guarantees a full refund if something goes wrong.", color: "text-pink-600 bg-pink-50" },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
