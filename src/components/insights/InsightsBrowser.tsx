"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Category filter for the Insights index. Cards are rendered on the server and
 * passed in already grouped by category, so filtering needs no data fetching.
 */
export function InsightsBrowser({ categories, cards }: { categories: string[]; cards: Array<{ category: string; node: ReactNode; key: string }> }) {
  const [active, setActive] = useState("All");
  const visible = cards.filter((c) => active === "All" || c.category === active);
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={cn(
              "border px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] transition-colors",
              active === c ? "border-ink bg-ink text-paper" : "border-line text-ink/70 hover:border-ink hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => (
          <div key={c.key}>{c.node}</div>
        ))}
      </div>
      {visible.length === 0 && <p className="mt-10 text-muted">No articles in this category yet.</p>}
    </div>
  );
}
