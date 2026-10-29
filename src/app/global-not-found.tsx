import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { fontClassName } from "@/lib/fonts";
import { site } from "@/lib/site";
import "./globals.css";

/*
 * Unmatched URLs in either language. The app has two root layouts (English and Spanish), so no single layout can frame
 * this page; it brings its own <html>, styles and fonts. Bilingual, since the address alone does not say which language
 * the visitor reads. notFound() inside a page uses that language's not-found.tsx instead.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Page not found · Página no encontrada | Amador",
  description: "The page you were looking for has moved or never existed. La página que buscaba se movió o nunca existió.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontClassName}>
      <body className="flex min-h-screen flex-col bg-ink text-paper">
        <header className="border-b border-line-dark">
          <div className="container-x flex h-[72px] items-center">
            <Logo tone="light" />
          </div>
        </header>
        <main id="main" className="grain flex flex-1 items-center">
          <div className="container-x grid gap-16 py-20 md:grid-cols-2 md:py-28">
            <section>
              <p className="eyebrow text-brass-light">404</p>
              <h1 className="display mt-6 text-5xl md:text-6xl">Off the chart.</h1>
              <p className="mt-6 max-w-md text-paper/65">
                The page you were looking for has moved or never existed. Even the best models miss sometimes.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/" variant="light">
                  Back home
                </ButtonLink>
                <ButtonLink href="/insights" variant="outline-light">
                  Read insights
                </ButtonLink>
              </div>
            </section>
            <section lang="es-MX" className="md:border-l md:border-line-dark md:pl-16">
              <p className="eyebrow text-brass-light">404</p>
              <p className="display mt-6 text-5xl md:text-6xl">Fuera de la gráfica.</p>
              <p className="mt-6 max-w-md text-paper/65">
                La página que buscaba se movió o nunca existió. Hasta los mejores modelos fallan a veces.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/es" variant="light">
                  Ir al inicio
                </ButtonLink>
                <ButtonLink href="/es/analisis" variant="outline-light">
                  Leer análisis
                </ButtonLink>
              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
