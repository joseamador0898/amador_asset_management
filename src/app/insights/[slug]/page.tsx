import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { ArrowLeft } from "lucide-react";
import { getAllArticles, getArticle, getHeadings, getRelated } from "@/lib/insights";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { ArticleCover } from "@/components/insights/ArticleCover";
import { ArticleCard, categoryColor } from "@/components/insights/ArticleCard";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { site } from "@/lib/site";
import { cn, formatDate } from "@/lib/utils";
import "katex/dist/katex.min.css";

export function generateStaticParams() {
  const slugs = getAllArticles().map((a) => ({ slug: a.slug }));
  // Cache Components requires at least one param; this placeholder renders a 404.
  return slugs.length ? slugs : [{ slug: "coming-soon" }];
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Insight not found" };
  const { meta } = article;
  return {
    title: meta.title,
    description: meta.dek,
    alternates: { canonical: `/insights/${meta.slug}` },
    openGraph: { type: "article", title: meta.title, description: meta.dek, publishedTime: meta.date, authors: [meta.author] },
  };
}

async function Article({ params }: Pick<PageProps<"/insights/[slug]">, "params">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const { meta, content } = article;
  const headings = getHeadings(content);
  const related = getRelated(meta);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.dek,
    datePublished: meta.date,
    dateModified: meta.updated ?? meta.date,
    author: { "@type": "Person", name: meta.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/insights/${meta.slug}`,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="border-b border-line">
        <div className="container-x pb-12 pt-10 md:pb-16 md:pt-14">
          <Link href="/insights" className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-muted hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All insights
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className={cn("text-[0.68rem] font-semibold uppercase tracking-[0.2em]", categoryColor[meta.category])}>
                {meta.category}
                {meta.series && <span className="text-muted"> · {meta.series}</span>}
              </p>
              <h1 className="display mt-5 text-[2.6rem] sm:text-6xl md:text-[4.25rem]">{meta.title}</h1>
              <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink/70">{meta.dek}</p>
            </div>
            <dl className="grid grid-cols-3 gap-6 border-t border-line pt-6 text-sm lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Author</dt>
                <dd className="mt-1">{meta.author}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Published</dt>
                <dd className="mt-1">{formatDate(meta.date)}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Reading time</dt>
                <dd className="mt-1">{meta.readingMinutes} minutes</dd>
              </div>
            </dl>
          </div>
        </div>
        <ArticleCover theme={meta.cover} className="h-48 md:h-72" />
      </header>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <aside className="hidden lg:col-span-3 lg:block">
          {headings.length > 2 && (
            <nav aria-label="On this page" className="sticky top-32">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">On this page</p>
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
            <p className="font-semibold uppercase tracking-[0.16em] text-ink/70">Important information</p>
            <p className="mt-3">
              This article is for educational and informational purposes only and reflects the author&apos;s views as of the
              publication date. It is not investment advice or an offer or solicitation to buy or sell any security. Research
              results, including backtests and hypothetical performance, have inherent limitations and do not guarantee future
              results. See our{" "}
              <Link href="/legal/disclosures" className="underline underline-offset-2">
                disclosures
              </Link>
              .
            </p>
          </aside>

          <section className="mt-12 bg-ink p-8 text-paper md:p-10">
            <p className="eyebrow text-brass-light">The Weekly Memo</p>
            <p className="display mt-4 text-3xl">One framework, explained properly, every week.</p>
            <div className="mt-8">
              <SubscribeForm tone="dark" compact defaultTopics={["weekly-memo", "research"]} />
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2">
          <div className="container-x py-16">
            <p className="eyebrow text-brass">Continue reading</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

export default function ArticlePage(props: PageProps<"/insights/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x min-h-[60vh] py-24" aria-busy="true" />}>
      <Article params={props.params} />
    </Suspense>
  );
}
