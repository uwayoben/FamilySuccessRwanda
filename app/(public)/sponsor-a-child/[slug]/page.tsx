import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Cake, GraduationCap, Sparkles, CheckCircle, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import ChildPhoto, { ChildStatusBadge } from "@/components/ChildPhoto";
import { ChildCard } from "@/components/SponsorChildren";
import { getSetting } from "@/lib/queries";
import { htmlToText, toRichHtml } from "@/lib/richText";
import {
  SPONSOR_CHILD_SETTING_KEY,
  parseSponsorChildContent,
  getChildrenSectionProps,
  sponsorLink,
} from "@/lib/sponsorChild";

async function getChild(slug: string) {
  const section = getChildrenSectionProps(parseSponsorChildContent(await getSetting(SPONSOR_CHILD_SETTING_KEY)));
  const child = section.items.find((c) => c.slug === slug);
  return child ? { child, ...section } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const found = await getChild((await params).slug);
  if (!found) return { title: "Child not found | Family Success Rwanda" };
  const { child } = found;
  return {
    title: `Sponsor ${child.name} | Family Success Rwanda`,
    description: htmlToText(child.story).slice(0, 160) || `Meet ${child.name} and become their sponsor.`,
  };
}

export default async function ChildPage({ params }: { params: Promise<{ slug: string }> }) {
  const found = await getChild((await params).slug);
  if (!found) notFound();
  const { child, items, provisions, monthlyCost } = found;

  const storyHtml = toRichHtml(child.story);
  const others = items.filter((c) => c.slug !== child.slug).slice(0, 3);

  const facts = [
    { icon: Cake, label: "Age", value: child.age.trim() && `${child.age} years old` },
    { icon: GraduationCap, label: "School", value: child.school.trim() },
    { icon: Sparkles, label: "Dream", value: child.dream.trim() },
  ].filter((f) => f.value);

  return (
    <>
      {/* Header band */}
      <section className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 pt-32 pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-orange-400 rounded-full" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-white rounded-full" style={{ filter: "blur(80px)" }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-emerald-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/sponsor-a-child" className="hover:text-white transition-colors">Sponsor a Child</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{child.name}</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-6">
            Meet <span className="text-orange-400">{child.name}</span>
          </h1>
          <p className="text-emerald-200 text-lg mt-3 max-w-2xl">
            {child.sponsored
              ? `${child.name} already has a loving sponsor. Thank you for caring!`
              : `${child.name} is waiting for a sponsor who will walk alongside them.`}
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-white pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Photo + facts */}
            <aside className="lg:col-span-2">
              <div className="lg:sticky lg:top-28 space-y-5">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white bg-white">
                  <ChildPhoto child={child} className="absolute inset-0 w-full h-full" />
                  <div className="absolute top-4 left-4">
                    <ChildStatusBadge sponsored={child.sponsored} />
                  </div>
                </div>

                {facts.length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 grid gap-4">
                    {facts.map((f) => (
                      <div key={f.label} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center flex-shrink-0">
                          <f.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{f.label}</p>
                          <p className="font-bold text-gray-900">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* Story + sponsor */}
            <div className="lg:col-span-3 lg:pt-28">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">{child.name}&apos;s Story</span>
              {storyHtml ? (
                <div
                  className="rich-text text-gray-600 text-lg leading-relaxed mt-4"
                  // Cleaned by toRichHtml/sanitizeHtml: only simple formatting tags remain.
                  dangerouslySetInnerHTML={{ __html: storyHtml }}
                />
              ) : (
                <p className="text-gray-500 mt-4">{child.name}&apos;s story will be shared soon.</p>
              )}

              {provisions.length > 0 && (
                <div className="mt-10 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 sm:p-8">
                  <h2 className="font-bold text-orange-800 text-lg mb-4">
                    {child.sponsored ? `${child.name}'s sponsor provides:` : `Your sponsorship gives ${child.name}:`}
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {provisions.map((p) => (
                      <li key={p} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm text-gray-800 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-400/20 rounded-full" style={{ filter: "blur(40px)" }} />
                <div className="relative">
                  <Heart className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                  {child.sponsored ? (
                    <>
                      <p className="text-white text-xl font-extrabold">{child.name} has a sponsor</p>
                      <p className="text-emerald-200 mt-2">Other children are still waiting for someone like you.</p>
                      <Link
                        href="/sponsor-a-child#children"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg mt-6"
                      >
                        See children waiting <ArrowRight className="w-5 h-5" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-white text-xl font-extrabold">Become {child.name}&apos;s sponsor</p>
                      {monthlyCost?.amount.trim() && (
                        <p className="text-emerald-200 mt-2">
                          From <span className="text-white font-extrabold text-2xl">{monthlyCost.amount}</span> {monthlyCost.period}
                        </p>
                      )}
                      <Link
                        href={sponsorLink(child.name)}
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg mt-6"
                      >
                        <Heart className="w-5 h-5" /> Sponsor {child.name}
                      </Link>
                      <p className="text-emerald-300 text-xs mt-4">We will contact you with the next steps after you submit the form.</p>
                    </>
                  )}
                </div>
              </div>

              <Link
                href="/sponsor-a-child#children"
                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold mt-8"
              >
                <ArrowLeft className="w-4 h-4" /> Back to all children
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other children */}
      {others.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-orange-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">More Children</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                Other Children <span className="text-emerald-700">You Can Help</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((c) => (
                <ChildCard key={c.slug} child={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
