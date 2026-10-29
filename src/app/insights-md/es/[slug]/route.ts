import { getAllArticles, getArticle } from "@/lib/insights";
import { articleMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";

// Served at /es/analisis/<slug>.md through a rewrite (next.config.ts); the canonical stays the HTML page.
export function generateStaticParams() {
  const slugs = getAllArticles("es").map((a) => ({ slug: a.slug }));
  return slugs.length ? slugs : [{ slug: "proximamente" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug, "es");
  if (!article) return new Response("No encontrado\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(articleMarkdown(article.meta, article.content), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Language": "es-MX", Link: `<${site.url}/es/analisis/${slug}>; rel="canonical"` },
  });
}
