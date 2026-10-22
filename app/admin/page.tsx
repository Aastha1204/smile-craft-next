import type { Metadata } from "next";
import { AdminView } from "@/components/AdminView";
import { ClientToaster } from "@/components/ClientToaster";
import { fontSetup } from "@/lib/fonts";
import { getTheme, themeCssVars } from "@/lib/theme";

export const metadata: Metadata = { title: "Owner view — bookings", robots: { index: false, follow: false } };

export default function AdminPage({ searchParams }: { searchParams: { theme?: string | string[] } }) {
  const c = getTheme(searchParams.theme);
  const font = fontSetup(c.font);
  const vars = themeCssVars(c);
  return (
    <div className={`${font.className} min-h-screen bg-paper font-body text-ink`} style={{ ...vars, ...font.vars } as React.CSSProperties}>
      <AdminView c={c} />
      <ClientToaster />
    </div>
  );
}
