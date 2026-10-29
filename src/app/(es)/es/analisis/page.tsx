import type { Metadata } from "next";
import { CATEGORIES, getAllArticles } from "@/lib/insights";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { InsightsBrowser } from "@/components/insights/InsightsBrowser";
import { PageHero } from "@/components/ui/Section";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { CATEGORY_LABELS, routeAlternates } from "@/lib/i18n";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Análisis: investigación, marcos y memos",
  description: "Marcos de inversión, investigación de portafolios y memos de mercado de Amador Asset Management, incluida nuestra investigación Deep HRP.",
  alternates: routeAlternates("es", "/insights"),
};

export default function InsightsPageEs() {
  const articles = getAllArticles("es");
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured?.slug);
  const used = CATEGORIES.filter((c) => articles.some((a) => a.category === c));

  return (
    <>
      <JsonLd data={pageGraph("CollectionPage", "Análisis", "/es/analisis", "es")} />
      <PageHero
        eyebrow="Análisis"
        title={
          <>
            Investigación que se puede <em className="font-light italic">verificar.</em>
          </>
        }
        intro="Marcos que de verdad usamos, investigación que publicamos con sus limitaciones y memos sobre lo que el mercado está descontando. Cada número tiene una fuente; cada afirmación, una salvedad."
      />

      {featured && (
        <section className="border-b border-line">
          <div className="container-x py-14 md:py-20">
            <ArticleCard article={featured} variant="feature" lang="es" />
          </div>
        </section>
      )}

      <section className="bg-paper-2">
        <div className="container-x py-14 md:py-20">
          <InsightsBrowser
            categories={[...used]}
            cards={rest.map((a) => ({ key: a.slug, category: a.category, node: <ArticleCard article={a} lang="es" /> }))}
            labels={{ all: "Todos", filter: "Filtrar por categoría", empty: "Aún no hay artículos en esta categoría.", names: CATEGORY_LABELS.es }}
          />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="eyebrow text-brass">Boletines</p>
            <h2 className="display mt-5 text-4xl md:text-5xl">Reciba la nueva investigación en su correo.</h2>
            <p className="mt-5 text-muted">Elija solo lo que quiera: el resumen diario, el memo semanal, artículos de investigación o alertas.</p>
          </div>
          <div className="md:col-span-7">
            <SubscribeForm defaultTopics={["weekly-memo", "research"]} lang="es" />
          </div>
        </div>
      </section>
    </>
  );
}
