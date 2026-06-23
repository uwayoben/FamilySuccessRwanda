import Link from "next/link";
import {
  GraduationCap,
  Wrench,
  Heart,
  ArrowRight,
  Users,
  BookOpen,
  Scissors,
  Hammer,
  Star,
  CheckCircle,
} from "lucide-react";

export const metadata = {
  title: "Faina Jerusalem Village | Family Success Rwanda",
  description:
    "Faina Jerusalem Village — FSR's key project providing primary education and TVET training for disadvantaged youth in Rwanda. 320 students sponsored in 2024.",
};

const courses = [
  {
    icon: Wrench,
    title: "Welding & Metal Fabrication",
    desc: "Students learn welding techniques, metal cutting, and fabrication skills applicable in construction and manufacturing industries.",
    bg: "bg-orange-50",
    color: "text-orange-600",
    iconBg: "bg-orange-600",
  },
  {
    icon: Hammer,
    title: "Masonry & Construction",
    desc: "Hands-on training in building techniques, brick laying, plastering, and construction site management.",
    bg: "bg-stone-50",
    color: "text-stone-700",
    iconBg: "bg-stone-600",
  },
  {
    icon: Wrench,
    title: "Carpentry",
    desc: "Woodworking, furniture making, and joinery skills that open doors to self-employment and local industry.",
    bg: "bg-orange-50",
    color: "text-orange-700",
    iconBg: "bg-orange-600",
  },
  {
    icon: Scissors,
    title: "Tailoring & Fashion Design",
    desc: "Sewing, pattern making, and fashion design skills for entrepreneurship in the garment and fashion industry.",
    bg: "bg-pink-50",
    color: "text-pink-600",
    iconBg: "bg-pink-600",
  },
  {
    icon: Star,
    title: "Hairdressing & Beauty Therapy",
    desc: "Professional hairdressing, salon management, and beauty therapy training for immediate self-employment.",
    bg: "bg-purple-50",
    color: "text-purple-600",
    iconBg: "bg-purple-600",
  },
];

export default function FainaJerusalemPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 pt-36 pb-24 overflow-hidden">
        {/* Background image — place your photo at public/faina-hero.jpg */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/faina-hero.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay keeps text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">FSR Key Project</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
            Faina Jerusalem <br />
            <span className="text-orange-400">Village</span>
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Founded in 2023, Faina Jerusalem Village is transforming the lives of disadvantaged youth through quality education and government-accredited vocational training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              <Heart className="w-5 h-5" /> Sponsor a Student
            </Link>
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              View Courses <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: "320", label: "Students in 2024", sub: "All fully sponsored", icon: Users },
              { value: "5", label: "TVET Courses", sub: "Hands-on training", icon: BookOpen },
              { value: "2023", label: "Year Founded", sub: "By FS Rwanda", icon: Star },
              { value: "100%", label: "Gov't Accredited", sub: "Rwanda curriculum", icon: GraduationCap },
            ].map((stat) => (
              <div key={stat.label} className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-800">{stat.value}</p>
                <p className="text-gray-700 font-semibold text-sm">{stat.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Village */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6">
                From Street Children to <span className="text-emerald-700">Skilled Graduates</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Faina Jerusalem Village was originally established by FSR in 2023 to rehabilitate delinquent street children and orphans — giving them shelter, stability, and a future. The name reflects our belief in a safe haven where transformation begins.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Today, the village operates under the Government of Rwanda&apos;s official training curriculum and accepts general admissions, with a strong focus on disadvantaged, marginalized, and vulnerable youth.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                In 2024, <span className="font-bold text-emerald-700">320 students were enrolled</span>, all of whom were fully sponsored for their course and feeding fees. No student is turned away due to financial need.
              </p>
              <div className="space-y-3">
                {[
                  "Accepts street children, orphans & vulnerable youth",
                  "Fully sponsored course & feeding fees",
                  "Government of Rwanda accredited curriculum",
                  "8 months classes + 4 months internship",
                  "Entrepreneurship pathway & job placement",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-200 rounded-full -translate-y-8 translate-x-8 opacity-50" />
              <div className="relative z-10">
                <h3 className="font-bold text-orange-800 text-lg mb-6">Program Structure</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800">Quality Primary Education</h4>
                    </div>
                    <p className="text-gray-500 text-sm">Targeted at school dropouts and vulnerable children, providing foundational education and pathway to secondary school.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800">One-Year TVET Short Courses</h4>
                    </div>
                    <p className="text-gray-500 text-sm">Practical vocational training in 5 disciplines with 8 months of classroom learning and 4 months of internship placement.</p>
                  </div>
                  <div className="bg-emerald-700 rounded-xl p-5">
                    <h4 className="font-bold text-white mb-2">After Graduation</h4>
                    <p className="text-emerald-200 text-sm">Students receive entrepreneurship guidance and job placement support to help them start businesses or find employment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TVET Courses */}
      <section id="courses" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Vocational Training</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              TVET <span className="text-emerald-700">Short Courses</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Five government-accredited one-year vocational courses designed to create immediate employment pathways for graduates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.title} className={`${course.bg} rounded-2xl p-6 card-hover border border-white`}>
                <div className={`w-12 h-12 ${course.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <course.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${course.color}`}>{course.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{course.desc}</p>
                <div className="mt-4 bg-white/70 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-800">8 months classes + 4 months internship</p>
                </div>
              </div>
            ))}

            {/* Primary Education Card */}
            <div className="bg-emerald-50 rounded-2xl p-6 card-hover border border-white">
              <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-emerald-700">Quality Primary Education</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                For school dropouts and vulnerable children — foundational education to restore learning pathways and open doors to secondary education.
              </p>
              <div className="mt-4 bg-white/70 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500">Focus</p>
                <p className="text-sm font-medium text-gray-800">Dropouts & vulnerable children</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship CTA */}
      <section className="section-padding bg-gradient-to-br from-emerald-800 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Sponsor a Student at Faina Jerusalem
          </h2>
          <p className="text-emerald-200 text-lg mb-4 max-w-2xl mx-auto">
            Every sponsored student at Faina Jerusalem Village receives full course fees, feeding support, and mentorship. Your gift gives a child a real future.
          </p>
          <p className="text-orange-300 font-semibold text-sm mb-10">
            All donations are receipted, monitored, and audited. Funds are used only for approved activities.
          </p>
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
              Learn More <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
