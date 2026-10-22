import { getAllArticles, getArticle } from "@/lib/insights";
import { articleMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";

// Served at /insights/<slug>.md through a rewrite (next.config.ts); the canonical stays the HTML page.
export function generateStaticParams() {
  const slugs = getAllArticles().map((a) => ({ slug: a.slug }));
  return slugs.length ? slugs : [{ slug: "coming-soon" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(articleMarkdown(article.meta, article.content), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", Link: `<${site.url}/insights/${slug}>; rel="canonical"` },
  });
}
