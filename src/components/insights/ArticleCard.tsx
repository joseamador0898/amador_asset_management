import Link from "next/link";
import type { ArticleMeta } from "@/lib/insights";
import { ArticleCover } from "./ArticleCover";
import { cn, formatDate } from "@/lib/utils";

export const categoryColor: Record<string, string> = {
  Research: "text-oxblood",
  Frameworks: "text-sea",
  Risk: "text-brass",
  Markets: "text-ink",
  Signals: "text-[#2f6b77]",
  Education: "text-muted",
};

export function ArticleCard({ article, variant = "default" }: { article: ArticleMeta; variant?: "default" | "compact" | "feature" }) {
  if (variant === "feature") {
    return (
      <Link href={`/insights/${article.slug}`} className="group grid gap-8 md:grid-cols-12 md:items-center">
        <ArticleCover theme={article.cover} className="aspect-[16/10] md:col-span-7" />
        <div className="md:col-span-5">
          <p className={cn("text-[0.66rem] font-semibold uppercase tracking-[0.2em]", categoryColor[article.category])}>
            {article.series ?? article.category}
          </p>
          <h3 className="display mt-4 text-4xl group-hover:text-ink/75 md:text-5xl">{article.title}</h3>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">{article.dek}</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink/60">
            {formatDate(article.date)} · {article.readingMinutes} min read
          </p>
        </div>
      </Link>
    );
  }
  if (variant === "compact") {
    return (
      <Link href={`/insights/${article.slug}`} className="group block border-t border-line py-6">
        <p className={cn("text-[0.62rem] font-semibold uppercase tracking-[0.2em]", categoryColor[article.category])}>{article.category}</p>
        <h3 className="mt-2 font-serif text-2xl leading-snug group-hover:text-ink/70">{article.title}</h3>
        <p className="mt-2 text-xs text-muted">
          {formatDate(article.date)} · {article.readingMinutes} min
        </p>
      </Link>
    );
  }
  return (
    <Link href={`/insights/${article.slug}`} className="group flex h-full flex-col bg-white transition-shadow duration-500 hover:shadow-[0_20px_50px_-30px_rgba(10,14,22,0.45)]">
      <ArticleCover theme={article.cover} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className={cn("text-[0.62rem] font-semibold uppercase tracking-[0.2em]", categoryColor[article.category])}>
          {article.series ?? article.category}
        </p>
        <h3 className="mt-3 font-serif text-[1.65rem] font-light leading-[1.15] group-hover:text-ink/75">{article.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.dek}</p>
        <p className="mt-auto pt-6 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink/55">
          {formatDate(article.date, { month: "short", day: "numeric", year: "numeric" })} · {article.readingMinutes} min
        </p>
      </div>
    </Link>
  );
}
