"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, X, CheckCircle, Cake, ArrowRight, Sparkles, Users } from "lucide-react";
import type { SponsorChildCost, SponsorChildProfile } from "@/lib/sponsorChild";

type Filter = "waiting" | "all" | "sponsored";

const sponsorLink = (name: string) => `/donate?type=children&child=${encodeURIComponent(name)}`;

function ChildPhoto({ child, className }: { child: SponsorChildProfile; className: string }) {
  return child.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={child.photo} alt={child.name} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-gradient-to-br from-emerald-100 to-orange-100 ${className}`}>
      <span className="text-6xl font-extrabold text-emerald-700/40">{child.name.charAt(0)}</span>
    </div>
  );
}

function StatusBadge({ sponsored }: { sponsored: boolean }) {
  return sponsored ? (
    <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
      <CheckCircle className="w-3.5 h-3.5" /> Sponsored
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 bg-white/95 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full shadow">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-orange-400 opacity-75 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-orange-500" />
      </span>
      Waiting for a sponsor
    </span>
  );
}

export default function SponsorChildren({
  items,
  provisions,
  monthlyCost,
  limit,
}: {
  items: SponsorChildProfile[];
  provisions: string[];
  monthlyCost?: SponsorChildCost;
  // Show at most this many cards, with a link to the full list on Sponsor a Child.
  limit?: number;
}) {
  const waitingCount = items.filter((c) => !c.sponsored).length;
  const sponsoredCount = items.length - waitingCount;
  const [filter, setFilter] = useState<Filter>(waitingCount > 0 ? "waiting" : "all");
  const [selected, setSelected] = useState<SponsorChildProfile | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  const closeDialog = () => {
    document.body.style.overflow = "";
    setSelected(null);
  };

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
            {visible.map((child, i) => (
              <article
                key={`${child.name}-${i}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 card-hover flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setSelected(child)}
                  className="relative block aspect-[4/5] overflow-hidden text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
                  aria-label={`Read ${child.name}'s story`}
                >
                  <ChildPhoto child={child} className="w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <StatusBadge sponsored={child.sponsored} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-2xl font-extrabold text-white">{child.name}</h3>
                    {child.age.trim() && (
                      <p className="flex items-center gap-1.5 text-orange-200 text-sm font-medium mt-1">
                        <Cake className="w-4 h-4" /> {child.age} years old
                      </p>
                    )}
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/95 text-emerald-800 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg">
                      View story
                    </span>
                  </span>
                </button>

                <div className="p-5 flex flex-col flex-1">
                  {child.story.trim() && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{child.story}</p>
                  )}
                  <div className="mt-auto pt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(child)}
                      className="flex-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900 border-2 border-emerald-100 hover:border-emerald-300 rounded-full px-4 py-2.5 transition-colors"
                    >
                      Read more
                    </button>
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

      {/* Child detail popup */}
      <dialog
        ref={dialogRef}
        onClose={closeDialog}
        onClick={(e) => e.target === e.currentTarget && closeDialog()}
        className="m-auto w-[calc(100%-2rem)] max-w-4xl max-h-[90vh] rounded-3xl p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {selected && (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[520px]">
              <ChildPhoto child={selected} className="absolute inset-0 w-full h-full" />
              <div className="absolute top-4 left-4">
                <StatusBadge sponsored={selected.sponsored} />
              </div>
            </div>

            <div className="relative p-6 sm:p-8 flex flex-col">
              <button
                type="button"
                onClick={closeDialog}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <span className="text-orange-600 font-semibold text-xs uppercase tracking-widest">Meet</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1 pr-12">{selected.name}</h3>
              {selected.age.trim() && (
                <p className="flex items-center gap-1.5 text-emerald-700 font-semibold mt-2">
                  <Cake className="w-4 h-4" /> {selected.age} years old
                </p>
              )}

              {selected.story.trim() && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    {selected.name}&apos;s story
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selected.story}</p>
                </div>
              )}

              {provisions.length > 0 && (
                <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-orange-800 mb-3">Your sponsorship gives {selected.name}:</h4>
                  <ul className="space-y-2">
                    {provisions.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-8">
                {selected.sponsored ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                    <p className="text-emerald-800 font-semibold">
                      {selected.name} already has a loving sponsor. Thank you!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        closeDialog();
                        setFilter("waiting");
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 mt-3"
                    >
                      See children still waiting <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {monthlyCost?.amount.trim() && (
                      <p className="text-center text-sm text-gray-500 mb-3">
                        From <span className="font-extrabold text-emerald-800 text-base">{monthlyCost.amount}</span>{" "}
                        {monthlyCost.period}
                      </p>
                    )}
                    <Link
                      href={sponsorLink(selected.name)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
                    >
                      <Heart className="w-5 h-5" /> Sponsor {selected.name}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
