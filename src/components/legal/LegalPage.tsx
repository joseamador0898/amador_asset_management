import type { ReactNode } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Section";

const DOCS = [
  { href: "/legal/disclosures", label: "Important Disclosures" },
  { href: "/legal/privacy", label: "Privacy Notice" },
  { href: "/legal/terms", label: "Terms of Use" },
];

/*
 * TODO (before launch): these documents are starting templates written for an
 * early-stage firm. Have securities counsel review them against your actual
 * registration status, fund structure and data-provider agreements.
 */
export function LegalPage({ title, updated, children, current }: { title: string; updated: string; children: ReactNode; current: string }) {
  return (
    <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <Eyebrow className="text-brass">Legal</Eyebrow>
        <nav aria-label="Legal documents" className="mt-6 flex flex-col gap-3 text-sm">
          {DOCS.map((d) => (
            <Link key={d.href} href={d.href} aria-current={d.href === current ? "page" : undefined} className={d.href === current ? "font-semibold text-ink" : "text-muted hover:text-ink"}>
              {d.label}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="lg:col-span-8">
        <h1 className="display text-5xl md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-muted">Last updated {updated}</p>
        <div className="prose-amador mt-12 text-[1.05rem]">{children}</div>
      </article>
    </div>
  );
}
