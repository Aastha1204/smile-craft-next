import { ArrowRight } from "lucide-react";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { PickService } from "./PickService";
import type { SiteConfig } from "@/lib/theme";

export function Services({ c }: { c: SiteConfig }) {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{c.ui.servicesEyebrow}</span>
          <h2 className="h2">{c.ui.servicesTitle}</h2>
          <p className="mt-3 text-ink/70">{c.ui.servicesSubtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 90}>
              <PickService id={s.id} className="group card relative flex h-full w-full flex-col overflow-hidden p-6 text-left transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lift active:scale-[0.98]">
                <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-150" />
                <span className="icon-wobble relative grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white shadow-soft">
                  <Icon name={s.icon} size={28} />
                </span>
                <span className="relative mt-5 font-heading text-xl font-bold text-secondary">{s.title}</span>
                <span className="relative mt-2 flex-1 text-[15px] leading-relaxed text-ink/70">{s.description}</span>
                <span className="relative mt-5 flex items-center justify-between border-t border-secondary/10 pt-4">
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink/50">Starting at</span>
                    <span className="font-heading text-lg font-bold text-primary">{s.priceFrom}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-secondary transition group-hover:gap-2.5">
                    {c.ui.serviceCardCta} <ArrowRight size={16} />
                  </span>
                </span>
              </PickService>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
