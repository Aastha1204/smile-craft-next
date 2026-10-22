import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import type { SiteConfig } from "@/lib/theme";

export function Testimonials({ c }: { c: SiteConfig }) {
  return (
    <section id="reviews" className="section bg-secondary text-white">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow !bg-white/10 !text-accent">{c.ui.reviewsEyebrow}</span>
          <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{c.ui.reviewsTitle}</h2>
        </Reveal>

        <div className="lite-scroll -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {c.testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} className="w-[86%] shrink-0 snap-center md:w-auto">
              <figure className="relative flex h-full flex-col rounded-3xl bg-white p-6 text-ink shadow-lift transition duration-300 hover:-translate-y-1.5">
                <Quote aria-hidden size={36} className="absolute right-5 top-5 text-primary/15" />
                <div className="flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={18} className={s < t.rating ? "fill-accent text-accent" : "text-ink/20"} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/80">“{t.text}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-secondary/10 pt-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary font-heading text-lg font-bold text-white">{t.name[0]}</span>
                  <span>
                    <span className="block font-semibold text-secondary">{t.name}</span>
                    <span className="text-xs text-ink/55">{t.area} · sample review</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
