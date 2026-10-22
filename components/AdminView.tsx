"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { isLive, listAll, setStatus, subscribe, type Booking } from "@/lib/bookings";
import { fmtTime, prettyDate } from "@/lib/hours";
import { waLink, withTheme, type SiteConfig } from "@/lib/theme";

const chip: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export function AdminView({ c }: { c: SiteConfig }) {
  const [rows, setRows] = useState<Booking[] | null>(null);
  const seen = useRef<Set<string> | null>(null);

  const load = useCallback(async () => {
    const data = await listAll(c.slug);
    data.sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
    if (seen.current) {
      data.filter((r) => !seen.current!.has(r.id)).forEach((r) => toast.success(`New booking: ${r.name} · ${prettyDate(r.date)} ${fmtTime(r.slot)}`));
    }
    seen.current = new Set(data.map((r) => r.id));
    setRows(data);
  }, [c.slug]);

  useEffect(() => {
    load();
    return subscribe(c.slug, load);
  }, [c.slug, load]);

  const act = async (id: string, status: Booking["status"]) => {
    try {
      await setStatus(id, status);
      toast.success(status === "confirmed" ? "Booking confirmed" : "Booking cancelled");
      load();
    } catch {
      toast.error("Could not update the booking");
    }
  };

  const active = rows?.filter((r) => r.status !== "cancelled") ?? [];

  return (
    <main className="container-x max-w-3xl py-8">
      <Link href={withTheme(c, "/")} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to website</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-secondary">Bookings</h1>
          <p className="text-ink/65">{c.businessName}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${isLive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
          <span className={`h-2 w-2 animate-pulse rounded-full ${isLive ? "bg-emerald-500" : "bg-amber-500"}`} />
          {isLive ? "Live · Supabase realtime" : "Demo mode · this browser only"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[["Active", active.length], ["Pending", rows?.filter((r) => r.status === "pending").length ?? 0], ["Confirmed", rows?.filter((r) => r.status === "confirmed").length ?? 0]].map(([l, n]) => (
          <div key={l as string} className="card p-4"><div className="font-heading text-3xl font-bold text-primary">{n}</div><div className="text-xs font-semibold text-ink/60">{l}</div></div>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {rows === null && <li className="card h-24 animate-pulse" />}
        {rows?.length === 0 && (
          <li className="card p-8 text-center text-ink/65">No bookings yet. Make one on the website — it will appear here instantly.</li>
        )}
        {rows?.map((r) => (
          <li key={r.id} className={`card p-4 ${r.status === "cancelled" ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-heading text-lg font-bold text-secondary">{r.name}</p>
                <p className="text-sm text-ink/70">{r.service}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${chip[r.status]}`}>{r.status}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-primary">{prettyDate(r.date)} · {fmtTime(r.slot)}</p>
            {r.notes && <p className="mt-1 text-sm text-ink/65">“{r.notes}”</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:+91${r.phone}`} className="btn btn-ghost !min-h-[42px] !px-4 !py-2 text-sm"><Phone size={16} /> {r.phone}</a>
              <a href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(`Hi ${r.name}, this is ${c.businessName}. Your ${r.service} on ${prettyDate(r.date)} at ${fmtTime(r.slot)} is confirmed.`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-[42px] !px-4 !py-2 text-sm"><MessageCircle size={16} /> Reply</a>
              {r.status !== "confirmed" && r.status !== "cancelled" && <button onClick={() => act(r.id, "confirmed")} className="btn btn-primary !min-h-[42px] !px-4 !py-2 text-sm"><Check size={16} /> Confirm</button>}
              {r.status !== "cancelled" && <button onClick={() => act(r.id, "cancelled")} className="btn btn-ghost !min-h-[42px] !px-4 !py-2 text-sm !text-red-700"><X size={16} /> Cancel</button>}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-xs text-ink/50">Demo — sample data · <a className="underline" href={waLink(c)}>WhatsApp {c.phone}</a></p>
    </main>
  );
}
