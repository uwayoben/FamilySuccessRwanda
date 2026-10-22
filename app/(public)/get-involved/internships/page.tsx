import {
  Briefcase, Users, HeartHandshake, TrendingUp, Activity, GraduationCap, Megaphone, Calculator,
  BarChart3, ClipboardList, Search, MessageCircle, Rocket, CheckCircle, ArrowRight,
} from "lucide-react";
import InternshipForm from "./InternshipForm";

export const metadata = {
  title: "Internships | Family Success Rwanda",
  description:
    "Apply for an internship with Family Success Rwanda. Gain hands-on experience in community development, education, healthcare, social work and more in Rwanda.",
};

const benefits = [
  { icon: Briefcase, title: "Real Work Experience", desc: "Work on real projects that support children, women and families in rural Rwanda." },
  { icon: Users, title: "Guidance From Our Team", desc: "Learn alongside experienced staff who support you throughout your internship." },
  { icon: TrendingUp, title: "Grow Your Skills", desc: "Build practical and professional skills for your future career." },
  { icon: HeartHandshake, title: "Make a Difference", desc: "See the impact of your work in the communities we serve." },
];

const departments = [
  { icon: Users, title: "Programs & Community Development", desc: "Women empowerment, VSLAs, youth and family strengthening programs." },
  { icon: GraduationCap, title: "Education", desc: "Support teaching and TVET training at Faina Jerusalem Village." },
  { icon: Activity, title: "Healthcare", desc: "Community health education and medical outreach activities." },
  { icon: HeartHandshake, title: "Social Work & Child Protection", desc: "Support vulnerable children and families with our social workers." },
  { icon: Calculator, title: "Finance & Administration", desc: "Accounting, reporting, procurement and office administration." },
  { icon: Megaphone, title: "Communications, Media & IT", desc: "Photography, writing, social media, website and IT support." },
  { icon: BarChart3, title: "Monitoring & Evaluation", desc: "Data collection, research and measuring the impact of our work." },
];

const eligibility = [
  "Students at a university, college or TVET school",
  "Recent graduates looking for professional experience",
  "Students who need an internship for their studies",
  "Motivated, respectful and willing to learn",
];

const steps = [
  { icon: ClipboardList, title: "Apply Online", desc: "Fill in the application form below." },
  { icon: Search, title: "Review", desc: "Our team reviews your application." },
  { icon: MessageCircle, title: "Interview", desc: "Shortlisted applicants are invited to talk with us." },
  { icon: Rocket, title: "Start", desc: "Agree on your start date and begin your internship." },
];

export default function InternshipsPage() {
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
            Internship <span className="text-orange-400">Opportunities</span>
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Start your career while helping transform the lives of vulnerable children, women and families in Rwanda.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg mt-8"
          >
            Apply Now <ArrowRight className="w-5 h-5" />
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Why intern */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Why Intern With Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Learn, Grow and <span className="text-emerald-700">Make an Impact</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 card-hover border border-orange-100">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section-padding bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Where You Can Intern</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Internship <span className="text-emerald-700">Areas</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((d) => (
              <div key={d.title} className="bg-white rounded-2xl p-6 card-hover border border-white shadow-sm">
                <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center mb-4">
                  <d.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-emerald-800">{d.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can apply + how it works */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Who Can Apply</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3 mb-6">
              Is This <span className="text-emerald-700">for You?</span>
            </h2>
            <ul className="space-y-4">
              {eligibility.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3 mb-6">
              Application <span className="text-emerald-700">Process</span>
            </h2>
            <ol className="space-y-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center">
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <p className="text-gray-600 text-sm">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="apply" className="section-padding bg-gray-50 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Apply</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Internship <span className="text-emerald-700">Application</span>
            </h2>
            <p className="text-gray-600">Fill in the form and our team will get in touch with you.</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 lg:p-14">
            <InternshipForm />
          </div>
        </div>
      </section>
    </>
  );
}
