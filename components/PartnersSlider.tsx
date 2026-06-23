"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Partner } from "@/lib/queries";

const CARD_W  = 200;
const GAP     = 24;
const STEP    = CARD_W + GAP;
const VISIBLE = 5;

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
  const maxIdx = Math.max(0, partners.length - VISIBLE);
  const [idx, setIdx] = useState(0);
  const dirRef = useRef(1);

  useEffect(() => {
    if (partners.length <= VISIBLE) return;
    const timer = setInterval(() => {
      setIdx(prev => {
        let next = prev + dirRef.current;
        if (next >= maxIdx) { next = maxIdx; dirRef.current = -1; }
        else if (next <= 0) { next = 0;      dirRef.current =  1; }
        return next;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [maxIdx, partners.length]);

  const prev = () => { dirRef.current = -1; setIdx(i => Math.max(0, i - 1)); };
  const next = () => { dirRef.current =  1; setIdx(i => Math.min(maxIdx, i + 1)); };

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
          <button onClick={prev} disabled={idx === 0} aria-label="Previous"
            className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="overflow-hidden flex-1">
            <div className="flex" style={{ gap: `${GAP}px`, transform: `translateX(-${idx * STEP}px)`, transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
              {partners.map(p => (
                <div
                  key={p.abbr}
                  className="pc flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100"
                  style={{ width: CARD_W, transition: "box-shadow 0.25s ease, transform 0.25s ease" }}
                >
                  {/* Image / fallback */}
                  <div className="relative bg-white" style={{ height: 130 }}>
                    {p.logo_url ? (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.logo_url} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${p.bg_gradient} flex items-center justify-center`}>
                        <span className="text-white font-extrabold" style={{ fontSize: p.abbr.length > 4 ? 26 : 38 }}>
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
                  <div className="px-4 py-3 text-center border-t border-gray-100">
                    <p className="text-gray-700 text-sm font-semibold">{p.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={next} disabled={idx === maxIdx} aria-label="Next"
            className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to position ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === idx ? "w-7 h-2.5 bg-orange-500" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
