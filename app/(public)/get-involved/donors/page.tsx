import Link from "next/link";
import { Heart, ArrowRight, HeartHandshake, Landmark, CheckCircle } from "lucide-react";
import BankDetails from "@/components/BankDetails";

export const metadata = {
  title: "Donors | Family Success Rwanda",
  description:
    "Become a donor to Family Success Rwanda. Give online, sponsor a child, or donate by bank transfer to support vulnerable children and families in Rwanda.",
};

const ways = [
  {
    icon: Heart,
    title: "Make a Donation",
    desc: "Send a donation request for any amount and choose the program you want to support.",
    href: "/donate",
    cta: "Donate",
  },
  {
    icon: HeartHandshake,
    title: "Sponsor a Child",
    desc: "Provide food, clothing, and education for a child from RWF 20,000 per month.",
    href: "/sponsor-a-child",
    cta: "Sponsor a child",
  },
  {
    icon: Landmark,
    title: "Bank Transfer",
    desc: "Deposit directly into the Family Success Rwanda account at Bank of Kigali.",
    href: "#bank-details",
    cta: "View bank details",
  },
];

const commitments = [
  "All donations are receipted",
  "Funds monitored & audited",
  "Regular reports to donors",
  "Used only for approved activities",
];

export default function DonorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-white rounded-full" style={{filter:"blur(80px)"}} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Get Involved</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-4">
            Become a <span className="text-orange-400">Donor</span>
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Your generosity directly impacts vulnerable children, women, and families in Nyaruguru District, Rwanda.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Ways to give */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Ways to Give</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              How You Can <span className="text-emerald-700">Support</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ways.map((way) => (
              <div key={way.title} className="flex flex-col bg-emerald-50 rounded-2xl p-6 card-hover border border-white">
                <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center mb-4">
                  <way.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-emerald-800">{way.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{way.desc}</p>
                <Link href={way.href} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  {way.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mt-10">
            <h3 className="font-bold text-emerald-800 mb-3">Our Commitment to Donors</h3>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {commitments.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <BankDetails />

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-emerald-800 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">Ready to Give?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              <Heart className="w-5 h-5" /> Donate Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
