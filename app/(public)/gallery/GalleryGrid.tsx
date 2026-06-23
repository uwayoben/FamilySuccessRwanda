"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = {
  id: number;
  image_url: string;
  description: string;
};

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const current = active !== null ? items[active] : null;

  const prev = useCallback(() => {
    setActive(i => (i !== null ? (i - 1 + items.length) % items.length : null));
  }, [items.length]);

  const next = useCallback(() => {
    setActive(i => (i !== null ? (i + 1) % items.length : null));
  }, [items.length]);

  const close = () => setActive(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, prev, next]);

  if (items.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="text-lg">No photos yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActive(index)}
            className="break-inside-avoid rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white group relative cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.description || "FSR Gallery"}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4">
                <p className="text-white text-sm leading-relaxed">{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && current && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image + caption */}
          <div
            className="flex flex-col items-center max-w-5xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image_url}
              alt={current.description || "FSR Gallery"}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            {current.description && (
              <p className="mt-4 text-white/90 text-center text-sm sm:text-base max-w-2xl leading-relaxed">
                {current.description}
              </p>
            )}
            <p className="mt-2 text-white/40 text-xs">
              {active + 1} / {items.length}
            </p>
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
