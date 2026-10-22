"use client";

import { use, useState } from "react";
import { Heart, GraduationCap, Users, Activity, Baby, TrendingUp, Home, CheckCircle, AlertCircle } from "lucide-react";
import BankDetails from "@/components/BankDetails";

const donationTypes = [
  { value: "general", label: "General Donation", icon: Heart, desc: "Where need is greatest" },
  { value: "education", label: "Education", icon: GraduationCap, desc: "Schools & scholarships" },
  { value: "faina_jerusalem", label: "Faina Jerusalem", icon: GraduationCap, desc: "TVET & primary ed." },
  { value: "healthcare", label: "Healthcare", icon: Activity, desc: "Medical outreach" },
  { value: "women_empowerment", label: "Women Empowerment", icon: Users, desc: "VSLAs & training" },
  { value: "children", label: "Children", icon: Baby, desc: "Shelter & nutrition" },
  { value: "youth", label: "Youth", icon: TrendingUp, desc: "Career & skills" },
  { value: "family_strengthening", label: "Family", icon: Home, desc: "Parenting & savings" },
];

const amounts = [10, 25, 50, 100, 250, 500];

export default function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Links like /donate?type=children&child=Alice (from Sponsor a Child) prefill the form.
  const params = use(searchParams);
  const typeParam = typeof params.type === "string" ? params.type : "";
  const child = typeof params.child === "string" ? params.child.trim().slice(0, 100) : "";

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    amount: "",
    customAmount: "",
    currency: "USD",
    donation_type: child ? "children" : donationTypes.some((t) => t.value === typeParam) ? typeParam : "general",
    message: child ? `I would like to sponsor ${child}.` : "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const finalAmount = form.customAmount || form.amount;
    if (!finalAmount || Number(finalAmount) <= 0) {
      setErrorMsg("Please select or enter a donation amount.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(finalAmount) }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-2">
            Your donation request has been received. We will contact you shortly with payment details and a receipt.
          </p>
          <p className="text-emerald-700 font-medium text-sm mb-8">
            &quot;Transforming Lives Together&quot; — God bless you for your generosity!
          </p>
          <a href="/" className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-3 rounded-full transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-white rounded-full" style={{filter:"blur(80px)"}} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Make a Difference</h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Your generosity directly impacts vulnerable children, women, and families in Nyaruguru District, Rwanda. Every gift is receipted, audited, and fully transparent.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <BankDetails />

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Donation Details</h2>
              {child && (
                <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                  <Baby className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <p className="text-orange-800 text-sm">
                    You are sponsoring <span className="font-bold">{child}</span>. Thank you!
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donation Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Where would you like your gift to go?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {donationTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, donation_type: type.value }))}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          form.donation_type === type.value
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        <type.icon className={`w-5 h-5 mb-1 ${form.donation_type === type.value ? "text-emerald-600" : "text-gray-400"}`} />
                        <p className={`text-xs font-bold ${form.donation_type === type.value ? "text-emerald-700" : "text-gray-700"}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-gray-400">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Donation Amount
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {amounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, amount: String(amt), customAmount: "" }))}
                        className={`px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                          form.amount === String(amt) && !form.customAmount
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-gray-200 text-gray-700 hover:border-emerald-400"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom amount"
                      value={form.customAmount}
                      onChange={(e) => setForm((f) => ({ ...f, customAmount: e.target.value, amount: "" }))}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <select
                      value={form.currency}
                      onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                      className="border-2 border-gray-200 rounded-xl px-3 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="USD">USD</option>
                      <option value="RWF">RWF</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
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
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number (optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Message (optional)</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="A message or dedication for your donation..."
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
                  className="w-full flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold px-8 py-4 rounded-full transition-colors text-base shadow-lg"
                >
                  {status === "loading" ? "Processing..." : "Submit Donation Request"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  After submitting, we will contact you with payment instructions. All donations are receipted and audited.
                </p>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Why Donate */}
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 text-orange-300">Your Impact</h3>
                <ul className="space-y-3">
                  {[
                    { amount: "$10", impact: "Provides school supplies for one child" },
                    { amount: "$25", impact: "Feeds a student at Faina Jerusalem for a month" },
                    { amount: "$50", impact: "Sponsors TVET course materials" },
                    { amount: "$100", impact: "Pays a term of school fees for a vulnerable student" },
                    { amount: "$250", impact: "Supports a woman-led VSLA group for a month" },
                    { amount: "$500", impact: "Funds a healthcare outreach clinic" },
                  ].map((item) => (
                    <li key={item.amount} className="flex items-start gap-3">
                      <span className="text-orange-400 font-bold text-sm whitespace-nowrap">{item.amount}</span>
                      <span className="text-emerald-200 text-sm">{item.impact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transparency */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <h3 className="font-bold text-emerald-800 mb-3">Our Commitment</h3>
                <ul className="space-y-2">
                  {[
                    "All donations are receipted",
                    "Funds monitored & audited",
                    "Regular reports to donors",
                    "Used only for approved activities",
                    "No donations held unnecessarily",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <h3 className="font-bold text-orange-800 mb-2">Need Help?</h3>
                <p className="text-orange-700 text-sm mb-3">Contact us directly to discuss your donation or arrange bank transfer details.</p>
                <a href="tel:+250788316227" className="text-orange-700 font-bold text-sm hover:text-orange-900 transition-colors">
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
