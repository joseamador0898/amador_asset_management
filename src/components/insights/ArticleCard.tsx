import Link from "next/link";
import type { ArticleMeta } from "@/lib/insights";
import { ARTICLES_PATH, CATEGORY_LABELS, formatDateFor, type Lang } from "@/lib/i18n";
import { ArticleCover } from "./ArticleCover";
import { cn } from "@/lib/utils";

export const categoryColor: Record<string, string> = {
  Research: "text-oxblood",
  Frameworks: "text-sea",
  Risk: "text-brass",
  Markets: "text-ink",
  Signals: "text-[#2f6b77]",
  Education: "text-muted",
};

const READ = { en: { long: "min read", short: "min" }, es: { long: "min de lectura", short: "min" } };

export function ArticleCard({ article, variant = "default", lang = article.lang ?? "en" }: { article: ArticleMeta; variant?: "default" | "compact" | "feature"; lang?: Lang }) {
  const href = `${ARTICLES_PATH[lang]}/${article.slug}`;
  const category = CATEGORY_LABELS[lang][article.category] ?? article.category;
  if (variant === "feature") {
    return (
      <Link href={href} className="group grid gap-8 md:grid-cols-12 md:items-center">
        <ArticleCover theme={article.cover} className="aspect-[16/10] md:col-span-7" />
        <div className="md:col-span-5">
          <p className={cn("text-[0.66rem] font-semibold uppercase tracking-[0.2em]", categoryColor[article.category])}>
            {article.series ?? category}
          </p>
          <h3 className="display mt-4 text-4xl group-hover:text-ink/75 md:text-5xl">{article.title}</h3>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">{article.dek}</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink/60">
            {formatDateFor(article.date, lang)} · {article.readingMinutes} {READ[lang].long}
          </p>
        </div>
      </Link>
    );
  }
  if (variant === "compact") {
    return (
      <Link href={href} className="group block border-t border-line py-6">
        <p className={cn("text-[0.62rem] font-semibold uppercase tracking-[0.2em]", categoryColor[article.category])}>{category}</p>
        <h3 className="mt-2 font-serif text-2xl leading-snug group-hover:text-ink/70">{article.title}</h3>
        <p className="mt-2 text-xs text-muted">
          {formatDateFor(article.date, lang)} · {article.readingMinutes} {READ[lang].short}
        </p>
      </Link>
    );
  }
  return (
    <Link href={href} className="group flex h-full flex-col bg-white transition-shadow duration-500 hover:shadow-[0_20px_50px_-30px_rgba(10,14,22,0.45)]">
      <ArticleCover theme={article.cover} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className={cn("text-[0.62rem] font-semibold uppercase tracking-[0.2em]", categoryColor[article.category])}>
          {article.series ?? category}
        </p>
        <h3 className="mt-3 font-serif text-[1.65rem] font-light leading-[1.15] group-hover:text-ink/75">{article.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.dek}</p>
        <p className="mt-auto pt-6 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink/70">
          {formatDateFor(article.date, lang, { month: "short", day: "numeric", year: "numeric" })} · {article.readingMinutes} {READ[lang].short}
        </p>
      </div>
    </Link>
  );
}
