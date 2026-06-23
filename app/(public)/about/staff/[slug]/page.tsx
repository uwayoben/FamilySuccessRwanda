import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, Star, ArrowRight } from "lucide-react";
import { getStaffBySlug, getAllStaff } from "@/lib/queries";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const member = await getStaffBySlug(slug);
  if (!member) return { title: "Staff | Family Success Rwanda" };
  return {
    title: `${member.name} — ${member.role} | Family Success Rwanda`,
    description: member.short_bio,
  };
}

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
      <span className="text-white text-5xl font-extrabold">{initials}</span>
    </div>
  );
}

export default async function StaffBioPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [member, allStaff] = await Promise.all([getStaffBySlug(slug), getAllStaff()]);
  if (!member) notFound();

  const currentIndex = allStaff.findIndex((s) => s.slug === slug);
  const prevMember = currentIndex > 0 ? allStaff[currentIndex - 1] : null;
  const nextMember = currentIndex < allStaff.length - 1 ? allStaff[currentIndex + 1] : null;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400 rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full" style={{ filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/about" className="text-emerald-300 hover:text-orange-400 transition-colors">About</Link>
            <span className="text-emerald-600">/</span>
            <Link href="/about/staff" className="text-emerald-300 hover:text-orange-400 transition-colors">Our Staff</Link>
            <span className="text-emerald-600">/</span>
            <span className="text-white font-medium">{member.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl border-4 border-white/10">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <AvatarPlaceholder name={member.name} />
              )}
            </div>

            <div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-3 ${departmentColors[member.department] ?? "bg-white/10 text-white border-white/20"}`}>
                {member.department}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{member.name}</h1>
              <p className="text-orange-400 font-semibold text-lg mb-4">{member.role}</p>
              <div className="flex flex-wrap gap-3">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors">
                    <Mail className="w-4 h-4" /> {member.email}
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors">
                    <Phone className="w-4 h-4" /> {member.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z" />
          </svg>
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Biography</h2>
              <p className="text-gray-600 leading-relaxed text-base">{member.full_bio}</p>

              {member.expertise && member.expertise.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" /> Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((tag) => (
                      <span key={tag} className="bg-orange-50 border border-orange-200 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-extrabold text-gray-800 mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Joined FSR</p>
                      <p className="text-gray-800 font-semibold text-sm">{member.joined_year ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Department</p>
                      <p className="text-gray-800 font-semibold text-sm">{member.department}</p>
                    </div>
                  </div>
                  {member.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email</p>
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline text-sm break-all">{member.email}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {member.education && member.education.length > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="font-extrabold text-emerald-800 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" /> Education
                  </h3>
                  <ul className="space-y-2">
                    {member.education.map((edu) => (
                      <li key={edu} className="flex items-start gap-2 text-emerald-700 text-sm">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href="/about/staff"
                className="flex items-center gap-2 text-emerald-700 font-semibold text-sm hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to All Staff
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Prev / Next navigation */}
      {(prevMember || nextMember) && (
        <section className="bg-gray-50 border-t border-gray-100 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-stretch gap-4">
            {prevMember ? (
              <Link
                href={`/about/staff/${prevMember.slug}`}
                className="flex-1 flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Previous</p>
                  <p className="font-extrabold text-gray-800 group-hover:text-orange-600 transition-colors">{prevMember.name}</p>
                  <p className="text-xs text-gray-500">{prevMember.role}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextMember ? (
              <Link
                href={`/about/staff/${nextMember.slug}`}
                className="flex-1 flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all group text-right justify-end"
              >
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Next</p>
                  <p className="font-extrabold text-gray-800 group-hover:text-orange-600 transition-colors">{nextMember.name}</p>
                  <p className="text-xs text-gray-500">{nextMember.role}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 flex-shrink-0" />
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </section>
      )}
    </>
  );
}
