import type { ReactNode } from "react";
import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { chrome, type Lang } from "@/lib/i18n";
import { getArticlePairs } from "@/lib/insights";
import { JsonLd, siteGraph } from "@/lib/structured-data";

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/** Google AdSense's own snippet, for <head> as Google asks: its site check reads the server HTML. */
export function AdSenseScript() {
  if (!adsenseClient) return null;
  return <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} crossOrigin="anonymous" />;
}

/** The body both languages share: structured data, skip link, header, main, footer and analytics. */
export function SiteChrome({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <>
      <JsonLd data={siteGraph(lang)} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        {chrome[lang].skip}
      </a>
      <Header lang={lang} pairs={getArticlePairs()} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer lang={lang} />
      <Analytics />
    </>
  );
}
