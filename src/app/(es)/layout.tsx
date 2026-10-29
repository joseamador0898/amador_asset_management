import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AdSenseScript, SiteChrome } from "@/components/layout/SiteChrome";
import { fontClassName } from "@/lib/fonts";
import { HTML_LANG } from "@/lib/i18n";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";
import "../globals.css";

/*
 * Root layout of the Spanish site under /es (Mexican Spanish). Its own root layout, rather than a nested one, so the
 * server HTML declares the Spanish <html lang> to crawlers that do not run JavaScript. Pages pair with their English
 * versions through lib/i18n (hreflang alternates, the language switch and the sitemap).
 */
export const metadata: Metadata = rootMetadata("es");
export const viewport: Viewport = rootViewport;

export default function SpanishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={HTML_LANG.es} className={fontClassName}>
      <head>
        <AdSenseScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteChrome lang="es">{children}</SiteChrome>
      </body>
    </html>
  );
}
