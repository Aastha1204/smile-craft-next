import Image from "next/image";
import { MapPin, MessageCircle } from "lucide-react";
import { Illustration } from "./Illustration";
import { waLink, type SiteConfig } from "@/lib/theme";

export function Hero({ c }: { c: SiteConfig }) {
  return (
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-28">
      <div aria-hidden className="a-blob absolute -right-24 -top-24 h-[420px] w-[420px] bg-primary/10" />
      <div aria-hidden className="a-blob absolute -left-32 top-1/2 h-[320px] w-[320px] bg-accent/15" style={{ animationDelay: "-5s" }} />

      <div className="container-x relative grid items-center gap-8 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-20">
        <div>
          <span className="rise eyebrow" style={{ "--d": "0ms" } as React.CSSProperties}>
            <MapPin size={14} /> Fort, Mumbai · {c.industry}
          </span>
          <h1 className="rise font-heading text-4xl font-bold leading-[1.1] text-secondary sm:text-5xl lg:text-6xl" style={{ "--d": "80ms" } as React.CSSProperties}>
            {c.tagline}
          </h1>
          <p className="rise mt-5 max-w-xl text-lg leading-relaxed text-ink/75" style={{ "--d": "160ms" } as React.CSSProperties}>
            {c.subline}
          </p>
          <div className="rise mt-7 flex flex-col gap-3 sm:flex-row" style={{ "--d": "240ms" } as React.CSSProperties}>
            <a href="#book" className="btn btn-primary text-lg">{c.ui.bookCta}</a>
            <a href={waLink(c)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-lg">
              <MessageCircle size={20} className="text-[#128C7E]" /> Chat on WhatsApp
            </a>
          </div>

          <dl className="rise mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ "--d": "320ms" } as React.CSSProperties}>
            {c.trustChips.map((t) => (
              <div key={t.label} className="card px-4 py-3 transition duration-200 hover:-translate-y-1 hover:shadow-lift active:scale-[0.97]">
                <dd className="font-heading text-xl font-bold text-primary">{t.value}</dd>
                <dt className="text-xs font-medium text-ink/65">{t.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="rise mx-auto aspect-square w-full max-w-[440px] lg:max-w-none" style={{ "--d": "200ms" } as React.CSSProperties}>
          <div className="relative h-full w-full">
            <Illustration kind={c.illustration} />
            <figure className="a-float-r absolute -bottom-2 -left-1 w-[44%] overflow-hidden rounded-3xl border-4 border-white shadow-lift sm:-left-4" style={{ "--r": "-4deg" } as React.CSSProperties}>
              <div className="relative aspect-[4/3]">
                <Image src={c.gallery[1].src} alt={c.gallery[1].alt} fill priority sizes="(max-width: 640px) 40vw, 200px" className="object-cover" />
              </div>
            </figure>
          </div>
        </div>
      </div>

      <div className="relative border-y border-secondary/10 bg-secondary py-3 text-white" aria-label="Areas we serve">
        <div className="overflow-hidden">
          <div className="marquee-track flex gap-8 whitespace-nowrap text-sm font-semibold">
            {[...c.areasServed, ...c.areasServed, ...c.areasServed, ...c.areasServed].map((a, i) => (
              <span key={i} className="flex items-center gap-8" aria-hidden={i >= c.areasServed.length}>
                {a} <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
