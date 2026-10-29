import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AdSenseScript, SiteChrome } from "@/components/layout/SiteChrome";
import { fontClassName } from "@/lib/fonts";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";
import "../globals.css";

/*
 * Root layout of the English site. The Spanish site (/es) has its own root layout in app/(es), so the server HTML of
 * every page carries the right <html lang>. Moving between the two trees is a full page load, as the language switch is
 * anyway. Unmatched URLs render app/global-not-found.tsx.
 */
export const metadata: Metadata = rootMetadata("en");
export const viewport: Viewport = rootViewport;

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassName}>
      <head>
        <AdSenseScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteChrome lang="en">{children}</SiteChrome>
      </body>
    </html>
  );
}
