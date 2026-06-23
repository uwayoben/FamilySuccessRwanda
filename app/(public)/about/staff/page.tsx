import Link from "next/link";
import { ArrowRight, Mail, Users, Briefcase } from "lucide-react";
import { getAllStaff } from "@/lib/queries";

export const metadata = {
  title: "Our Staff | Family Success Rwanda",
  description: "Meet the dedicated team behind Family Success Rwanda — the people who make our mission possible every day.",
};

const departmentColors: Record<string, string> = {
  Leadership:              "bg-emerald-100 text-emerald-700 border-emerald-200",
  Programs:                "bg-blue-100 text-blue-700 border-blue-200",
  "Faina Jerusalem Village": "bg-orange-100 text-orange-700 border-orange-200",
  Healthcare:              "bg-red-100 text-red-700 border-red-200",
  Administration:          "bg-purple-100 text-purple-700 border-purple-200",
};

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
      <span className="text-white text-4xl font-extrabold">{initials}</span>
    </div>
  );
}

export default async function StaffPage() {
  const staffMembers = await getAllStaff();
  const departments = [...new Set(staffMembers.map((m) => m.department))];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-orange-400 rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-20 w-60 h-60 bg-white rounded-full" style={{ filter: "blur(80px)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">The People Behind FSR</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-5">Meet Our Staff</h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Dedicated men and women serving vulnerable communities in Rwanda with passion, professionalism, and faith.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm">
            <Link href="/about" className="text-emerald-300 hover:text-orange-400 transition-colors">Background</Link>
            <span className="text-emerald-600">/</span>
            <span className="text-white font-medium">Our Staff</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{staffMembers.length}</p>
                <p className="text-xs text-gray-400">Team Members</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{departments.length}</p>
                <p className="text-xs text-gray-400">Departments</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-auto">
              {departments.map((dept) => (
                <span key={dept} className={`text-xs font-semibold px-3 py-1 rounded-full border ${departmentColors[dept] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {staffMembers.map((member) => (
              <div key={member.slug} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover flex flex-col">
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarPlaceholder name={member.name} />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${departmentColors[member.department] ?? "bg-white text-gray-600 border-gray-200"}`}>
                      {member.department}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-0.5">{member.name}</h3>
                  <p className="text-orange-600 font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{member.short_bio}</p>

                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {member.expertise.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                    <Link
                      href={`/about/staff/${member.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
                    >
                      View Profile <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 text-gray-400 rounded-full transition-colors"
                        aria-label="Send email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Join the team CTA */}
      <section className="section-padding bg-gradient-to-r from-emerald-800 to-emerald-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Want to Join Our Team?</h2>
          <p className="text-emerald-200 mb-8">
            FSR welcomes passionate individuals who share our vision. Whether as staff, volunteers, or partners — there is a place for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg"
          >
            Get in Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
