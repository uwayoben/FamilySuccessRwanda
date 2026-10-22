import Link from "next/link";
import {
  Heart,
  ArrowRight,
  Utensils,
  Shirt,
  BookOpen,
  GraduationCap,
  Wrench,
  CalendarHeart,
  Share2,
} from "lucide-react";
import BankDetails from "@/components/BankDetails";
import SponsorChildren from "@/components/SponsorChildren";
import { getSetting } from "@/lib/queries";
import { SPONSOR_CHILD_SETTING_KEY, parseSponsorChildContent, getChildrenSectionProps } from "@/lib/sponsorChild";

export const metadata = {
  title: "Sponsor a Child | Family Success Rwanda",
  description:
    "Support a child who lost parental care. Sponsor a child in Rwanda through Family Success Rwanda from RWF 20,000 per month for food, clothing, and education.",
};

// Icons are assigned by position; extra items added in the admin cycle through them.
const provisionStyles = [
  { icon: Utensils, iconBg: "bg-orange-600" },
  { icon: Shirt, iconBg: "bg-emerald-700" },
  { icon: BookOpen, iconBg: "bg-orange-600" },
];
const costIcons = [Heart, GraduationCap, Wrench];
const actionIcons = [Heart, CalendarHeart, Share2];

export default async function SponsorAChildPage() {
  const content = parseSponsorChildContent(await getSetting(SPONSOR_CHILD_SETTING_KEY));

  const introParagraphs = content.intro_text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const provisions = content.provisions.map((p) => p.trim()).filter(Boolean);
  const actions = content.actions.map((a) => a.trim()).filter(Boolean);
  const costs = content.costs.filter((c) => c.amount.trim() || c.desc.trim());
  const photos = content.photos.filter((p) => p.url);
  const childrenSection = getChildrenSectionProps(content);
  const sponsorHref = childrenSection.items.length > 0 ? "#children" : "/donate?type=children";

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 pt-36 pb-24 overflow-hidden">
        {content.hero_image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.hero_image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Overlay keeps text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-20 w-64 h-64 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
            <div className="absolute bottom-0 right-10 w-72 h-72 bg-white rounded-full" style={{filter:"blur(80px)"}} />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">
            {content.hero_tag}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
            {content.hero_title} <br />
            <span className="text-orange-400">{content.hero_highlight}</span>
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
            {content.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href={sponsorHref}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              <Heart className="w-5 h-5" /> Sponsor a Child Now
            </Link>
            <a
              href="#cost"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              How Much Does It Cost? <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Why Sponsor */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-12 items-center ${content.intro_image ? "md:grid-cols-2" : "max-w-3xl mx-auto"}`}>
            <div>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Why Sponsor</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6">
                You Can <span className="text-emerald-700">Change That</span>
              </h2>
              {introParagraphs.map((paragraph, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            {content.intro_image && (
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-orange-100 rounded-3xl" />
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={content.intro_image} alt="Sponsor a child" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {provisions.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 relative overflow-hidden mt-16">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-200 rounded-full -translate-y-8 translate-x-8 opacity-50" />
              <div className="relative z-10">
                <h3 className="font-bold text-orange-800 text-lg mb-6">Your sponsorship helps provide:</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {provisions.map((title, i) => {
                    const style = provisionStyles[i % provisionStyles.length];
                    return (
                      <div key={i} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-3">
                        <div className={`w-10 h-10 ${style.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <style.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-800">{title}</h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cost */}
      <section id="cost" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Sponsorship</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              How Much Does It <span className="text-emerald-700">Cost?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {costs.map((cost, i) => {
              const Icon = costIcons[i % costIcons.length];
              return (
                <div key={i} className="bg-white rounded-2xl p-6 card-hover border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-extrabold text-emerald-800">{cost.amount}</p>
                  <p className="text-orange-600 font-semibold text-sm mb-3">{cost.period}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{cost.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Children waiting for a sponsor */}
      {childrenSection.items.length > 0 && <SponsorChildren {...childrenSection} />}

      {/* Journey + Photos */}
      {(content.journey_text.trim() || photos.length > 0) && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Their Journey</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
                Become Part of <span className="text-emerald-700">Their Story</span>
              </h2>
              {content.journey_text.trim() && (
                <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">{content.journey_text}</p>
              )}
            </div>

            {photos.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, i) => (
                  <figure key={i} className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 card-hover">
                    <div className="aspect-[4/3]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={photo.caption} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    {photo.caption.trim() && (
                      <figcaption className="px-5 py-4 text-sm text-gray-600">{photo.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <BankDetails />

      {/* Take Action CTA */}
      <section className="section-padding bg-gradient-to-br from-emerald-800 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
            Take Action Today
          </h2>
          {actions.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
              {actions.map((text, i) => {
                const Icon = actionIcons[i % actionIcons.length];
                return (
                  <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5">
                    <Icon className="w-6 h-6 text-orange-400 mb-3" />
                    <p className="text-emerald-100 text-sm leading-relaxed">{text}</p>
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-emerald-200 text-lg mb-10 max-w-2xl mx-auto">
            {content.closing_text}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={sponsorHref}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              <Heart className="w-5 h-5" /> Sponsor a Child Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
