"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Partner } from "@/lib/queries";

// How many cards fit side by side for a given slider width.
function cardsPerView(width: number) {
  if (width < 520) return 2;
  if (width < 800) return 3;
  if (width < 1040) return 4;
  return 5;
}

const CSS = `
  .pc { position: relative; cursor: default; }
  .pc-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.78);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px;
    opacity: 0;
    transition: opacity 0.22s ease;
    pointer-events: none;
  }
  .pc:hover .pc-overlay { opacity: 1; pointer-events: auto; }
  .pc-icon {
    background: #f97316;
    border-radius: 50%; padding: 12px;
    transform: scale(0.7);
    transition: transform 0.22s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  }
  .pc:hover .pc-icon { transform: scale(1); }
  .pc-label {
    color: #fff; font-size: 13px;
    font-weight: 800; letter-spacing: 0.12em;
    text-transform: uppercase;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
`;

export default function PartnersSlider({ partners }: { partners: Partner[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [width, setWidth] = useState(0);
  const [rawIdx, setIdx] = useState(0);
  const dirRef = useRef(1);

  // Cards are sized from the measured width so a whole number always fits,
  // on phones as well as desktops.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const perView = cardsPerView(width || 1200);
  const gap = width && width < 520 ? 12 : 24;
  const cardW = width ? (width - gap * (perView - 1)) / perView : 200;
  const step = cardW + gap;
  const maxIdx = Math.max(0, partners.length - perView);
  const idx = Math.min(rawIdx, maxIdx);

  useEffect(() => {
    if (maxIdx === 0) return;
    const timer = setInterval(() => {
      setIdx(prev => {
        let next = prev + dirRef.current;
        if (next >= maxIdx) { next = maxIdx; dirRef.current = -1; }
        else if (next <= 0) { next = 0;      dirRef.current =  1; }
        return next;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [maxIdx]);

  const prev = () => { dirRef.current = -1; setIdx(i => Math.max(0, Math.min(i, maxIdx) - 1)); };
  const next = () => { dirRef.current =  1; setIdx(i => Math.min(maxIdx, i + 1)); };

  // Swipe left / right on touch screens
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx <= -40) next();
    else if (dx >= 40) prev();
  };

  const arrowCls = "flex-shrink-0 w-11 h-11 rounded-full border-2 border-gray-200 items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-sm";

  if (!partners.length) return null;

  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      <style>{CSS}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Partners</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Working Together for <span className="text-emerald-700">Rwanda</span>
          </h2>
        </div>

        <div className="relative flex items-center gap-4">
          {/* Side arrows from tablet up; phones get them below the cards */}
          <button onClick={prev} disabled={idx === 0} aria-label="Previous" className={`hidden sm:flex ${arrowCls}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div ref={viewportRef} className="overflow-hidden flex-1 min-w-0 py-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="flex" style={{ gap: `${gap}px`, transform: `translateX(-${idx * step}px)`, transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
              {partners.map(p => (
                <div
                  key={p.abbr}
                  className="pc flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100"
                  style={{ width: cardW, transition: "box-shadow 0.25s ease, transform 0.25s ease" }}
                >
                  {/* Image / fallback */}
                  <div className="relative bg-white h-24 sm:h-[130px]">
                    {p.logo_url ? (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.logo_url} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${p.bg_gradient} flex items-center justify-center`}>
                        <span className={`text-white font-extrabold ${p.abbr.length > 4 ? "text-xl sm:text-[26px]" : "text-3xl sm:text-[38px]"}`}>
                          {p.abbr}
                        </span>
                      </div>
                    )}

                    {/* Overlay — always rendered; only clickable when website_url is set */}
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="pc-overlay rounded-t-2xl">
                        <div className="pc-icon">
                          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <span className="pc-label">Visit Website</span>
                      </a>
                    ) : (
                      <div className="pc-overlay rounded-t-2xl">
                        <div className="pc-icon">
                          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <span className="pc-label">Visit Website</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="px-2 sm:px-4 py-2 min-h-[3.25rem] flex items-center justify-center text-center border-t border-gray-100">
                    <p className="text-gray-700 text-xs sm:text-sm font-semibold leading-snug">{p.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={next} disabled={idx === maxIdx} aria-label="Next" className={`hidden sm:flex ${arrowCls}`}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
          <button onClick={prev} disabled={idx === 0} aria-label="Previous" className={`flex sm:hidden ${arrowCls}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex justify-center gap-2">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to position ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === idx ? "w-7 h-2.5 bg-orange-500" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
          </div>
          <button onClick={next} disabled={idx === maxIdx} aria-label="Next" className={`flex sm:hidden ${arrowCls}`}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
