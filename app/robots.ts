import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/theme";

export default function robots(): MetadataRoute.Robots {
  // Demo site: keep it out of search results. Change to allow: "/" for a real client.
  return { rules: { userAgent: "*", disallow: "/" }, sitemap: `${siteUrl()}/sitemap.xml` };
}
