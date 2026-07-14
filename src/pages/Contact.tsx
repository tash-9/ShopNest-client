import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const faqs = [
  { q: "How do I track my order?", a: "Visit Dashboard > My Orders and click on any order to see real-time tracking status." },
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy on all items. Initiate a return from your dashboard." },
  { q: "How long does it take to get a response?", a: "Our team responds within 2 business hours during support hours (Sat–Thu, 9AM–9PM)." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
        <p className="text-indigo-200 text-lg max-w-xl mx-auto">
          Have a question or need help? Our team is here for you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "support@shopnest.com", href: "mailto:support@shopnest.com" },
                  { icon: Phone, label: "Phone", value: "+8801223344556", href: "tel:+8802233445568" },
                  { icon: MapPin, label: "Address", value: "House#22 Road#11 Mohammadpur, Dhaka", href: "#" },
                  { icon: Clock, label: "Support Hours", value: "Mon–Fri: 9AM–6PM \n24/7 Online Support", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                      {item.href && item.href !== "#" ? (
                        <a href={item.href} className="text-sm text-gray-700 hover:text-indigo-600 transition-colors font-medium">{item.value}</a>
                      ) : (
                        <p className="text-sm text-gray-700 font-medium whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick FAQs */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Quick Answers</h3>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.q} className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{faq.q}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">Thanks for reaching out. Our team will get back to you within 2 business hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required
                          placeholder="John Smith"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <select value={form.subject} onChange={(e) => set("subject", e.target.value)} required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                        <option value="">Select a topic</option>
                        <option>Order Issue</option>
                        <option>Return / Refund</option>
                        <option>Product Question</option>
                        <option>Account Help</option>
                        <option>Partnership Inquiry</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                      <textarea value={form.message} onChange={(e) => set("message", e.target.value)} required
                        rows={6} placeholder="Tell us how we can help you..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
                    </div>
                    <button type="submit" disabled={sending}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                      <Send size={16} />
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
