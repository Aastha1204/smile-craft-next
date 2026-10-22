"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { fmtTime, hoursForWeekday, isClosed, nowInIST, toMinutes } from "@/lib/hours";
import type { Hour } from "@/lib/theme";

const DAY_IDX: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

export function HoursCard({ hours }: { hours: Hour[] }) {
  const [state, setState] = useState<{ today: number; open: boolean; label: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = nowInIST();
      const h = hoursForWeekday(hours, t.weekday);
      const open = !isClosed(h) && t.minutes >= toMinutes(h!.open) && t.minutes < toMinutes(h!.close);
      setState({
        today: t.weekday,
        open,
        label: open ? `Open now · closes ${fmtTime(h!.close)}` : isClosed(h) ? "Closed today" : t.minutes < toMinutes(h!.open) ? `Opens today at ${fmtTime(h!.open)}` : "Closed for today",
      });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [hours]);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-secondary"><Clock size={18} className="text-primary" /> Opening hours</h3>
        {state && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${state.open ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
            <span className={`h-2 w-2 rounded-full ${state.open ? "animate-pulse bg-emerald-500" : "bg-red-500"}`} /> {state.label}
          </span>
        )}
      </div>
      <ul className="divide-y divide-secondary/10 text-sm">
        {hours.map((h) => (
          <li key={h.day} className={`flex justify-between py-2 ${state?.today === DAY_IDX[h.day] ? "font-bold text-primary" : "text-ink/75"}`}>
            <span>{h.day}</span>
            <span>{isClosed(h) ? "Closed" : `${fmtTime(h.open)} – ${fmtTime(h.close)}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
