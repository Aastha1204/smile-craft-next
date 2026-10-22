import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { telLink, waLink, type SiteConfig } from "@/lib/theme";

export function FloatingActions({ c }: { c: SiteConfig }) {
  return (
    <>
      <a
        href={waLink(c)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="wa-pulse fixed bottom-6 right-6 z-30 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-110 active:scale-95 md:grid"
      >
        <MessageCircle size={28} />
      </a>

      <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 gap-2 border-t border-secondary/10 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <a href={telLink(c)} className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl text-xs font-semibold text-secondary active:bg-primary/10"><Phone size={20} /> Call</a>
        <a href={waLink(c)} target="_blank" rel="noopener noreferrer" className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#128C7E] text-xs font-semibold text-white active:scale-95"><MessageCircle size={20} /> WhatsApp</a>
        <a href="#book" className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl bg-primary text-xs font-semibold text-white active:scale-95"><CalendarCheck size={20} /> Book</a>
      </nav>
    </>
  );
}
