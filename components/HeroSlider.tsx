"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/lib/queries";

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating]
  );

  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[current];

  if (!slides.length) return null;

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image src={s.image_url} alt={s.highlight} fill priority={i === 0} sizes="100vw" className="object-cover object-center" />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/25 sm:hidden" />
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
        </div>
      ))}

      {/* Slide content */}
      <div className="relative z-20 min-h-[100svh] flex flex-col justify-center max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 pb-24 sm:pb-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div key={`text-${current}`} className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 max-w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full text-[11px] sm:text-xs leading-snug font-medium mb-5 sm:mb-7">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse flex-shrink-0" />
              {slide.tag}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-1 drop-shadow-lg">{slide.title}</h1>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-orange-400 leading-tight mb-5 sm:mb-7 drop-shadow-lg">{slide.highlight}</h1>
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed mb-7 sm:mb-10 max-w-xl drop-shadow">{slide.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href={slide.cta1_href} className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 sm:py-4 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-200">
                {slide.cta1_label}
              </Link>
              <Link href={slide.cta2_href} className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 sm:py-4 rounded-full text-sm transition-all duration-200">
                {slide.cta2_label} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-20 lg:bottom-14 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:grid grid-cols-4 gap-3 max-w-xl">
            {[
              { value: "320+", label: "Students" },
              { value: "6", label: "Programs" },
              { value: "2020", label: "Founded" },
              { value: "100%", label: "Transparent" },
            ].map(s => (
              <div key={s.label} className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-3 text-center">
                <p className="text-lg font-extrabold text-orange-400">{s.value}</p>
                <p className="text-white/70 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows — bottom corners on phones/tablets, vertically centred on desktop */}
      <button onClick={prev} className="absolute left-4 sm:left-6 bottom-5 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-30 w-9 h-9 lg:w-11 lg:h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110" aria-label="Previous slide">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 sm:right-6 bottom-5 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-30 w-9 h-9 lg:w-11 lg:h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110" aria-label="Next slide">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2.5 bg-orange-400" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
