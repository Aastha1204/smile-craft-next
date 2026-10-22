import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "./Reveal";
import { HoursCard } from "./HoursCard";
import { telLink, waLink, type SiteConfig } from "@/lib/theme";

export function Contact({ c }: { c: SiteConfig }) {
  const rows = [
    { icon: MapPin, label: "Address", value: c.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapEmbedQuery)}` },
    { icon: Phone, label: "Call", value: c.phone, href: telLink(c) },
    { icon: MessageCircle, label: "WhatsApp", value: "Message us", href: waLink(c) },
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
  ];
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><Clock size={14} /> Visit us</span>
          <h2 className="h2">{c.ui.contactTitle}</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="grid gap-3">
              {rows.map(({ icon: I, label, value, href }) => (
                <a
                  key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="card flex items-center gap-4 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift active:scale-[0.98]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><I size={22} /></span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</span>
                    <span className="block break-words font-semibold text-secondary">{value}</span>
                  </span>
                </a>
              ))}
              <HoursCard hours={c.hours} />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card h-full min-h-[360px] overflow-hidden">
              <iframe
                title={`Map showing ${c.businessName}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapEmbedQuery)}&output=embed`}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-[360px] w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
