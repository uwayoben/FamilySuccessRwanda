"use client";

import { useState } from "react";
import { Phone, MapPin, Mail, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
          <div className="absolute bottom-0 left-20 w-60 h-60 bg-white rounded-full" style={{filter:"blur(80px)"}} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-6">Contact Us</h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
            We&apos;d love to hear from you — whether you have a question, want to partner with us, or are interested in volunteering.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Phone,
                bg: "bg-emerald-50",
                iconBg: "bg-emerald-700",
                label: "Phone",
                value: "+250 788 316 227",
                href: "tel:+250788316227",
              },
              {
                icon: Mail,
                bg: "bg-blue-50",
                iconBg: "bg-blue-700",
                label: "Email",
                value: "info@familysuccessrwanda.org",
                href: "mailto:info@familysuccessrwanda.org",
              },
              {
                icon: MapPin,
                bg: "bg-orange-50",
                iconBg: "bg-orange-600",
                label: "Location",
                value: "Nyaruguru District, Mata Sector, Rwanda",
                href: null,
              },
              {
                icon: Clock,
                bg: "bg-purple-50",
                iconBg: "bg-purple-700",
                label: "Office Hours",
                value: "Monâ€“Fri, 8:00 AM â€“ 5:00 PM (CAT)",
                href: null,
              },
            ].map((info) => (
              <div key={info.label} className={`${info.bg} rounded-2xl p-6 text-center`}>
                <div className={`w-12 h-12 ${info.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{info.label}</p>
                {info.href ? (
                  <a href={info.href} className="text-gray-800 font-semibold text-sm hover:text-emerald-700 transition-colors">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-800 font-semibold text-sm">{info.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Extra Info */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 mb-8">We typically respond within 1â€“2 business days.</p>

              {status === "success" ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">Thank you for reaching out. We will get back to you soon.</p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ full_name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.full_name}
                        onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone (optional)</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                        placeholder="+250 788..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option>General Inquiry</option>
                        <option>Donation / Giving</option>
                        <option>Partnership Opportunity</option>
                        <option>Volunteer Interest</option>
                        <option>Faina Jerusalem Village</option>
                        <option>Media / Press</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors bg-white resize-none"
                      placeholder="Tell us how we can help, or share your message with us..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{errorMsg}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold px-8 py-4 rounded-full transition-colors text-base shadow-md"
                  >
                    <Send className="w-5 h-5" />
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Registration */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Official Registration</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">RGB Number</p>
                    <p className="text-gray-800 font-semibold">No. 840/RGB/NGO/LP/07/2022</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Also Registered In</p>
                    <p className="text-gray-800 font-semibold">Nyamagabe District JADF</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Operating Area</p>
                    <p className="text-gray-800 font-semibold">Nyaruguru District, Mata Sector</p>
                  </div>
                </div>
              </div>

              {/* Partner */}
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-3 text-orange-300">Become a Partner</h3>
                <p className="text-emerald-200 text-sm mb-4">
                  FSR welcomes partnerships with organizations, churches, businesses, and individuals who share our vision of transforming vulnerable communities.
                </p>
                <ul className="space-y-2 text-sm text-emerald-100">
                  {[
                    "Program co-funding opportunities",
                    "Technical & capacity support",
                    "Volunteer & mission trips",
                    "Corporate social responsibility",
                  ].map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <h3 className="font-bold text-orange-800 mb-2">Direct Contact</h3>
                <p className="text-orange-700 text-sm mb-3">
                  For urgent matters, reach us directly by phone or call during office hours.
                </p>
                <a
                  href="tel:+250788316227"
                  className="flex items-center gap-2 text-orange-700 font-bold hover:text-orange-900 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +250 788 316 227
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
