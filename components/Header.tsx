"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { Icon } from "./Icon";
import type { SiteConfig } from "@/lib/theme";
import { telLink, themeSlugs } from "@/lib/theme";

const links = [
  ["Services", "#services"],
  ["About", "#about"],
  ["Gallery", "#gallery"],
  ["Reviews", "#reviews"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
] as const;

export function Header({ c }: { c: SiteConfig }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const taps = useRef({ n: 0, t: 0 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Hidden presenter shortcut: tap the logo 5 times quickly to cycle demo themes.
  const onLogo = () => {
    const now = Date.now();
    taps.current = now - taps.current.t < 1200 ? { n: taps.current.n + 1, t: now } : { n: 1, t: now };
    if (taps.current.n >= 5) {
      const next = themeSlugs[(themeSlugs.indexOf(c.slug) + 1) % themeSlugs.length];
      window.location.href = next === "dental" ? "/" : `/?theme=${next}`;
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-paper/85 shadow-soft backdrop-blur-lg" : "bg-transparent"}`}>
        <div className="container-x flex h-16 items-center justify-between">
          <a href="#top" onClick={onLogo} className="group flex items-center gap-2.5" aria-label={`${c.businessName} home`}>
            <span className="icon-wobble grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-soft">
              <Icon name={c.logoIcon} size={22} />
            </span>
            <span className="whitespace-nowrap font-heading text-xl font-bold text-secondary">{c.logoText}</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink/75 transition hover:bg-primary/10 hover:text-primary">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={telLink(c)} className="btn btn-ghost !min-h-[44px] !px-4 !py-2 text-sm max-sm:hidden" aria-label={c.ui.callCta}>
              <Phone size={16} /> {c.phone}
            </a>
            <a href="#book" className="btn btn-primary !min-h-[44px] !px-4 !py-2 text-sm max-sm:hidden">{c.ui.bookCta}</a>
            <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-white text-secondary shadow-soft lg:hidden" aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-secondary/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <m.nav
              aria-label="Mobile"
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-paper p-6 shadow-lift"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <button onClick={() => setOpen(false)} className="mb-4 ml-auto grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft" aria-label="Close menu">
                <X size={22} />
              </button>
              {links.map(([label, href], i) => (
                <m.a
                  key={href} href={href} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}
                  className="border-b border-secondary/10 py-4 font-heading text-2xl font-semibold text-secondary"
                >
                  {label}
                </m.a>
              ))}
              <a href={telLink(c)} className="btn btn-ghost mt-auto"><Phone size={18} /> {c.phone}</a>
              <a href="#book" onClick={() => setOpen(false)} className="btn btn-primary mt-3">{c.ui.bookCta}</a>
            </m.nav>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
