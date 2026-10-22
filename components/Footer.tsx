import Link from "next/link";
import { Icon } from "./Icon";
import { telLink, withTheme, type SiteConfig } from "@/lib/theme";

export function Footer({ c }: { c: SiteConfig }) {
  return (
    <footer className="bg-secondary pb-28 pt-12 text-white/80 md:pb-10">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white"><Icon name={c.logoIcon} size={22} /></span>
              <span className="font-heading text-xl font-bold text-white">{c.businessName}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{c.address}</p>
            <a href={telLink(c)} className="mt-2 inline-block text-sm font-semibold text-accent">{c.phone}</a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm font-medium">
            {[["Services", "#services"], ["About", "#about"], ["Gallery", "#gallery"], ["Reviews", "#reviews"], ["FAQ", "#faq"], ["Book", "#book"]].map(([l, h]) => (
              <a key={h} href={h} className="hover:text-accent">{l}</a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 border-t border-white/15 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span className="rounded-full bg-accent px-3 py-1 font-bold text-secondary">Demo — sample data</span>
          <span>© {new Date().getFullYear()} {c.businessName} (fictional). All names, prices and reviews are sample content. Photos: Unsplash.</span>
          <Link href={withTheme(c, "/admin")} className="font-semibold underline underline-offset-4 hover:text-accent">Owner view</Link>
        </div>
      </div>
    </footer>
  );
}
