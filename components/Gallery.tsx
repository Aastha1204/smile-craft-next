"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Reveal } from "./Reveal";
import type { SiteConfig } from "@/lib/theme";

export function Gallery({ c }: { c: SiteConfig }) {
  const [idx, setIdx] = useState<number | null>(null);
  const n = c.gallery.length;
  const go = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [idx, go]);

  return (
    <section id="gallery" className="section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{c.ui.galleryEyebrow}</span>
          <h2 className="h2">{c.ui.galleryTitle}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {c.gallery.map((g, i) => (
            <Reveal key={g.src} delay={(i % 3) * 80}>
              <button
                type="button" onClick={() => setIdx(i)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-secondary/10 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift active:scale-[0.97]"
                aria-label={`Open photo: ${g.caption}`}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 1024px) 50vw, 33vw" loading="lazy" className="object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-secondary/85 to-transparent p-3 pt-10 text-left text-xs font-semibold text-white sm:text-sm">
                  {g.caption} <Expand size={16} className="shrink-0 opacity-0 transition group-hover:opacity-100" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {idx !== null && (
            <m.div
              role="dialog" aria-modal="true" aria-label="Gallery viewer"
              className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/90 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIdx(null)}
            >
              <button className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white" onClick={() => setIdx(null)} aria-label="Close"><X /></button>
              <button className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous"><ChevronLeft /></button>
              <button className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next"><ChevronRight /></button>
              <m.figure
                key={idx} className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.4}
                onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white">
                  <Image src={c.gallery[idx].src} alt={c.gallery[idx].alt} fill sizes="(max-width: 768px) 92vw, 768px" className="object-cover" draggable={false} />
                </div>
                <figcaption className="mt-3 text-center font-semibold text-white">{c.gallery[idx].caption} <span className="opacity-60">· {idx + 1}/{n}</span></figcaption>
              </m.figure>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </section>
  );
}
