import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { ArrowLeft, Languages } from "lucide-react";
import { getAllArticles, getArticle, getHeadings, getRelated, getTwinSlug } from "@/lib/insights";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { ArticleCover } from "@/components/insights/ArticleCover";
import { ArticleCard, categoryColor } from "@/components/insights/ArticleCard";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { alternates, ARTICLES_PATH, CATEGORY_LABELS, formatDateFor } from "@/lib/i18n";
import { site } from "@/lib/site";
import { JsonLd, articleGraph } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";

export function generateStaticParams() {
  const slugs = getAllArticles("es").map((a) => ({ slug: a.slug }));
  // Cache Components requiere al menos un parámetro; este marcador da 404.
  return slugs.length ? slugs : [{ slug: "proximamente" }];
}

export async function generateMetadata({ params }: PageProps<"/es/analisis/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug, "es");
  if (!article) return { title: "Análisis no encontrado" };
  const { meta } = article;
  const twin = getTwinSlug(meta);
  const path = `${ARTICLES_PATH.es}/${meta.slug}`;
  const types = { "text/markdown": `${path}.md` };
  return {
    title: meta.seoTitle ?? meta.title,
    description: meta.description ?? meta.dek,
    keywords: meta.tags,
    alternates: twin ? { ...alternates("es", `${ARTICLES_PATH.en}/${twin}`, path), types } : { canonical: path, types },
    openGraph: {
      type: "article",
      url: path,
      siteName: site.name,
      locale: "es_MX",
      images: [{ url: `/og/es/${meta.slug}`, width: 1200, height: 630, alt: meta.title }],
      title: meta.title,
      description: meta.dek,
      publishedTime: meta.date,
      modifiedTime: meta.updated ?? meta.date,
      authors: [meta.author],
      section: CATEGORY_LABELS.es[meta.category],
      tags: meta.tags,
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.dek, images: [`/og/es/${meta.slug}`] },
  };
}

/** El artículo completo, en caché: el MDX se compila una vez por build (como en la versión en inglés). */
async function ArticleBody({ slug }: { slug: string }) {
  "use cache";
  cacheLife("days");
  const { meta, content } = getArticle(slug, "es")!;
  const headings = getHeadings(content);
  const related = getRelated(meta);
  const twin = getTwinSlug(meta);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <article>
      <JsonLd data={articleGraph(meta, wordCount, twin)} />
      <header className="border-b border-line">
        <div className="container-x pb-12 pt-10 md:pb-16 md:pt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/es/analisis" className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-muted hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Todos los análisis
            </Link>
            {twin && (
              <a href={`${ARTICLES_PATH.en}/${twin}`} hrefLang="en" lang="en" className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-muted hover:text-ink">
                <Languages className="h-3.5 w-3.5" aria-hidden /> Read in English
              </a>
            )}
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className={cn("text-[0.68rem] font-semibold uppercase tracking-[0.2em]", categoryColor[meta.category])}>
                {CATEGORY_LABELS.es[meta.category] ?? meta.category}
                {meta.series && <span className="text-muted"> · {meta.series}</span>}
              </p>
              <h1 className="display mt-5 text-[2.6rem] sm:text-6xl md:text-[4.25rem]">{meta.title}</h1>
              <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink/70">{meta.dek}</p>
            </div>
            <dl className="grid grid-cols-3 gap-6 border-t border-line pt-6 text-sm lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Autor</dt>
                <dd className="mt-1">{meta.author}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Publicado</dt>
                <dd className="mt-1">{formatDateFor(meta.date, "es")}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Tiempo de lectura</dt>
                <dd className="mt-1">{meta.readingMinutes} minutos</dd>
              </div>
            </dl>
          </div>
        </div>
        <ArticleCover theme={meta.cover} className="h-48 md:h-72" />
      </header>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <aside className="hidden lg:col-span-3 lg:block">
          {headings.length > 2 && (
            <nav aria-label="En esta página" className="sticky top-32">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">En esta página</p>
              <ol className="mt-4 space-y-2.5 border-l border-line">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-sm leading-snug text-ink/60 hover:border-brass hover:text-ink">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </aside>

        <div className="min-w-0 lg:col-span-8 lg:col-start-4 xl:col-span-7 xl:col-start-4">
          <div className="prose-amador">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                blockJS: false,
                mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeSlug, rehypeKatex] },
              }}
            />
          </div>

          <aside className="mt-16 border-t border-line pt-8 font-sans text-xs leading-relaxed text-muted">
            <p className="font-semibold uppercase tracking-[0.16em] text-ink/70">Información importante</p>
            <p className="mt-3">
              Este artículo tiene fines educativos e informativos y refleja las opiniones del autor a la fecha de publicación. No
              es asesoría de inversión ni una oferta o solicitud para comprar o vender valor alguno. Los resultados de
              investigación, incluidos los backtests y el rendimiento hipotético, tienen limitaciones inherentes y no garantizan
              resultados futuros. Consulte nuestras{" "}
              <Link href="/es/legal/divulgaciones" className="underline underline-offset-2">
                divulgaciones
              </Link>
              .
            </p>
          </aside>

          <section className="mt-12 bg-ink p-8 text-paper md:p-10">
            <p className="eyebrow text-brass-light">El memo semanal</p>
            <p className="display mt-4 text-3xl">Un marco, bien explicado, cada semana.</p>
            <div className="mt-8">
              <SubscribeForm tone="dark" compact defaultTopics={["weekly-memo", "research"]} lang="es" />
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2">
          <div className="container-x py-16">
            <p className="eyebrow text-brass">Seguir leyendo</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} lang="es" />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

export default async function ArticlePageEs({ params }: PageProps<"/es/analisis/[slug]">) {
  const { slug } = await params;
  if (!getArticle(slug, "es")) notFound();
  return <ArticleBody slug={slug} />;
}
