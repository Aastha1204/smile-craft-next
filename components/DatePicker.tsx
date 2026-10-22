"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { weekdayOf } from "@/lib/hours";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  todayKey: string;
  maxKey: string;
  value: string;
  isOpen: (key: string) => boolean;
  onChange: (key: string) => void;
};

/** Month calendar (Mon–Sun). Days outside [today, max] or when the business is closed are disabled. */
export function DatePicker({ todayKey, maxKey, value, isOpen, onChange }: Props) {
  const start = value || todayKey;
  const [view, setView] = useState({ y: +start.slice(0, 4), m: +start.slice(5, 7) });

  const first = `${view.y}-${pad(view.m)}-01`;
  const daysInMonth = new Date(Date.UTC(view.y, view.m, 0)).getUTCDate();
  const offset = (weekdayOf(first) + 6) % 7;
  const minView = +todayKey.slice(0, 4) * 12 + +todayKey.slice(5, 7);
  const maxView = +maxKey.slice(0, 4) * 12 + +maxKey.slice(5, 7);
  const cur = view.y * 12 + view.m;

  const move = (d: number) =>
    setView(({ y, m }) => {
      const t = y * 12 + (m - 1) + d;
      return { y: Math.floor(t / 12), m: (t % 12) + 1 };
    });

  const title = new Date(Date.UTC(view.y, view.m - 1, 1)).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
  const arrow = "grid h-11 w-11 place-items-center rounded-full border-2 border-secondary/15 text-secondary transition active:scale-90 enabled:hover:border-primary enabled:hover:text-primary disabled:opacity-30";

  return (
    <div className="rounded-2xl border-2 border-secondary/10 bg-paper/60 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" className={arrow} onClick={() => move(-1)} disabled={cur <= minView} aria-label="Previous month"><ChevronLeft size={20} /></button>
        <p className="font-heading text-lg font-bold text-secondary" aria-live="polite">{title}</p>
        <button type="button" className={arrow} onClick={() => move(1)} disabled={cur >= maxView} aria-label="Next month"><ChevronRight size={20} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-ink/50 sm:gap-1.5">
        {WEEK.map((w) => <span key={w} className="py-1">{w}</span>)}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5" role="radiogroup" aria-label="Choose a day">
        {Array.from({ length: offset }, (_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const key = `${view.y}-${pad(view.m)}-${pad(day)}`;
          const inWindow = key >= todayKey && key <= maxKey;
          const open = inWindow && isOpen(key);
          const on = key === value;
          const isToday = key === todayKey;
          return (
            <button
              key={key} type="button" role="radio" aria-checked={on} disabled={!open}
              aria-label={`${day} ${title}${isToday ? ", today" : ""}${inWindow && !open ? ", unavailable" : ""}`}
              onClick={() => onChange(key)}
              className={`relative grid aspect-square min-h-[40px] place-items-center rounded-xl text-sm font-semibold transition active:scale-90 ${
                on ? "bg-primary text-white shadow-soft" : open ? "bg-white text-secondary hover:bg-primary/10 hover:text-primary" : "text-ink/25"
              } ${!open ? "cursor-not-allowed" : ""} ${!open && inWindow ? "line-through decoration-ink/20" : ""}`}
            >
              {day}
              {isToday && <span aria-hidden className={`absolute bottom-1 h-1 w-1 rounded-full ${on ? "bg-white" : "bg-accent"}`} />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/55">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-white ring-1 ring-secondary/20" /> Available</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Today</span>
        <span className="inline-flex items-center gap-1.5 line-through">Closed</span>
      </p>
    </div>
  );
}
