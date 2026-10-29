import { siteCard } from "@/lib/og";

// The site's social card in each language: /og/en and /og/es (prerendered).
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "es") return new Response("Not found\n", { status: 404 });
  return siteCard(lang);
}
