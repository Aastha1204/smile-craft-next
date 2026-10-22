import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Booking } from "@/components/Booking";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { ClientToaster } from "@/components/ClientToaster";
import { fontSetup } from "@/lib/fonts";
import { getTheme, themeCssVars, type SiteConfig } from "@/lib/theme";

type Props = { searchParams: { theme?: string | string[] } };

export function generateMetadata({ searchParams }: Props): Metadata {
  const c = getTheme(searchParams.theme);
  return {
    title: c.seo.title,
    description: c.seo.description,
    keywords: c.seo.keywords,
    openGraph: { title: c.seo.title, description: c.seo.description, images: [c.seo.ogImage], type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title: c.seo.title, description: c.seo.description, images: [c.seo.ogImage] },
    robots: { index: false, follow: false }, // demo site – flip to true for a real client
  };
}

export function generateViewport({ searchParams }: Props): Viewport {
  return { themeColor: getTheme(searchParams.theme).colors.primary, width: "device-width", initialScale: 1 };
}

function jsonLd(c: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": c.schemaType,
        name: c.businessName,
        description: c.seo.description,
        telephone: c.phone,
        email: c.email,
        address: { "@type": "PostalAddress", streetAddress: c.address, addressLocality: "Mumbai", addressRegion: "MH", postalCode: "400001", addressCountry: "IN" },
        openingHoursSpecification: c.hours
          .filter((h) => h.open !== "closed")
          .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: h.open, closes: h.close })),
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

export default function Page({ searchParams }: Props) {
  const c = getTheme(searchParams.theme);
  const font = fontSetup(c.font);
  const style = { ...themeCssVars(c), ...font.vars, background: `rgb(${themeCssVars(c)["--c-bg"]})` } as React.CSSProperties;

  return (
    <div className={`${font.className} min-h-screen bg-paper font-body text-ink`} style={style} data-theme={c.slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(c)) }} />
      <Header c={c} />
      <main>
        <Hero c={c} />
        <Services c={c} />
        <About c={c} />
        <Gallery c={c} />
        <Testimonials c={c} />
        <Faq c={c} />
        <Booking c={c} />
        <Contact c={c} />
      </main>
      <Footer c={c} />
      <FloatingActions c={c} />
      <ClientToaster />
    </div>
  );
}
