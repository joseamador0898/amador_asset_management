import type { ReactNode } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Section";
import { counterpart, type Lang } from "@/lib/i18n";

const DOCS: Record<Lang, Array<{ href: string; label: string }>> = {
  en: [
    { href: "/legal/disclosures", label: "Important Disclosures" },
    { href: "/legal/privacy", label: "Privacy Notice" },
    { href: "/legal/terms", label: "Terms of Use" },
  ],
  es: [
    { href: "/es/legal/divulgaciones", label: "Divulgaciones importantes" },
    { href: "/es/legal/privacidad", label: "Aviso de privacidad" },
    { href: "/es/legal/terminos", label: "Términos de uso" },
  ],
};

/*
 * TODO (before launch): these documents are starting templates written for an
 * early-stage firm. Have securities counsel review them against your actual
 * registration status, fund structure and data-provider agreements. The Spanish
 * versions are courtesy translations; the English text prevails.
 */
export function LegalPage({ title, updated, children, current, lang = "en" }: { title: string; updated: string; children: ReactNode; current: string; lang?: Lang }) {
  return (
    <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <Eyebrow className="text-brass">Legal</Eyebrow>
        <nav aria-label={lang === "es" ? "Documentos legales" : "Legal documents"} className="mt-6 flex flex-col gap-3 text-sm">
          {DOCS[lang].map((d) => (
            <Link key={d.href} href={d.href} aria-current={d.href === current ? "page" : undefined} className={d.href === current ? "font-semibold text-ink" : "text-muted hover:text-ink"}>
              {d.label}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="lg:col-span-8">
        <h1 className="display text-5xl md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-muted">
          {lang === "es" ? "Última actualización:" : "Last updated"} {updated}
        </p>
        {lang === "es" && (
          <p className="mt-3 text-sm text-muted">
            Traducción de cortesía. Si hay alguna diferencia, prevalece la{" "}
            <Link href={counterpart(current, "es", {})} hrefLang="en" className="underline underline-offset-2">
              versión en inglés
            </Link>
            .
          </p>
        )}
        <div className="prose-amador mt-12 text-[1.05rem]">{children}</div>
      </article>
    </div>
  );
}
