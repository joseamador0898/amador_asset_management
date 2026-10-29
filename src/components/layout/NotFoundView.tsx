import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { chrome, type Lang } from "@/lib/i18n";

/** The 404 body in either language, rendered inside that language's layout (notFound() in a page). */
export function NotFoundView({ lang }: { lang: Lang }) {
  const t = chrome[lang].notFound;
  return (
    <section className="grain bg-ink text-paper">
      <div className="container-x flex min-h-[60vh] flex-col justify-center py-24">
        <p className="eyebrow text-brass-light">{t.eyebrow}</p>
        <h1 className="display mt-6 text-6xl md:text-7xl">{t.title}</h1>
        <p className="mt-6 max-w-lg text-paper/65">{t.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={chrome[lang].home} variant="light">
            {t.home}
          </ButtonLink>
          <ButtonLink href={t.insightsHref} variant="outline-light">
            {t.insights}
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-paper/60">
          {t.live}{" "}
          <Link href={t.signalsHref} className="underline underline-offset-2">
            {t.signals}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
