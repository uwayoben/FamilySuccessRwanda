import Link from "next/link";
import {
  Heart, ArrowRight, CheckCircle, BookOpen, Wrench, GraduationCap, Star,
  Globe, Users, TrendingUp, Baby, Activity, Home,
  Sparkles, HeartHandshake, Scale, Handshake, Leaf,
  type LucideIcon,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import PartnersSlider from "@/components/PartnersSlider";
import { getHeroSlides, getPartners, getCoreValues, getPrograms } from "@/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap, users: Users, "trending-up": TrendingUp,
  baby: Baby, activity: Activity, home: Home, globe: Globe,
  sparkles: Sparkles, heart: Heart, "heart-handshake": HeartHandshake,
  scale: Scale, handshake: Handshake, leaf: Leaf, star: Star,
};

export default async function HomePage() {
  const [slides, partners, coreValues, programs] = await Promise.all([
    getHeroSlides(),
    getPartners(),
    getCoreValues(),
    getPrograms(),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 md:order-1">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full -translate-y-10 translate-x-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200 rounded-full translate-y-8 -translate-x-8" />
                <div className="relative z-10 space-y-4">
                  {[
                    "Christian-led humanitarian values",
                    "Locally-led, community-rooted",
                    "Aligned with Rwanda NST1 & SDGs",
                    "Fully registered & audited NGO",
                    "Child protection policy in place",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-sm font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6 leading-tight">
                Serving Rwanda with <span className="text-emerald-700">Heart & Purpose</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-5">
                Family Success Rwanda (FSR) is a Christian, humanitarian, locally-led NGO registered in 2022 with the Rwanda Governance Board. We operate in Nyaruguru District, Mata Sector, serving the most vulnerable families and children.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Our mission is to serve and empower the most vulnerable community through the Word of God and in deed, while in partnership with families and churches, so that Rwandans feel loved and supported with increased dignity, hope, and spiritual wellbeing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about" className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                  Learn Our Story <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+250788316227" className="inline-flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold px-6 py-3 rounded-full transition-colors">
                  +250 788 316 227
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Our <span className="text-emerald-700">Programs</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Six transformative programs designed to uplift every generation — from children to elders — with dignity and compassion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(p => {
              const Icon = ICON_MAP[p.icon] ?? GraduationCap;
              return (
                <div key={p.slug} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 card-hover group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${p.light_bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${p.text_color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.summary || p.description}</p>
                  <Link href="/programs" className="inline-flex items-center gap-1 text-emerald-700 font-medium text-sm mt-4 hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/programs" className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-md">
              View All Programs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Faina Jerusalem Feature */}
      <section className="section-padding bg-gradient-to-br from-emerald-900 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-80 h-80 bg-orange-400 rounded-full" style={{ filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">Key Project</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-6 leading-tight">
                Faina Jerusalem <br /><span className="text-orange-400">Village</span>
              </h2>
              <p className="text-emerald-200 text-base leading-relaxed mb-5">
                Founded in 2023 by FSR, the Faina Jerusalem Village was originally established to rehabilitate delinquent street children and orphans. Today it runs under the Government of Rwanda training curriculum with general admissions.
              </p>
              <p className="text-emerald-200 text-base leading-relaxed mb-8">
                In 2024, <span className="text-orange-400 font-bold">320 students</span> were enrolled — all fully sponsored for course and feeding fees. The village offers quality primary education and one-year TVET short courses.
              </p>
              <Link href="/faina-jerusalem" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg">
                Explore the Village <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen,     value: "320",   label: "Students in 2024", sub: "All fully sponsored" },
                { icon: Wrench,       value: "5",     label: "TVET Courses",     sub: "Practical skills" },
                { icon: GraduationCap,value: "2023",  label: "Founded",          sub: "By FS Rwanda" },
                { icon: Star,         value: "Gov't", label: "Accredited",       sub: "Rwanda curriculum" },
              ].map(item => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{item.value}</p>
                  <p className="text-emerald-200 text-sm font-medium">{item.label}</p>
                  <p className="text-emerald-400 text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Our Core <span className="text-emerald-700">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {coreValues.map(v => {
              const Icon = ICON_MAP[v.icon_name] ?? Sparkles;
              return (
                <div key={v.label} className={`rounded-2xl border-2 p-5 text-center font-semibold text-base ${v.color_classes} card-hover`}>
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${v.icon_color}`} />
                  {v.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PartnersSlider partners={partners} />

      {/* Donate CTA */}
      <section className="section-padding bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-white/30 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Your Gift Changes Lives</h2>
          <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
            Every contribution — large or small — helps a child stay in school, a family access healthcare, or a young person learn a life-changing skill.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-orange-50 transition-colors shadow-lg text-base">
              <Heart className="w-5 h-5" /> Donate Today
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-orange-700 hover:bg-orange-800 text-white font-semibold px-8 py-4 rounded-full transition-colors text-base">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
