import { Link } from "react-router-dom";
import { ShoppingBag, Users, Award, Globe, Heart, TrendingUp } from "lucide-react";
import CountUp from "react-countup";

const team = [
  { name: "Alexandra Park", role: "CEO & Co-Founder", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex", bio: "Former Amazon product lead with 12+ years in e-commerce. Alexandra founded ShopNest to democratize online shopping." },
  { name: "Marcus Johnson", role: "CTO & Co-Founder", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus", bio: "Full-stack engineer from Google. Marcus built ShopNest's scalable infrastructure handling millions of daily requests." },
  { name: "Priya Nair", role: "Head of Product", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya", bio: "Product veteran from Stripe and Shopify. Priya obsesses over every pixel of the ShopNest experience." },
  { name: "Daniel Wu", role: "Head of Partnerships", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Daniel", bio: "Built relationships with 150+ brand partners. Daniel ensures ShopNest only sells authentic, quality products." },
];

const values = [
  { icon: Heart, title: "Customer First", desc: "Every decision we make starts with one question: is this better for our customers?", color: "bg-rose-50 text-rose-600" },
  { icon: Award, title: "Authenticity", desc: "We partner directly with brands and authorized distributors. Counterfeits have no place here.", color: "bg-amber-50 text-amber-600" },
  { icon: Globe, title: "Accessibility", desc: "Great products at great prices shouldn't be a luxury. We work hard to keep costs low.", color: "bg-green-50 text-green-600" },
  { icon: TrendingUp, title: "Continuous Improvement", desc: "We ship improvements every week, driven by data and customer feedback.", color: "bg-blue-50 text-blue-600" },
];

const milestones = [
  { year: "2020", event: "ShopNest founded in San Francisco with 50 products" },
  { year: "2021", event: "Reached 100,000 customers and 5,000 products" },
  { year: "2022", event: "Expanded to 8 product categories, raised Series A" },
  { year: "2023", event: "Hit $50M GMV, launched mobile app, 150+ brand partners" },
  { year: "2024", event: "2.5M happy customers, launched loyalty program" },
  { year: "2025", event: "International expansion underway, 50,000+ products" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-200 font-bold text-lg mb-6">
            <ShoppingBag size={20} /> ShopNest
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">We're on a mission to make great shopping accessible to everyone</h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl mx-auto">
            ShopNest started in a San Francisco apartment in 2020. Today we're the fastest-growing e-commerce platform in the US, trusted by over 2.5 million shoppers.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 border-y border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { val: 2500000, suffix: "+", label: "Happy Customers" },
            { val: 50000, suffix: "+", label: "Products" },
            { val: 150, suffix: "+", label: "Brand Partners" },
            { val: 98, suffix: "%", label: "Satisfaction Rate" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                <CountUp end={s.val} separator="," duration={2} />{s.suffix}
              </div>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>ShopNest was born out of frustration. Our founders, Alexandra and Marcus, were tired of sifting through fake products, unreliable sellers, and clunky interfaces on existing platforms.</p>
              <p>They believed online shopping could be better: faster, safer, and more enjoyable. So in 2020, they built ShopNest — a curated marketplace where every product is verified, every seller is trusted, and every experience is designed with the customer in mind.</p>
              <p>Five years later, we've helped 2.5 million people find exactly what they were looking for, with fast delivery and the confidence that comes from our buyer protection guarantee.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
              "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400",
              "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400",
              "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400",
            ].map((src, i) => (
              <img key={i} src={src} alt="" className={`rounded-2xl object-cover ${i === 0 ? "col-span-2 h-48" : "h-40"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Values</h2>
            <p className="text-gray-500">The principles that guide every decision we make</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                <div className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
        <div className="space-y-6">
          {milestones.map((m, i) => (
            <div key={m.year} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 text-right">
                <span className="text-sm font-bold text-indigo-600">{m.year}</span>
              </div>
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mt-1" />
                {i < milestones.length - 1 && <div className="w-0.5 h-12 bg-indigo-100 mt-1" />}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pt-0.5">{m.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Meet the Team</h2>
            <p className="text-gray-500">The people building the future of shopping</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-3 bg-indigo-50" />
                <h3 className="font-bold text-gray-900 mb-0.5">{member.name}</h3>
                <p className="text-xs text-indigo-600 font-semibold mb-3">{member.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to start shopping?</h2>
        <p className="text-gray-500 mb-8">Join 2.5 million shoppers who trust ShopNest.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/shop" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors">Browse Products</Link>
          <Link to="/register" className="border border-indigo-200 text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
