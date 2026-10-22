"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { CalendarPlus, Check, Loader2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { DatePicker } from "./DatePicker";
import { PREFILL_EVENT } from "./PickService";
import { SlotTakenError, createBooking, isLive, listBooked, subscribe, type Booking as BookingRow } from "@/lib/bookings";
import { addDays, buildSlots, fmtTime, hoursForWeekday, isClosed, nowInIST, prettyDate, toMinutes, weekdayOf } from "@/lib/hours";
import { waLink, type SiteConfig } from "@/lib/theme";

const DAYS_AHEAD = 30;

function cleanPhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

function icsFor(c: SiteConfig, b: { date: string; slot: string; service: string }): string {
  const [y, mo, d] = b.date.split("-").map(Number);
  const [hh, mm] = b.slot.split(":").map(Number);
  const fmt = (offsetMin: number) =>
    new Date(Date.UTC(y, mo - 1, d, hh, mm) - 330 * 60000 + offsetMin * 60000).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Demo//Booking//EN", "BEGIN:VEVENT",
    `UID:${Date.now()}@demo`, `DTSTAMP:${fmt(330)}`, `DTSTART:${fmt(0)}`, `DTEND:${fmt(c.slotMinutes)}`,
    `SUMMARY:${b.service} — ${c.businessName}`, `LOCATION:${c.address.replace(/,/g, "\\,")}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export function Booking({ c }: { c: SiteConfig }) {
  const [now, setNow] = useState<{ dateKey: string; minutes: number } | null>(null);
  const [serviceId, setServiceId] = useState("");
  const [dayKey, setDayKey] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<BookingRow | null>(null);

  // Read the clock in Mumbai time once mounted (avoids server/client mismatch).
  useEffect(() => {
    const t = nowInIST();
    setNow({ dateKey: t.dateKey, minutes: t.minutes });
  }, []);

  const dayOpen = useCallback(
    (key: string) => {
      const h = hoursForWeekday(c.hours, weekdayOf(key));
      if (isClosed(h)) return false;
      if (now && key === now.dateKey) return buildSlots(h, c.slotMinutes).some((s) => toMinutes(s) > now.minutes + 30);
      return true;
    },
    [c.hours, c.slotMinutes, now],
  );

  // Pre-select the first available day.
  useEffect(() => {
    if (!now || dayKey) return;
    for (let i = 0; i <= DAYS_AHEAD; i++) {
      const k = addDays(now.dateKey, i);
      if (dayOpen(k)) { setDayKey(k); break; }
    }
  }, [now, dayKey, dayOpen]);

  useEffect(() => {
    const on = (e: Event) => {
      setServiceId((e as CustomEvent<string>).detail);
      setErrors((x) => ({ ...x, service: "" }));
    };
    window.addEventListener(PREFILL_EVENT, on);
    return () => window.removeEventListener(PREFILL_EVENT, on);
  }, []);

  const refreshBooked = useCallback(() => {
    if (dayKey) listBooked(c.slug, dayKey).then(setBooked).catch(() => setBooked([]));
  }, [c.slug, dayKey]);

  useEffect(() => {
    refreshBooked();
    return subscribe(c.slug, refreshBooked);
  }, [c.slug, refreshBooked]);

  const slots = useMemo(() => {
    if (!dayKey) return [];
    const all = buildSlots(hoursForWeekday(c.hours, weekdayOf(dayKey)), c.slotMinutes);
    return now && dayKey === now.dateKey ? all.filter((s) => toMinutes(s) > now.minutes + 30) : all;
  }, [dayKey, c.hours, c.slotMinutes, now]);

  const service = c.services.find((s) => s.id === serviceId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!service) errs.service = `Please choose a ${c.ui.serviceField.toLowerCase()}`;
    if (!dayKey || !slot) errs.slot = "Please pick a day and a time";
    if (name.trim().length < 2) errs.name = "Please enter your name";
    const p = cleanPhone(phone);
    if (!p) errs.phone = "Enter a valid 10-digit mobile number";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error(Object.values(errs)[0]);
      document.querySelector("[data-err='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    try {
      const row = await createBooking({ theme: c.slug, name: name.trim(), phone: p!, service: service!.title, date: dayKey, slot, notes: notes.trim() || null });
      setDone(row);
      toast.success(c.ui.successTitle);
    } catch (err) {
      if (err instanceof SlotTakenError) {
        toast.error("That slot was just taken — please pick another time.");
        setSlot("");
        refreshBooked();
      } else {
        toast.error("Could not save the booking. Please try again or message us on WhatsApp.");
      }
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setDone(null); setSlot(""); setNotes(""); setServiceId(""); setErrors({});
    refreshBooked();
  };

  const downloadIcs = () => {
    if (!done) return;
    const blob = new Blob([icsFor(c, done)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "appointment.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const stepTitle = "mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-secondary";
  const stepNo = "grid h-7 w-7 place-items-center rounded-full bg-primary text-sm font-bold text-white";

  return (
    <section id="book" className="section relative overflow-hidden bg-white">
      <div aria-hidden className="a-blob absolute -left-24 top-10 h-72 w-72 bg-primary/10" />
      <div className="container-x relative max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">{c.ui.bookEyebrow}</span>
          <h2 className="h2">{c.ui.bookTitle}</h2>
          <p className="mt-3 text-ink/70">{c.ui.bookSubtitle}</p>
          {!isLive && <p className="mx-auto mt-3 w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-secondary">Demo mode · bookings are saved in this browser</p>}
        </Reveal>

        <LazyMotion features={domAnimation}>
          <div className="card mt-10 p-5 sm:p-8">
              {done ? (
                <m.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center" role="status">
                  <div className="a-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-white shadow-lift"><Check size={42} strokeWidth={3} /></div>
                  <h3 className="mt-5 font-heading text-2xl font-bold text-secondary">{c.ui.successTitle}</h3>
                  <p className="mt-2 text-ink/70">Thank you, {done.name.split(" ")[0]}. We will confirm on WhatsApp shortly.</p>
                  <dl className="mx-auto mt-6 max-w-sm divide-y divide-secondary/10 rounded-2xl bg-paper text-left text-sm">
                    {[[c.ui.serviceField, done.service], ["When", `${prettyDate(done.date)} · ${fmtTime(done.slot)}`], ["Where", c.businessName], ["Phone", `+91 ${done.phone}`]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 px-4 py-3"><dt className="text-ink/55">{k}</dt><dd className="text-right font-semibold text-secondary">{v}</dd></div>
                    ))}
                  </dl>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <a className="btn btn-primary" target="_blank" rel="noopener noreferrer"
                      href={waLink(c, `Hi ${c.businessName}! I've requested ${done.service} on ${prettyDate(done.date)} at ${fmtTime(done.slot)}. Name: ${done.name}. Please confirm.`)}>
                      <MessageCircle size={18} /> Confirm on WhatsApp
                    </a>
                    <button className="btn btn-ghost" onClick={downloadIcs}><CalendarPlus size={18} /> Add to calendar</button>
                  </div>
                  <button onClick={reset} className="mt-5 text-sm font-semibold text-primary underline underline-offset-4">Book another</button>
                </m.div>
              ) : (
                <m.form key="form" onSubmit={submit} noValidate className="min-w-0 space-y-8">
                  <fieldset data-err={!!errors.service} className="min-w-0">
                    <legend className={stepTitle}><span className={stepNo}>1</span> {c.ui.serviceField}</legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {c.services.map((s) => (
                        <button
                          key={s.id} type="button" aria-pressed={serviceId === s.id}
                          onClick={() => { setServiceId(s.id); setErrors((x) => ({ ...x, service: "" })); }}
                          className={`min-h-[52px] rounded-2xl border-2 px-3 py-2 text-left text-sm font-semibold transition active:scale-95 ${serviceId === s.id ? "border-primary bg-primary text-white shadow-soft" : "border-secondary/15 bg-white text-secondary hover:border-primary/60"}`}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                    {errors.service && <p className="mt-2 text-sm font-medium text-red-600">{errors.service}</p>}
                  </fieldset>

                  <fieldset data-err={!!errors.slot} className="min-w-0">
                    <legend className={stepTitle}><span className={stepNo}>2</span> Day &amp; time</legend>
                    {!now ? (
                      <div className="h-[330px] animate-pulse rounded-2xl bg-secondary/5" />
                    ) : (
                      <DatePicker todayKey={now.dateKey} maxKey={addDays(now.dateKey, DAYS_AHEAD)} value={dayKey} isOpen={dayOpen} onChange={(k) => { setDayKey(k); setSlot(""); }} />
                    )}
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Choose a time">
                      {slots.map((s) => {
                        const taken = booked.includes(s);
                        return (
                          <button
                            key={s} type="button" role="radio" aria-checked={slot === s} disabled={taken}
                            onClick={() => { setSlot(s); setErrors((x) => ({ ...x, slot: "" })); }}
                            className={`min-h-[48px] rounded-xl border-2 px-2 text-sm font-semibold transition active:scale-95 ${slot === s ? "border-accent bg-accent text-secondary shadow-soft" : "border-secondary/15 bg-white text-secondary hover:border-primary/60"} disabled:cursor-not-allowed disabled:bg-secondary/5 disabled:text-ink/35 disabled:line-through`}
                          >
                            {fmtTime(s)}
                          </button>
                        );
                      })}
                    </div>
                    {now && slots.length === 0 && <p className="mt-3 text-sm text-ink/60">No slots left on this day — please choose another.</p>}
                    {errors.slot && <p className="mt-2 text-sm font-medium text-red-600">{errors.slot}</p>}
                  </fieldset>

                  <fieldset className="min-w-0">
                    <legend className={stepTitle}><span className={stepNo}>3</span> Your details</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-secondary">Full name</span>
                        <input data-err={!!errors.name} className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} placeholder="e.g. Priya Shah" aria-invalid={!!errors.name} />
                        {errors.name && <span className="mt-1 block text-sm font-medium text-red-600">{errors.name}</span>}
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-secondary">Mobile number</span>
                        <input data-err={!!errors.phone} className="field" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" maxLength={16} placeholder="98200 12345" aria-invalid={!!errors.phone} />
                        {errors.phone && <span className="mt-1 block text-sm font-medium text-red-600">{errors.phone}</span>}
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="mb-1 block text-sm font-semibold text-secondary">Notes <span className="font-normal text-ink/50">(optional)</span></span>
                        <textarea className="field min-h-[96px] resize-none" rows={3} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={c.ui.notesPlaceholder} />
                      </label>
                    </div>
                  </fieldset>

                  <button type="submit" disabled={busy} className="btn btn-primary w-full text-lg disabled:opacity-70">
                    {busy ? <><Loader2 className="animate-spin" size={20} /> Booking…</> : <><Send size={18} /> {c.ui.bookCta}</>}
                  </button>
                  <p className="text-center text-xs text-ink/50">Demo — sample data. No real appointment is made.</p>
                </m.form>
              )}
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
