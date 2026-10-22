import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

export type Booking = {
  id: string;
  created_at: string;
  theme: string;
  name: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  slot: string; // HH:MM
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled";
};

export type NewBooking = Omit<Booking, "id" | "created_at" | "status">;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isLive = Boolean(url && key);

let client: SupabaseClient | null = null;
async function sb(): Promise<SupabaseClient> {
  if (!client) {
    const { createClient } = await import("@supabase/supabase-js");
    client = createClient(url!, key!, { auth: { persistSession: false } });
  }
  return client;
}

/* ---------- demo mode: bookings live in this browser only ---------- */
const LS_KEY = "demo-bookings-v1";
const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("demo-bookings") : null;

const readLocal = (): Booking[] => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeLocal = (rows: Booking[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  } catch {
    /* storage unavailable (private mode) – keep going in memory */
  }
  bc?.postMessage("changed");
  window.dispatchEvent(new Event("demo-bookings-changed"));
};

export class SlotTakenError extends Error {}

export async function createBooking(b: NewBooking): Promise<Booking> {
  if (!isLive) {
    const rows = readLocal();
    if (rows.some((r) => r.theme === b.theme && r.date === b.date && r.slot === b.slot && r.status !== "cancelled")) throw new SlotTakenError();
    const row: Booking = { ...b, id: crypto.randomUUID(), created_at: new Date().toISOString(), status: "pending" };
    writeLocal([row, ...rows]);
    return row;
  }
  const { data, error } = await (await sb()).from("appointments").insert(b).select().single();
  if (error) {
    if (error.code === "23505") throw new SlotTakenError();
    throw new Error(error.message);
  }
  return data as Booking;
}

export async function listBooked(theme: string, date: string): Promise<string[]> {
  if (!isLive) return readLocal().filter((r) => r.theme === theme && r.date === date && r.status !== "cancelled").map((r) => r.slot);
  const { data } = await (await sb()).from("appointments").select("slot").eq("theme", theme).eq("date", date).neq("status", "cancelled");
  return (data ?? []).map((r: { slot: string }) => r.slot);
}

export async function listAll(theme: string): Promise<Booking[]> {
  if (!isLive) return readLocal().filter((r) => r.theme === theme);
  const { data } = await (await sb())
    .from("appointments").select("*").eq("theme", theme).order("date", { ascending: true }).order("slot", { ascending: true }).limit(200);
  return (data ?? []) as Booking[];
}

export async function setStatus(id: string, status: Booking["status"]): Promise<void> {
  if (!isLive) {
    writeLocal(readLocal().map((r) => (r.id === id ? { ...r, status } : r)));
    return;
  }
  const { error } = await (await sb()).from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Calls cb whenever any booking for the theme changes. Returns an unsubscribe function. */
export function subscribe(theme: string, cb: () => void): () => void {
  if (!isLive) {
    const onStorage = (e: StorageEvent) => e.key === LS_KEY && cb();
    const ch = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("demo-bookings") : null;
    ch && (ch.onmessage = cb);
    window.addEventListener("demo-bookings-changed", cb);
    window.addEventListener("storage", onStorage);
    return () => {
      ch?.close();
      window.removeEventListener("demo-bookings-changed", cb);
      window.removeEventListener("storage", onStorage);
    };
  }
  let channel: RealtimeChannel | null = null;
  let closed = false;
  sb().then((c) => {
    if (closed) return;
    channel = c
      .channel(`appointments-${theme}-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `theme=eq.${theme}` }, cb)
      .subscribe();
  });
  return () => {
    closed = true;
    if (channel) void sb().then((c) => c.removeChannel(channel!));
  };
}
