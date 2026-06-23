import Link from "next/link";
import {
  GraduationCap, Users, TrendingUp, Baby, Activity, Home,
  ArrowRight, Heart,
  type LucideIcon,
} from "lucide-react";
import { getPrograms } from "@/lib/queries";

export const metadata = {
  title: "Our Programs | Family Success Rwanda",
  description:
    "Explore FSR's six transformative programs: Education, Women Empowerment, Youth, Children, Healthcare, and Family Strengthening.",
};

const ICON_MAP: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap, users: Users, "trending-up": TrendingUp,
  baby: Baby, activity: Activity, home: Home,
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-blue-400 rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-0 right-10 w-60 h-60 bg-orange-400 rounded-full" style={{ filter: "blur(80px)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">What We Do</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-6">Our Programs</h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Six transformative programs addressing the root causes of poverty and vulnerability — from education and healthcare to women empowerment and family strengthening.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Programs Overview Cards */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {programs.map((p) => {
              const Icon = ICON_MAP[p.icon] ?? GraduationCap;
              return (
                <a
                  key={p.slug}
                  href={`#${p.slug}`}
                  className="group bg-white border-2 border-gray-100 hover:border-emerald-200 rounded-2xl p-6 card-hover flex items-start gap-4 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${p.light_bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${p.text_color}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${p.text_color}`}>{p.tag}</p>
                    <h3 className="font-bold text-gray-800 text-sm">{p.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">{p.summary || p.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Program Sections */}
      {programs.map((p, i) => {
        const Icon = ICON_MAP[p.icon] ?? GraduationCap;
        return (
          <section
            key={p.slug}
            id={p.slug}
            className={`section-padding ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid md:grid-cols-2 gap-12 items-center`}>
                <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                  <div className={`inline-flex items-center gap-2 ${p.light_bg} ${p.text_color} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4`}>
                    <Icon className="w-4 h-4" />
                    {p.tag}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">{p.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{p.description}</p>
                  <div>
                    <p className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3">Key Activities</p>
                    <ul className="space-y-2">
                      {p.impact_items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${p.bg_color}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                  <div className={`${p.light_bg} rounded-3xl p-10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full -translate-y-8 translate-x-8" />
                    <div className="relative z-10 text-center">
                      <div className={`w-20 h-20 ${p.bg_color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className={`text-2xl font-extrabold ${p.text_color} mb-2`}>{p.title}</h3>
                      <div className="mt-6 bg-white rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Beneficiaries</p>
                        <p className="font-bold text-gray-800">{p.beneficiaries}</p>
                      </div>
                      <Link
                        href="/donate"
                        className={`mt-5 inline-flex items-center gap-2 ${p.bg_color} text-white font-semibold px-5 py-3 rounded-full text-sm transition-opacity hover:opacity-90`}
                      >
                        Support This Program <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-emerald-700 to-emerald-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Support a Program That Matters</h2>
          <p className="text-emerald-200 mb-8">
            Your donation can be directed to any specific program or given as a general contribution to where need is greatest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-full transition-colors">
              <Heart className="w-5 h-5" /> Donate to a Program
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-colors border border-white/30">
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
