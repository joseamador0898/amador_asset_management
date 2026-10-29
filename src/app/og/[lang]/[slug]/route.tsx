import { articleCard } from "@/lib/og";
import { getAllArticles, getArticle } from "@/lib/insights";

// Each article's social card: /og/en/<slug> and /og/es/<slug> (prerendered).
export function generateStaticParams() {
  const all = [...getAllArticles("en").map((a) => ({ lang: "en", slug: a.slug })), ...getAllArticles("es").map((a) => ({ lang: "es", slug: a.slug }))];
  return all.length ? all : [{ lang: "en", slug: "coming-soon" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const meta = lang === "en" || lang === "es" ? getArticle(slug, lang)?.meta : undefined;
  if (!meta) return new Response("Not found\n", { status: 404 });
  return articleCard(meta);
}
