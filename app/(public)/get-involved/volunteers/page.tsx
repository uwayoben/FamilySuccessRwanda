import { GraduationCap, Wrench, Activity, Users, Baby, Megaphone } from "lucide-react";
import VolunteerForm from "./VolunteerForm";

export const metadata = {
  title: "Volunteers | Family Success Rwanda",
  description:
    "Volunteer with Family Success Rwanda. Give your time and skills to support vulnerable children, women, and families in Nyaruguru District.",
};

const areas = [
  { icon: GraduationCap, title: "Education", desc: "Support children and youth with learning, tutoring, and life skills." },
  { icon: Wrench, title: "Faina Jerusalem Village", desc: "Share practical and vocational skills with TVET students." },
  { icon: Activity, title: "Healthcare", desc: "Help with healthcare outreach and community health education." },
  { icon: Users, title: "Women & Community", desc: "Support savings groups, entrepreneurship, and family programs." },
  { icon: Baby, title: "Children & Youth", desc: "Take part in activities that give children care and encouragement." },
  { icon: Megaphone, title: "Fundraising & Communications", desc: "Help tell our story and connect us with new supporters." },
];

export default function VolunteersPage() {
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
            Become a <span className="text-orange-400">Volunteer</span>
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Give your time and skills to help transform the lives of vulnerable children, women, and families in Rwanda.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Areas */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Where You Can Help</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Ways to <span className="text-emerald-700">Volunteer</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => (
              <div key={area.title} className="bg-emerald-50 rounded-2xl p-6 card-hover border border-white">
                <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center mb-4">
                  <area.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-emerald-800">{area.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="apply" className="section-padding bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Apply</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Volunteer <span className="text-emerald-700">Application</span>
            </h2>
            <p className="text-gray-600">Fill in the form and our team will get in touch with you.</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 lg:p-14">
            <VolunteerForm />
          </div>
        </div>
      </section>
    </>
  );
}
