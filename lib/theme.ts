import dental from "@/config/client.json";
import coaching from "@/config/themes/coaching.json";
import property from "@/config/themes/property.json";

export type Hour = { day: string; open: string; close: string };

export type SiteConfig = {
  slug: string;
  businessName: string;
  tagline: string;
  subline: string;
  industry: string;
  schemaType: string;
  colors: { primary: string; secondary: string; accent: string; bg: string; text: string };
  font: { heading: string; body: string };
  logoText: string;
  logoIcon: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
  mapEmbedQuery: string;
  slotMinutes: number;
  hours: Hour[];
  areasServed: string[];
  trustChips: { label: string; value: string }[];
  services: { id: string; title: string; description: string; icon: string; priceFrom: string }[];
  about: { name: string; title: string; qualifications: string[]; bio: string; image: string };
  gallery: { src: string; alt: string; caption: string }[];
  testimonials: { name: string; area: string; rating: number; text: string }[];
  faqs: { q: string; a: string }[];
  ui: Record<string, string>;
  seo: { title: string; description: string; ogImage: string; keywords: string[] };
  illustration: "dental" | "coaching" | "property";
};

const themes: Record<string, SiteConfig> = {
  dental: dental as SiteConfig,
  coaching: coaching as SiteConfig,
  property: property as SiteConfig,
};

export const themeSlugs = Object.keys(themes);

export function getTheme(name?: string | string[] | null): SiteConfig {
  const key = Array.isArray(name) ? name[0] : name;
  const cfg = (key && themes[key]) || themes.dental;
  // One WhatsApp number for every demo theme (set NEXT_PUBLIC_DEMO_WHATSAPP to override, digits only with country code).
  const wa = (process.env.NEXT_PUBLIC_DEMO_WHATSAPP || "").replace(/\D/g, "");
  return wa ? { ...cfg, whatsapp: wa } : cfg;
}

function hexToTriplet(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** CSS custom properties consumed by the Tailwind palette in tailwind.config.ts */
export function themeCssVars(c: SiteConfig): Record<string, string> {
  return {
    "--c-primary": hexToTriplet(c.colors.primary),
    "--c-secondary": hexToTriplet(c.colors.secondary),
    "--c-accent": hexToTriplet(c.colors.accent),
    "--c-bg": hexToTriplet(c.colors.bg),
    "--c-text": hexToTriplet(c.colors.text),
  };
}

export function waLink(c: SiteConfig, text?: string): string {
  return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(text ?? c.whatsappMessage)}`;
}

export function telLink(c: SiteConfig): string {
  return `tel:${c.phone.replace(/[^+\d]/g, "")}`;
}

export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Preserve ?theme= on internal links */
export function withTheme(c: SiteConfig, path: string): string {
  return c.slug === "dental" ? path : `${path}?theme=${c.slug}`;
}
