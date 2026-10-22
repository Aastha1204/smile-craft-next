"use client";

import type { ReactNode } from "react";

export const PREFILL_EVENT = "prefill-service";

/** Card-sized button: selects a service in the booking form and scrolls there. */
export function PickService({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: id }));
        document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </button>
  );
}
