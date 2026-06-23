import Link from "next/link";
import {
  GraduationCap,
  Users,
  TrendingUp,
  Baby,
  Activity,
  Home,
  Heart,
  ArrowRight,
  Target,
  Globe,
  Shield,
  BookOpen,
  CheckCircle,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Our Impact | Family Success Rwanda",
  description:
    "See the real-world impact of Family Success Rwanda — from students sponsored at Faina Jerusalem Village to women empowered through VSLAs and children given a future.",
};

const stats = [
  { value: "320+", label: "Students Sponsored", sub: "In 2024 alone at Faina Jerusalem", icon: GraduationCap, color: "from-blue-500 to-blue-600" },
  { value: "6", label: "Active Programs", sub: "Covering every life stage", icon: Star, color: "from-emerald-500 to-emerald-700" },
  { value: "100%", label: "Donation Transparency", sub: "Receipted, monitored & audited", icon: Shield, color: "from-orange-500 to-orange-600" },
  { value: "5", label: "TVET Disciplines", sub: "Vocational courses at Faina Jerusalem", icon: BookOpen, color: "from-purple-500 to-purple-600" },
  { value: "2020", label: "Year Founded", sub: "Serving communities since 2020", icon: Target, color: "from-rose-500 to-rose-600" },
  { value: "2", label: "Districts Reached", sub: "Nyaruguru & Nyamagabe Districts", icon: Globe, color: "from-teal-500 to-teal-600" },
];

const programImpacts = [
  {
    icon: GraduationCap,
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-600",
    color: "text-blue-700",
    title: "Education Support",
    outcomes: [
      "School fees covered for vulnerable students",
      "Schools built and fully equipped",
      "Primary, technical & life skills delivered",
      "Human rights & SRHR education integrated",
    ],
  },
  {
    icon: Users,
    bg: "bg-pink-50",
    border: "border-pink-200",
    iconBg: "bg-pink-600",
    color: "text-pink-700",
    title: "Women Empowerment",
    outcomes: [
      "VSLAs (Village Savings & Loans Associations) created",
      "Entrepreneurship training delivered",
      "Income-generation skills built",
      "Mindset & vision transformation achieved",
    ],
  },
  {
    icon: TrendingUp,
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    iconBg: "bg-indigo-600",
    color: "text-indigo-700",
    title: "Youth Capacity",
    outcomes: [
      "Career guidance provided to youth",
      "VSLAs created and coached",
      "Business literacy training delivered",
      "Job creation pathways opened",
    ],
  },
  {
    icon: Baby,
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-600",
    color: "text-green-700",
    title: "Children Empowerment",
    outcomes: [
      "Decent shelters built for homeless children",
      "Nutritional support provided",
      "School fees paid for vulnerable children",
      "Domestic materials distributed to families",
    ],
  },
  {
    icon: Activity,
    bg: "bg-red-50",
    border: "border-red-200",
    iconBg: "bg-red-600",
    color: "text-red-700",
    title: "Healthcare",
    outcomes: [
      "Mobile medical clinics conducted",
      "Rural communities served",
      "Health education campaigns run",
      "Vulnerable patients supported",
    ],
  },
  {
    icon: Home,
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-600",
    color: "text-orange-700",
    title: "Family Strengthening",
    outcomes: [
      "Parenting education programs delivered",
      "Savings groups established",
      "Teen mothers trained in vocational skills",
      "Life skills coaching provided",
    ],
  },
];

const sdgs = [
  { num: "1", label: "No Poverty", color: "bg-red-600" },
  { num: "2", label: "Zero Hunger", color: "bg-orange-500" },
  { num: "3", label: "Good Health", color: "bg-green-500" },
  { num: "4", label: "Quality Education", color: "bg-red-700" },
  { num: "5", label: "Gender Equality", color: "bg-orange-500" },
  { num: "8", label: "Decent Work", color: "bg-red-500" },
  { num: "10", label: "Reduced Inequalities", color: "bg-pink-600" },
  { num: "16", label: "Peace & Justice", color: "bg-blue-600" },
  { num: "17", label: "Partnerships", color: "bg-blue-800" },
];

const timeline = [
  { year: "2020", title: "FSR Founded", desc: "Family Success Rwanda established, beginning community outreach in Nyaruguru District, Mata Sector." },
  { year: "2022", title: "Official Registration", desc: "Registered with Rwanda Governance Board (RGB) — No. 840/RGB/NGO/LP/07/2022 — gaining full legal recognition." },
  { year: "2022", title: "JADF Membership", desc: "Joined Nyamagabe District Joint Development Partners under the social thematic commission." },
  { year: "2023", title: "Faina Jerusalem Village Founded", desc: "Launched Faina Jerusalem Village to rehabilitate street children and orphans, offering shelter, education and TVET training." },
  { year: "2024", title: "320 Students Sponsored", desc: "In 2024, 320 students enrolled at Faina Jerusalem Village — all fully sponsored for course and feeding fees." },
  { year: "2030", title: "FSR Dreams 2030", desc: "Ongoing strategic plan — building a safety net where every vulnerable child enjoys their full rights." },
];

export default function ImpactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 pt-36 pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-orange-400 rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-white rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-emerald-400 rounded-full" style={{ filter: "blur(100px)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Results That Matter</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
            Our <span className="text-orange-400">Impact</span>
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
            From sponsoring students at Faina Jerusalem Village to empowering women through VSLAs — every program we run leaves a lasting mark on families across Rwanda.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Key Stats */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">By The Numbers</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Impact at a <span className="text-emerald-700">Glance</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 card-hover">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-5`} />
                <div className="relative z-10 p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-4xl font-extrabold text-gray-900 leading-none mb-1">{s.value}</p>
                  <p className="font-bold text-gray-800 text-sm">{s.label}</p>
                  <p className="text-gray-400 text-xs mt-1">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faina Jerusalem Spotlight */}
      <section className="section-padding bg-gradient-to-br from-emerald-900 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full" style={{ filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">Project Spotlight</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              Faina Jerusalem Village <span className="text-orange-400">Impact</span>
            </h2>
            <p className="text-emerald-200 mt-4 max-w-2xl mx-auto">
              Our flagship project, transforming the lives of Rwanda&apos;s most vulnerable youth through education and skills training.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { value: "320", label: "Students Enrolled", sub: "2024 academic year", highlight: true },
              { value: "100%", label: "Fully Sponsored", sub: "Course & feeding fees", highlight: false },
              { value: "5", label: "TVET Disciplines", sub: "Practical vocational training", highlight: false },
              { value: "12", label: "Months Per Course", sub: "8 classes + 4 internship", highlight: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl p-6 text-center ${item.highlight ? "bg-orange-500" : "bg-white/10 backdrop-blur-sm border border-white/10"}`}
              >
                <p className={`text-4xl font-extrabold mb-1 ${item.highlight ? "text-white" : "text-orange-400"}`}>
                  {item.value}
                </p>
                <p className={`font-bold text-sm ${item.highlight ? "text-orange-100" : "text-white"}`}>{item.label}</p>
                <p className={`text-xs mt-1 ${item.highlight ? "text-orange-200" : "text-emerald-300"}`}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* TVET outcomes */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-white font-bold text-lg mb-6 text-center">Courses Offered & Outcomes</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { course: "Welding & Metal Fabrication", outcome: "Construction & manufacturing employment" },
                { course: "Masonry & Construction", outcome: "Building trades & self-employment" },
                { course: "Carpentry", outcome: "Furniture making & woodworking business" },
                { course: "Tailoring & Fashion Design", outcome: "Garment industry & fashion entrepreneurship" },
                { course: "Hairdressing & Beauty Therapy", outcome: "Salon ownership & employment" },
                { course: "Quality Primary Education", outcome: "School re-entry & secondary pathway" },
              ].map((item) => (
                <div key={item.course} className="bg-white/10 rounded-xl p-4">
                  <p className="text-orange-300 font-bold text-sm mb-1">{item.course}</p>
                  <p className="text-emerald-200 text-xs">{item.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact by Program */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Across All Programs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              What Each Program <span className="text-emerald-700">Delivers</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Every FSR program is designed for measurable, holistic impact on individuals, families, and communities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programImpacts.map((p) => (
              <div key={p.title} className={`${p.bg} border-2 ${p.border} rounded-2xl p-6 card-hover`}>
                <div className={`w-12 h-12 ${p.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-extrabold text-base mb-4 ${p.color}`}>{p.title}</h3>
                <ul className="space-y-2">
                  {p.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
                <Link href="/programs" className={`inline-flex items-center gap-1 font-semibold text-xs mt-5 ${p.color} hover:gap-2 transition-all`}>
                  Learn more <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Growth <span className="text-emerald-700">Timeline</span>
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-200 -translate-x-0.5" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={`${item.year}-${i}`}
                  className={`relative flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div className={`flex-1 ml-16 sm:ml-0 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12 sm:text-left"}`}>
                    <div className={`inline-block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left`}>
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{item.year}</span>
                      <h3 className="font-extrabold text-gray-900 mt-1 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-6 sm:left-1/2 w-5 h-5 bg-emerald-600 rounded-full border-4 border-white shadow-md -translate-x-2.5 mt-5 z-10" />

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Global Alignment</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Contributing to the <span className="text-emerald-700">SDGs</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              FSR&apos;s work is aligned with Rwanda&apos;s National Strategy for Transformation (NST1), the UN Convention on the Rights of the Child (UNCRC), and these UN Sustainable Development Goals:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {sdgs.map((sdg) => (
              <div
                key={sdg.num}
                className={`${sdg.color} text-white rounded-xl px-4 py-3 text-center min-w-[90px]`}
              >
                <p className="text-2xl font-extrabold">{sdg.num}</p>
                <p className="text-xs font-medium leading-tight mt-0.5 opacity-90">{sdg.label}</p>
              </div>
            ))}
          </div>

          {/* NST1 + UNCRC badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { label: "Rwanda NST1", desc: "National Strategy for Transformation" },
              { label: "UNCRC", desc: "UN Convention on the Rights of the Child" },
              { label: "RGB Registered", desc: "No. 840/RGB/NGO/LP/07/2022" },
            ].map((badge) => (
              <div key={badge.label} className="bg-white rounded-xl border-2 border-emerald-200 px-5 py-3 text-center shadow-sm">
                <p className="font-extrabold text-emerald-700 text-sm">{badge.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dreams 2030 */}
      <section className="section-padding bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full" style={{ filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-800 rounded-full" style={{ filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-orange-100 font-semibold text-sm uppercase tracking-wider">Looking Forward</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
                FSR Dreams 2030
              </h2>
              <p className="text-orange-100 text-lg italic font-medium mb-6">
                &quot;Building the safety net where every vulnerable child should enjoy their full rights.&quot;
              </p>
              <p className="text-orange-100 leading-relaxed">
                Our 2030 strategic plan has four pillars — ensuring every vulnerable child, woman, and family in Rwanda can access education, healthcare, economic opportunity, and holistic family support.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: GraduationCap, text: "Every child in school, no exceptions" },
                { icon: Activity, text: "Healthcare accessible in every rural community" },
                { icon: Users, text: "Every woman economically empowered" },
                { icon: Home, text: "Every family strengthened from within" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-emerald-200 mx-auto mb-5" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Be Part of the <span className="text-emerald-700">Impact</span>
          </h2>
          <p className="text-gray-500 text-base mb-10 max-w-xl mx-auto">
            Your donation, partnership, or volunteer time directly adds to these numbers. Help us reach more children, families, and communities before 2030.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-md"
            >
              <Heart className="w-5 h-5" /> Donate Now
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Explore Programs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
