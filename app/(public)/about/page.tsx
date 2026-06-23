import Link from "next/link";
import {
  ArrowRight, Target, Eye, Shield, Heart, BookOpen, Globe,
  Sparkles, HeartHandshake, Scale, Handshake, Leaf, Star,
  Flame, Feather,
  type LucideIcon,
} from "lucide-react";
import { getCoreValues, getFaithStatements } from "@/lib/queries";

export const metadata = {
  title: "About Us | Family Success Rwanda",
  description:
    "Learn about Family Success Rwanda — our mission, vision, values, faith statement, and history of serving vulnerable communities.",
};

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles, heart: Heart, "heart-handshake": HeartHandshake,
  scale: Scale, globe: Globe, handshake: Handshake, leaf: Leaf, star: Star,
  flame: Flame, feather: Feather, "book-open": BookOpen,
};

export default async function AboutPage() {
  const [coreValues, faithStatements] = await Promise.all([
    getCoreValues(),
    getFaithStatements(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-orange-400 rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-white rounded-full" style={{ filter: "blur(80px)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Our Story</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-6 leading-tight">
            About Family Success Rwanda
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
            A Christian humanitarian NGO born in 2020 with a heart for the most vulnerable families and children in Nyaruguru District, Rwanda.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Identity & Quick Facts */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-3 mb-6">
                A Community of <span className="text-emerald-700">Faith & Action</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Family Success Rwanda (FSR) — also known as FS Rwanda — is a Christian, humanitarian, locally-led Non-Governmental Organization founded in 2020. We are registered with the Rwanda Governance Board and operate in Nyaruguru District, Mata Sector.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We serve the most vulnerable communities through the Word of God and in deed, working in partnership with families and churches to bring holistic transformation. Our 2030 strategic plan is built on a dream: that every vulnerable child can enjoy their full rights.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our work is aligned with Rwanda&apos;s National Strategy for Transformation (NST1), the UN Convention on the Rights of the Child (UNCRC), and the Sustainable Development Goals (SDGs).
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-orange-50 rounded-3xl p-8">
              <h3 className="font-bold text-gray-800 text-lg mb-6">Organization Facts</h3>
              <div className="space-y-4">
                {[
                  { label: "Full Name",    value: "Family Success Rwanda (FSR)" },
                  { label: "Registration", value: "No. 840/RGB/NGO/LP/07/2022" },
                  { label: "Founded",      value: "2020" },
                  { label: "Type",         value: "Christian Humanitarian NGO" },
                  { label: "Location",     value: "Nyaruguru District, Mata Sector" },
                  { label: "Phone",        value: "+250 788 316 227" },
                ].map((fact) => (
                  <div key={fact.label} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{fact.label}</p>
                      <p className="text-gray-800 font-medium mt-0.5">{fact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Purpose</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Mission & <span className="text-emerald-700">Vision</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-base italic">
                  &quot;To serve and empower the most vulnerable community through the Word of God and in deed, while in partnership with families and churches, so that Rwandans feel loved and supported and have increased dignity, hope, and spiritual wellbeing.&quot;
                </p>
              </div>
            </div>

            <div className="bg-emerald-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-4">Our Vision</h3>
                <p className="text-emerald-100 leading-relaxed text-base italic">
                  &quot;To see Rwandan families live in love and peace, families honouring God and fulfilling their basic needs, and able to access holistic transformation.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-center">
            <p className="text-2xl font-extrabold text-white italic">&quot;Transforming Lives Together&quot;</p>
            <p className="text-orange-100 text-sm mt-2">FSR Official Tagline</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">What Guides Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Core <span className="text-emerald-700">Values</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((v) => {
              const Icon = ICON_MAP[v.icon_name] ?? Sparkles;
              return (
                <div key={v.label} className={`rounded-2xl border-2 p-6 ${v.color_classes} card-hover`}>
                  <Icon className={`w-9 h-9 mb-3 ${v.icon_color}`} />
                  <h4 className="font-bold text-gray-800 text-base mb-2">{v.label}</h4>
                  <p className="text-gray-500 text-sm">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Faith Statement */}
      <section className="section-padding bg-gradient-to-br from-emerald-900 to-emerald-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-orange-400" />
          </div>
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">Our Foundation</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-10">
            Our Faith Statement
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {faithStatements.map((item) => {
              const Icon = ICON_MAP[item.icon_name] ?? Sparkles;
              return (
                <div key={item.text} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left">
                  <Icon className={`w-7 h-7 mb-3 ${item.icon_color}`} />
                  <p className="text-emerald-100 text-sm leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strategic Plan 2030 */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Looking Ahead</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6">
                FSR Dreams <span className="text-emerald-700">2030</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg italic border-l-4 border-emerald-500 pl-4">
                &quot;Building the safety net where every vulnerable child should enjoy their full rights.&quot;
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our strategic plan runs through 2030 with four key pillars aligned with Rwanda&apos;s National Strategy for Transformation (NST1), the United Nations Convention on the Rights of the Child (UNCRC), and the Sustainable Development Goals (SDGs).
              </p>
              <div className="space-y-3">
                {[
                  { icon: Shield,   text: "Child protection and holistic development" },
                  { icon: Globe,    text: "Community economic empowerment" },
                  { icon: Heart,    text: "Healthcare access for rural communities" },
                  { icon: BookOpen, text: "Quality education and vocational training" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 bg-emerald-50 rounded-xl p-4">
                    <item.icon className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                    <p className="text-gray-700 text-sm font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full translate-x-8 translate-y-8" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 text-orange-300">Organizational Strengths</h3>
                <ul className="space-y-3">
                  {[
                    "Legal registration & recognized by RGB",
                    "Internal funding system via membership",
                    "Transparent organizational chart",
                    "Financial procedure manual",
                    "Child protection policy",
                    "Independent audit committee",
                    "Dedicated bank account",
                    "Well-reputed in the community",
                    "Registered in Nyamagabe JADF",
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2 text-emerald-100 text-sm">
                      <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-1.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Join Us in <span className="text-emerald-700">Transforming Lives</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Whether you want to donate, volunteer, or partner with us — we welcome you to be part of the FSR family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-4 rounded-full transition-colors">
              <Heart className="w-5 h-5" /> Donate Now
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-full transition-colors">
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
