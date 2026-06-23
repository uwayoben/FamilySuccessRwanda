"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft, ChevronRight, ArrowRight,
  Globe, GraduationCap, BookOpen, Users, Target,
  Sparkles, Heart, HeartHandshake, Scale, Handshake,
  Leaf, Star, Flame, Feather, TrendingUp, Baby, Activity, Home,
  type LucideIcon,
} from "lucide-react";
import type { HeroSlide } from "@/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  users: Users,
  target: Target,
  sparkles: Sparkles,
  heart: Heart,
  "heart-handshake": HeartHandshake,
  scale: Scale,
  handshake: Handshake,
  leaf: Leaf,
  star: Star,
  flame: Flame,
  feather: Feather,
  "trending-up": TrendingUp,
  baby: Baby,
  activity: Activity,
  home: Home,
};

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
  const SlideIcon = ICON_MAP[slide?.icon_name] ?? Globe;

  if (!slides.length) return null;

  return (
    <section
      className="relative min-h-screen overflow-hidden"
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
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
        </div>
      ))}

      {/* Slide content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div key={`text-${current}`} className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-xs font-medium mb-7">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              {slide.tag}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-1 drop-shadow-lg">{slide.title}</h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-400 leading-tight mb-7 drop-shadow-lg">{slide.highlight}</h1>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-10 max-w-xl drop-shadow">{slide.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={slide.cta1_href} className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-4 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-200">
                {slide.cta1_label}
              </Link>
              <Link href={slide.cta2_href} className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-4 rounded-full text-sm transition-all duration-200">
                {slide.cta2_label} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Stat card */}
          <div key={`card-${current}`} className="hidden lg:flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-xs">
              <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center shadow-2xl">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <SlideIcon className="w-10 h-10 text-orange-400" />
                </div>
                <p className="text-6xl font-extrabold text-orange-400 leading-none mb-2">{slide.stat_value}</p>
                <p className="text-white font-bold text-base">{slide.stat_label}</p>
                <div className="mt-7 pt-6 border-t border-white/20 space-y-2.5">
                  {slide.bullets.map(item => (
                    <div key={item} className="flex items-center gap-2 text-white/75 text-sm">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -left-5 bg-white rounded-xl px-3 py-2 shadow-lg text-xs font-bold text-emerald-700 whitespace-nowrap">
                ✓ RGB Registered NGO
              </div>
              <div className="absolute -bottom-4 -right-5 bg-orange-500 rounded-xl px-3 py-2 shadow-lg text-xs font-bold text-white whitespace-nowrap">
                100% Transparent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-14 left-0 right-0 z-20 pointer-events-none">
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

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110" aria-label="Previous slide">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110" aria-label="Next slide">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2.5 bg-orange-400" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
        <div key={`${current}-${paused}`} className="h-full bg-orange-400"
          style={{ animation: paused ? "none" : "sliderProgress 5.5s linear forwards" }} />
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <style>{`@keyframes sliderProgress { from { width: 0%; } to { width: 100%; } }`}</style>
    </section>
  );
}
