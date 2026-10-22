"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Cake, ArrowRight, Sparkles, Users, GraduationCap } from "lucide-react";
import { htmlToText } from "@/lib/richText";
import { childPageLink, sponsorLink, type SponsorChildProfile } from "@/lib/sponsorChild";
import ChildPhoto, { ChildStatusBadge } from "@/components/ChildPhoto";

type Filter = "waiting" | "all" | "sponsored";

export function ChildCard({ child }: { child: SponsorChildProfile }) {
  const excerpt = htmlToText(child.story);
  const href = childPageLink(child);
  return (
    <article className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 card-hover flex flex-col">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
        aria-label={`Read ${child.name}'s story`}
      >
        <ChildPhoto child={child} className="w-full h-full transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4">
          <ChildStatusBadge sponsored={child.sponsored} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-2xl font-extrabold text-white">{child.name}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-orange-200 text-sm font-medium">
            {child.age.trim() && (
              <span className="flex items-center gap-1.5">
                <Cake className="w-4 h-4" /> {child.age} years old
              </span>
            )}
            {child.school.trim() && (
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> {child.school}
              </span>
            )}
          </div>
        </div>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-white/95 text-emerald-800 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg">
            Read {child.name}&apos;s story
          </span>
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {child.dream.trim() && (
          <p className="text-xs font-semibold text-emerald-700 mb-2">
            <Sparkles className="inline w-3.5 h-3.5 -mt-0.5 mr-1" />
            Dream: {child.dream}
          </p>
        )}
        {excerpt && <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{excerpt}</p>}
        <div className="mt-auto pt-5 flex items-center gap-2">
          <Link
            href={href}
            className="flex-1 text-center text-sm font-semibold text-emerald-700 hover:text-emerald-900 border-2 border-emerald-100 hover:border-emerald-300 rounded-full px-4 py-2.5 transition-colors"
          >
            Read more
          </Link>
          {!child.sponsored && (
            <Link
              href={sponsorLink(child.name)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors shadow"
            >
              <Heart className="w-4 h-4" /> Sponsor
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SponsorChildren({
  items,
  limit,
}: {
  items: SponsorChildProfile[];
  // Show at most this many cards, with a link to the full list on Sponsor a Child.
  limit?: number;
}) {
  const waitingCount = items.filter((c) => !c.sponsored).length;
  const sponsoredCount = items.length - waitingCount;
  const [filter, setFilter] = useState<Filter>(waitingCount > 0 ? "waiting" : "all");

  const matching = items.filter((c) =>
    filter === "all" ? true : filter === "waiting" ? !c.sponsored : c.sponsored
  );
  const visible = limit ? matching.slice(0, limit) : matching;

  const tabs: { value: Filter; label: string; count: number }[] = [
    { value: "waiting", label: "Waiting", count: waitingCount },
    { value: "sponsored", label: "Sponsored", count: sponsoredCount },
    { value: "all", label: "All children", count: items.length },
  ];

  return (
    <section id="children" className="section-padding relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-emerald-50/60 scroll-mt-20">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 bg-orange-200/50 rounded-full" style={{ filter: "blur(80px)" }} />
      <div className="pointer-events-none absolute bottom-0 -right-24 w-96 h-96 bg-emerald-200/50 rounded-full" style={{ filter: "blur(90px)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-white border border-orange-200 text-orange-600 font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4" /> Choose a Child
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mt-5 mb-4">
            Meet the Children <span className="text-emerald-700">Waiting for You</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Each of these children has a name, a story and a dream. Click on a child to read their story,
            then choose the one you would like to walk alongside.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{waitingCount}</p>
                <p className="text-xs text-gray-500 mt-1">waiting for a sponsor</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{sponsoredCount}</p>
                <p className="text-xs text-gray-500 mt-1">already sponsored</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  filter === tab.value ? "bg-emerald-700 text-white shadow" : "text-gray-600 hover:text-emerald-700"
                }`}
              >
                {tab.label} <span className={filter === tab.value ? "text-emerald-200" : "text-gray-400"}>({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            {filter === "waiting" ? "Every child currently has a sponsor — thank you! Check back soon." : "No children to show yet."}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((child) => (
              <ChildCard key={child.slug} child={child} />
            ))}
          </div>
        )}

        {limit && (
          <div className="text-center mt-12">
            <Link
              href="/sponsor-a-child#children"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              {matching.length > visible.length ? `See all ${matching.length} children` : "Learn about sponsoring a child"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
