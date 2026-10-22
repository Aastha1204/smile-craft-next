import { ImageResponse } from "next/og";
import { getTheme } from "@/lib/theme";

export const runtime = "edge";

export async function GET(req: Request) {
  const c = getTheme(new URL(req.url).searchParams.get("theme"));
  const { primary, secondary, accent, bg } = c.colors;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, background: `linear-gradient(135deg, ${secondary}, ${primary})`, color: "white" }}>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: accent, letterSpacing: 4, textTransform: "uppercase" }}>Fort, Mumbai · {c.industry}</div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, marginTop: 20, lineHeight: 1.05 }}>{c.businessName}</div>
        <div style={{ display: "flex", fontSize: 38, marginTop: 24, color: bg, opacity: 0.9 }}>{c.tagline}</div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 24, background: accent, color: secondary, padding: "10px 26px", borderRadius: 999, fontWeight: 700, alignSelf: "flex-start" }}>Demo — sample data</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
