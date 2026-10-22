import { Fraunces, DM_Sans, Poppins, Inter, Playfair_Display, Manrope } from "next/font/google";

// Only the active theme's fonts are applied; the others are not preloaded.
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", variable: "--f-fraunces" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--f-dm-sans" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap", variable: "--f-poppins", preload: false });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--f-inter", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--f-playfair", preload: false });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--f-manrope", preload: false });

const registry: Record<string, { variable: string; cssVar: string }> = {
  Fraunces: { variable: fraunces.variable, cssVar: "--f-fraunces" },
  "DM Sans": { variable: dmSans.variable, cssVar: "--f-dm-sans" },
  Poppins: { variable: poppins.variable, cssVar: "--f-poppins" },
  Inter: { variable: inter.variable, cssVar: "--f-inter" },
  "Playfair Display": { variable: playfair.variable, cssVar: "--f-playfair" },
  Manrope: { variable: manrope.variable, cssVar: "--f-manrope" },
};

export function fontSetup(font: { heading: string; body: string }) {
  const h = registry[font.heading] ?? registry.Fraunces;
  const b = registry[font.body] ?? registry["DM Sans"];
  return {
    className: `${h.variable} ${b.variable}`,
    vars: { "--font-heading": `var(${h.cssVar})`, "--font-body": `var(${b.cssVar})` } as Record<string, string>,
  };
}
