"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import type { SiteConfig } from "@/lib/theme";

export function Faq({ c }: { c: SiteConfig }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section">
      <div className="container-x max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">{c.ui.faqEyebrow}</span>
          <h2 className="h2">{c.ui.faqTitle}</h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {c.faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <div className={`card overflow-hidden transition-colors ${isOpen ? "border-primary/40" : ""}`}>
                  <h3>
                    <button
                      type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-btn-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-lg font-semibold text-secondary active:bg-primary/5"
                    >
                      {f.q}
                      <ChevronDown size={22} className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </h3>
                  <div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 leading-relaxed text-ink/75">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
