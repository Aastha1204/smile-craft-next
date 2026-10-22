import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import type { SiteConfig } from "@/lib/theme";

export function About({ c }: { c: SiteConfig }) {
  const a = c.about;
  return (
    <section id="about" className="section bg-white">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div aria-hidden className="a-blob absolute -inset-4 bg-accent/25" />
            <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white shadow-lift">
              <Image src={a.image} alt={`Stock portrait representing ${a.name} (sample)`} width={800} height={960} sizes="(max-width: 1024px) 80vw, 380px" className="h-auto w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white shadow-lift">
              {a.name} · {a.title}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <span className="eyebrow">{c.ui.aboutEyebrow}</span>
          <h2 className="h2">{a.name}</h2>
          <p className="mt-1 font-semibold text-primary">{a.title}</p>
          <p className="mt-5 text-lg leading-relaxed text-ink/75">{a.bio}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {a.qualifications.map((q) => (
              <li key={q} className="flex items-start gap-2.5 rounded-2xl bg-paper px-4 py-3 text-[15px] font-medium text-secondary">
                <BadgeCheck size={20} className="mt-0.5 shrink-0 text-primary" /> {q}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
