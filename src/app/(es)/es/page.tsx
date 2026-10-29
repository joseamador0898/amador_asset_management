import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Dendrogram } from "@/components/art/Dendrogram";
import { Nautilus } from "@/components/art/Nautilus";
import { ButtonLink, CircleArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { TickerTape } from "@/components/signals/TickerTape";
import { MacroGrid } from "@/components/signals/MacroGrid";
import { Predictions } from "@/components/signals/Predictions";
import { SourceBadge } from "@/components/signals/Panel";
import { AlertList } from "@/components/signals/AlertList";
import { WorldMarketsLive } from "@/components/signals/WorldMarketsLive";
import { routeAlternates } from "@/lib/i18n";
import { getAllArticles } from "@/lib/insights";
import { getGsMacro, getLiveBoard, getMacro, getPredictions, getQuotes } from "@/lib/signals";
import { buildGsAlerts } from "@/lib/signals/alerts";
import { fund } from "@/lib/site";

const FUND_ES = "Fondo Nautilus de Amador";

export const metadata: Metadata = {
  title: { absolute: "Amador Asset Management | Investigación y Fondo Nautilus" },
  description: "Investigación de inversiones independiente, el panel Amador Señales, educación para inversionistas y el próximo Fondo Nautilus de Amador, desde Chicago.",
  alternates: routeAlternates("es", "/"),
};

const SERVICES = [
  {
    n: "01",
    title: FUND_ES,
    body: "Nuestro fondo insignia, próximamente: un portafolio multiactivo con riesgo balanceado para todas las estaciones, construido para mantener el rumbo en mar fuerte.",
    href: "/es/fondo",
    cta: "Explorar el fondo",
  },
  {
    n: "02",
    title: "Asesoría y consultas",
    body: "Revisiones de portafolio, marcos de asignación y consultas de investigación, una conversación estructurada a la vez.",
    href: "/es/reservar",
    cta: "Agendar una consulta",
  },
  {
    n: "03",
    title: "Investigación y análisis",
    body: "Marcos, artículos y memos, incluida nuestra investigación Deep HRP sobre paridad de riesgo jerárquica aprendible.",
    href: "/es/analisis",
    cta: "Leer la investigación",
  },
  {
    n: "04",
    title: "Señales y alertas",
    body: "Una terminal de mercados en vivo y alertas por correo: indicadores macro de Goldman Sachs, mercados mundiales en tiempo real, actividad inusual en opciones, compras de insiders y probabilidades de los mercados de predicción.",
    href: "/es/senales",
    cta: "Abrir Señales",
  },
];
const COUNT_WORDS = ["", "una", "dos", "tres", "cuatro", "cinco", "seis"];

const PRINCIPLES = [
  { title: "El riesgo antes que el rendimiento", body: "Dimensionamos para la tormenta, no para el pronóstico. Cada posición empieza por lo que puede perder." },
  { title: "Evidencia sobre narrativa", body: "Diez semillas, no una corrida con suerte. Publicamos métodos, limitaciones y resultados negativos." },
  { title: "Diversificar el riesgo, no los tickers", body: "Las correlaciones se agrupan. Construimos alrededor de cómo se mueven realmente los activos entre sí, sobre todo bajo estrés." },
  { title: "La paciencia compone", body: "Como un nautilo que añade cámaras, el patrimonio durable se construye capa por capa, con disciplina." },
];

const FACTS = [
  { value: "8", label: "universos de activos en nuestro benchmark de investigación DHRP-8" },
  { value: "10", label: "semillas por modelo: nuestro estándar mínimo de evidencia" },
  { value: "7", label: "fuentes de datos en vivo detrás de Amador Señales" },
  { value: "1", label: `fondo insignia en preparación: el ${FUND_ES}` },
];

async function HomeTape() {
  return <TickerTape feed={await getQuotes()} lang="es" />;
}

async function SignalsPreview() {
  const [gs, macro, predictions, board] = await Promise.all([getGsMacro(), getMacro(), getPredictions(), getLiveBoard()]);
  const alerts = gs ? buildGsAlerts(gs.data, "es") : [];
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Los indicadores de Goldman Sachs primero cuando la fuente licenciada está activa; FRED en caso contrario. */}
      <div className="term-panel overflow-hidden lg:col-span-2">
        <div className="flex items-center justify-between border-b border-term-line px-5 py-3.5">
          <p className="text-sm font-semibold text-paper">{gs ? "Lente macro de Goldman Sachs" : "Panel macro"}</p>
          <SourceBadge source={gs ? gs.source : macro.source} lang="es" />
        </div>
        {gs ? (
          <MacroGrid series={gs.data.tiles} gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" lang="es" />
        ) : (
          <MacroGrid series={macro.data} limit={8} lang="es" />
        )}
      </div>
      <div className="term-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-term-line px-5 py-3.5">
          <p className="text-sm font-semibold text-paper">{alerts.length ? "Alertas de señales" : "Mercados de predicción"}</p>
          <SourceBadge source={gs && alerts.length ? gs.source : predictions.source} lang="es" />
        </div>
        {alerts.length ? <AlertList alerts={alerts} limit={3} lang="es" /> : <Predictions markets={predictions.data} limit={3} lang="es" />}
      </div>
      <div className="term-panel overflow-hidden lg:col-span-3">
        <div className="flex items-center justify-between border-b border-term-line px-5 py-3.5">
          <p className="text-sm font-semibold text-paper">Mercados del mundo</p>
          <SourceBadge source={{ provider: "Alpaca Markets", live: board.live, asOf: board.asOf }} lang="es" />
        </div>
        <WorldMarketsLive initial={board} compact lang="es" />
      </div>
    </div>
  );
}

export default function HomePageEs() {
  const articles = getAllArticles("es").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <div className="container-x grid gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-brass-light">Investigación y gestión de inversiones independiente</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-7 text-[3.1rem] sm:text-7xl xl:text-[5.6rem]">Construido para cada estación del mercado.</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70">
                Amador Asset Management combina investigación rigurosa de portafolios con una gestión de riesgo disciplinada, y
                comparte el trabajo abiertamente: señales de mercado en vivo, marcos publicados y el próximo {FUND_ES}.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/es/fondo" variant="brass">
                Explorar el Fondo Nautilus
              </ButtonLink>
              <ButtonLink href="/es/reservar" variant="outline-light">
                Agendar una consulta
              </ButtonLink>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-6 text-sm text-paper/60">
                <Link href="/" hrefLang="en" lang="en" className="underline underline-offset-4 hover:text-paper">
                  Read the site in English
                </Link>
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <figure className="relative">
              <Dendrogram className="w-full text-paper/80" />
              <figcaption className="mt-4 flex items-center justify-between border-t border-line-dark pt-4 font-mono text-[0.62rem] uppercase tracking-wider text-paper/60">
                <span>Cómo se agrupan dieciséis mercados por correlación</span>
                <span>Ilustrativo</span>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="border-t border-line-dark">
          <dl className="container-x grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label} className="pr-6">
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="display block text-5xl text-paper">{f.value}</span>
                  <span className="mt-2 block max-w-[14rem] text-xs leading-relaxed text-paper/50">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Suspense fallback={<div className="h-10 bg-term" aria-hidden />}>
        <HomeTape />
      </Suspense>

      {/* Declaración */}
      <section className="border-b border-line">
        <div className="container-x grid gap-10 py-20 md:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow text-brass">Sobre la firma</p>
          </Reveal>
          <Reveal className="lg:col-span-9" delay={80}>
            <p className="display text-[2rem] leading-[1.15] sm:text-[2.6rem] md:text-[3.1rem]">
              Creemos que los rendimientos durables nacen de un proceso disciplinado, evidencia honesta y portafolios construidos
              para resistir condiciones que ningún pronóstico puede ver.{" "}
              <span className="text-muted">Por eso investigamos a la vista de todos, dimensionamos para la tormenta y dejamos que la paciencia haga el trabajo de componer.</span>
            </p>
            <CircleArrowLink href="/es/firma" label="Quiénes somos" className="mt-10" />
          </Reveal>
        </div>
      </section>

      {/* Qué hacemos */}
      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Qué hacemos" title={`Una firma, ${COUNT_WORDS[SERVICES.length]} formas de trabajar con nosotros.`} />
          <ol className="mt-14 border-t border-ink">
            {SERVICES.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 60} className="border-b border-line">
                <Link href={s.href} className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:py-10">
                  <span className="font-mono text-sm text-brass md:col-span-1">{s.n}</span>
                  <span className="font-serif text-3xl font-light transition-transform duration-500 group-hover:translate-x-1 md:col-span-4 md:text-4xl">{s.title}</span>
                  <span className="text-[0.98rem] leading-relaxed text-muted md:col-span-5">{s.body}</span>
                  <span className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink md:col-span-2 md:justify-end">
                    {s.cta} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Análisis */}
      {articles.length > 0 && (
        <section className="bg-paper-2">
          <div className="container-x py-20 md:py-28">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeader eyebrow="Análisis recientes" title="Investigación que se puede verificar." />
              <CircleArrowLink href="/es/analisis" label="Todos los análisis" />
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 80}>
                  <ArticleCard article={a} lang="es" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* El fondo */}
      <section className="relative overflow-hidden bg-sea text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.16),transparent_55%)]" aria-hidden />
        <div className="container-x relative grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-brass-light">El fondo insignia · Prelanzamiento</p>
              <h2 className="display mt-6 text-5xl md:text-7xl">{FUND_ES}</h2>
              <p className="mt-6 font-serif text-2xl font-light italic text-paper/85">
                {fund.taglineEs} <span className="not-italic text-paper/55">· {fund.taglineEn}</span>
              </p>
              <p className="mt-8 max-w-lg leading-relaxed text-paper/70">
                El nautilo ha cruzado cientos de millones de años de océano equilibrando sus cámaras, manteniendo su profundidad
                mientras las tormentas pasan por encima. Nuestro fondo insignia se diseña alrededor de la misma idea: balancear el
                riesgo en cada estación económica, rebalancear con disciplina y componer capa por capa.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/es/fondo" variant="light">
                  Descubrir el fondo
                </ButtonLink>
                <ButtonLink href="/es/fondo#registro" variant="outline-light">
                  Registrar interés
                </ButtonLink>
              </div>
              <p className="mt-8 max-w-lg text-[0.7rem] leading-relaxed text-paper/60">
                Prelanzamiento. No es una oferta de venta ni una solicitud de oferta de compra de valor alguno. Cualquier oferta
                se hará únicamente a inversionistas elegibles mediante documentos de oferta definitivos.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Nautilus className="mx-auto w-full max-w-[520px] text-paper/85" />
          </div>
        </div>
      </section>

      {/* Señales */}
      <section className="bg-term text-paper">
        <div className="container-x py-20 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              eyebrow="Amador Señales"
              tone="light"
              title="El mercado, en una sola pantalla."
              intro="Indicadores macro y alertas de Goldman Sachs, mercados mundiales en vivo, flujo de opciones, operaciones de insiders y probabilidades de los mercados de predicción, cada uno con su fuente y su retraso."
            />
            <ButtonLink href="/es/senales" variant="light">
              Abrir la terminal
            </ButtonLink>
          </div>
          <div className="mt-12">
            <Suspense fallback={<div className="term-panel h-80 animate-pulse" aria-hidden />}>
              <SignalsPreview />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Principios */}
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Principios" title="Cómo tomamos decisiones." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="bg-paper p-8">
                <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 font-serif text-2xl">{p.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Consultas */}
      <section className="bg-paper">
        <div className="container-x py-20 md:py-24">
          <div className="grid gap-10 bg-brass p-10 md:grid-cols-12 md:items-center md:p-14">
            <div className="md:col-span-8">
              <p className="eyebrow text-ink">Consultas</p>
              <p className="display mt-5 text-4xl text-ink md:text-5xl">Una segunda opinión sobre su portafolio, desde los primeros principios.</p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <ButtonLink href="/es/reservar" variant="solid">
                Elegir un horario
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
