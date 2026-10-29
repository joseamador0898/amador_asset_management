import type { Metadata } from "next";
import { routeAlternates } from "@/lib/i18n";
import { CATEGORIES, getAllArticles } from "@/lib/insights";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { InsightsBrowser } from "@/components/insights/InsightsBrowser";
import { PageHero } from "@/components/ui/Section";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Insights: research, frameworks and memos",
  description:
    "Investment frameworks, portfolio research and market memos from Amador Asset Management, including our Deep Hierarchical Risk Parity (DHRP) research.",
  alternates: routeAlternates("en", "/insights"),
};

export default function InsightsPage() {
  const articles = getAllArticles();
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured?.slug);
  const used = CATEGORIES.filter((c) => articles.some((a) => a.category === c));

  return (
    <>
      <JsonLd data={pageGraph("CollectionPage", "Insights", "/insights")} />
      <PageHero
        eyebrow="Insights"
        title={
          <>
            Research you can <em className="font-light italic">check.</em>
          </>
        }
        intro="Frameworks we actually use, research we publish with its limitations, and memos on what the market is pricing. Every number has a source; every claim has a caveat."
      />

      {featured && (
        <section className="border-b border-line">
          <div className="container-x py-14 md:py-20">
            <ArticleCard article={featured} variant="feature" />
          </div>
        </section>
      )}

      <section className="bg-paper-2">
        <div className="container-x py-14 md:py-20">
          <InsightsBrowser
            categories={[...used]}
            cards={rest.map((a) => ({ key: a.slug, category: a.category, node: <ArticleCard article={a} /> }))}
          />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="eyebrow text-brass">Briefings</p>
            <h2 className="display mt-5 text-4xl md:text-5xl">Get new research in your inbox.</h2>
            <p className="mt-5 text-muted">Pick only what you want: the daily brief, the weekly memo, research papers or alerts.</p>
          </div>
          <div className="md:col-span-7">
            <SubscribeForm defaultTopics={["weekly-memo", "research"]} />
          </div>
        </div>
      </section>
    </>
  );
}
