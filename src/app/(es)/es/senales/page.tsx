import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BellRing } from "lucide-react";
import { getCongress, getDarkPool, getInsiders, getLiveBoard, getMacro, getMarketTide, getOptionsPulse, getPredictions, getQuotes } from "@/lib/signals";
import { Panel } from "@/components/signals/Panel";
import { TickerTape } from "@/components/signals/TickerTape";
import { MacroGrid } from "@/components/signals/MacroGrid";
import { NetPremiumBars } from "@/components/signals/NetPremiumBars";
import { UnusualTable } from "@/components/signals/UnusualTable";
import { InsiderTable } from "@/components/signals/InsiderTable";
import { Predictions } from "@/components/signals/Predictions";
import { MarketTide } from "@/components/signals/MarketTide";
import { CongressTable, DarkPoolTable } from "@/components/signals/PartnerTables";
import { MorningNote } from "@/components/signals/MorningNote";
import { GsAlertsPanel, GsMacroPanel } from "@/components/signals/GsMacroPanel";
import { WorldMarketsLive } from "@/components/signals/WorldMarketsLive";
import { ButtonLink } from "@/components/ui/Button";
import { routeAlternates } from "@/lib/i18n";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Señales: panel de mercados en vivo",
  description:
    "Panel gratuito en vivo: indicadores macro de Goldman Sachs, mercados mundiales, opciones inusuales, compras de insiders y mercados de predicción.",
  alternates: routeAlternates("es", "/signals"),
};

const GUIDES = [
  { href: "/es/analisis/la-curva-de-rendimiento-como-senal-de-recesion", title: "La curva de rendimiento", body: "Qué dice el diferencial 10A–2A del panel macro sobre el riesgo de recesión, y qué no dice." },
  { href: "/es/analisis/indices-de-condiciones-financieras-explicados", title: "Condiciones financieras", body: "Cómo leer el NFCI y el FCI de Goldman Sachs: el nivel, el cambio y lo que los mueve." },
  { href: "/es/analisis/como-leer-el-flujo-de-opciones", title: "Flujo de opciones", body: "Qué significa «inusual», por qué la prima no indica dirección y qué revisar antes de leer una operación." },
  { href: "/es/analisis/que-dicen-las-compras-de-insiders", title: "Compras de insiders", body: "Por qué las compras en mercado abierto dicen más que las ventas, y cómo filtramos los Form 4." },
  { href: "/es/analisis/mercados-de-prediccion-como-senales-macro", title: "Mercados de predicción", body: "Cuándo el precio de un contrato funciona como probabilidad y cuándo es falsa precisión." },
];

function Skeleton({ className = "h-64" }: { className?: string }) {
  return <div className={`term-panel animate-pulse ${className}`} aria-hidden />;
}

async function Tape() {
  return <TickerTape feed={await getQuotes()} lang="es" />;
}

async function WorldPanel() {
  const board = await getLiveBoard();
  return (
    <Panel
      title="Mercados del mundo"
      subtitle="Niveles de índices locales y ETF por país listados en EE. UU., actualizados cada 15 segundos"
      source={{ provider: "Alpaca Markets (IEX en tiempo real) y Yahoo Finance (niveles de índices, con retraso)", live: board.live, url: "https://alpaca.markets", asOf: board.asOf }}
      className="lg:col-span-3"
      lang="es"
    >
      <WorldMarketsLive initial={board} lang="es" />
    </Panel>
  );
}

async function MacroPanel() {
  const macro = await getMacro();
  return (
    <Panel title="Panel macro" subtitle="Tasas, inflación, empleo y condiciones financieras" source={macro.source} className="lg:col-span-3" lang="es">
      <MacroGrid series={macro.data} lang="es" />
    </Panel>
  );
}

async function PredictionsPanel() {
  const feed = await getPredictions();
  return (
    <Panel title="Mercados de predicción" subtitle="Probabilidades implícitas sobre eventos macro y de mercado (títulos en inglés)" source={feed.source} lang="es">
      <Predictions markets={feed.data} limit={4} lang="es" />
    </Panel>
  );
}

async function OptionsPanels() {
  const feed = await getOptionsPulse();
  return (
    <>
      <Panel title="Pulso de opciones" subtitle="Prima estimada de calls frente a puts operada hoy" source={feed.source} lang="es">
        <NetPremiumBars tickers={feed.data.tickers} lang="es" />
      </Panel>
      <Panel title="Actividad inusual en opciones" subtitle="Contratos que operan muy por encima del interés abierto" source={feed.source} className="lg:col-span-2" lang="es">
        <UnusualTable contracts={feed.data.contracts} lang="es" />
      </Panel>
    </>
  );
}

async function InsiderPanel() {
  const feed = await getInsiders();
  return (
    <Panel title="Operaciones de insiders" subtitle="Últimas operaciones del Form 4 de la SEC, primero las compras en mercado abierto" source={feed.source} className="lg:col-span-2" lang="es">
      <InsiderTable trades={feed.data} lang="es" />
    </Panel>
  );
}

// Los paneles de socios solo aparecen con una fuente con licencia activa.
async function PartnerPanels() {
  const [congress, darkpool] = await Promise.all([getCongress(), getDarkPool()]);
  if (!congress.source.live && !darkpool.source.live) return null;
  return (
    <div className="flex flex-col gap-5">
      {congress.source.live && (
        <Panel title="Operaciones del Congreso" subtitle="Reportes periódicos de operaciones" source={congress.source} lang="es">
          <CongressTable trades={congress.data} lang="es" />
        </Panel>
      )}
      {darkpool.source.live && (
        <Panel title="Operaciones en dark pools" subtitle="Los mayores bloques fuera de bolsa" source={darkpool.source} lang="es">
          <DarkPoolTable prints={darkpool.data} />
        </Panel>
      )}
    </div>
  );
}

async function TidePanel() {
  const tide = await getMarketTide();
  if (!tide.source.live) return null;
  return (
    <Panel title="Marea del mercado" subtitle="Prima neta de calls frente a puts en todas las opciones listadas, intradía" source={tide.source} className="lg:col-span-2" lang="es">
      <MarketTide points={tide.data} lang="es" />
    </Panel>
  );
}

export default function SignalsPageEs() {
  return (
    <div className="bg-term text-paper">
      <JsonLd data={pageGraph("WebPage", "Amador Señales: panel de mercados en vivo", "/es/senales", "es")} />
      <section className="grain border-b border-line-dark bg-ink">
        <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow text-brass-light">Amador Señales</p>
            <h1 className="display mt-5 text-5xl md:text-6xl">El mercado, en una sola pantalla.</h1>
            <p className="mt-5 text-base leading-relaxed text-paper/65">
              Indicadores macro y pronósticos de Goldman Sachs, alertas basadas en reglas, mercados mundiales en vivo, actividad
              inusual en opciones, operaciones de insiders y probabilidades de los mercados de predicción. Hecho para dar
              contexto, no recomendaciones: cada panel muestra su fuente y su retraso.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/es/boletines#alerts" variant="brass">
              Recibir alertas
            </ButtonLink>
            <ButtonLink href="/es/analisis/como-leer-el-flujo-de-opciones" variant="outline-light">
              Cómo leer el flujo
            </ButtonLink>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-10 border-y border-term-line bg-term" aria-hidden />}>
        <Tape />
      </Suspense>

      <div className="container-x space-y-5 py-8">
        {/* Goldman Sachs primero: alertas, lente macro y el comentario construido sobre ellos. */}
        <div className="grid gap-5 lg:grid-cols-3">
          <Suspense fallback={<Skeleton className="h-72 lg:col-span-3" />}>
            <GsAlertsPanel lang="es" />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[30rem] lg:col-span-3" />}>
            <GsMacroPanel lang="es" />
          </Suspense>
        </div>

        <Suspense fallback={<Skeleton className="h-44" />}>
          <MorningNote lang="es" />
        </Suspense>

        <div className="grid gap-5 lg:grid-cols-3">
          <Suspense fallback={<Skeleton className="h-96 lg:col-span-3" />}>
            <WorldPanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-80 lg:col-span-3" />}>
            <MacroPanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-96 lg:col-span-3" />}>
            <OptionsPanels />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-96 lg:col-span-2" />}>
            <InsiderPanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <PredictionsPanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-72 lg:col-span-2" />}>
            <TidePanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <PartnerPanels />
          </Suspense>
        </div>

        <section className="term-panel p-6 md:p-8">
          <h2 className="font-serif text-2xl font-light">Cómo leer este panel</h2>
          <ul className="mt-6 grid gap-px bg-term-line sm:grid-cols-2 lg:grid-cols-5">
            {GUIDES.map((g) => (
              <li key={g.href} className="bg-term-2 p-5">
                <Link href={g.href} className="font-semibold text-paper hover:underline">
                  {g.title}
                </Link>
                <p className="mt-2 text-xs leading-relaxed text-paper/60">{g.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="term-panel flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex gap-4">
            <BellRing className="mt-1 h-6 w-6 shrink-0 text-brass-light" aria-hidden />
            <div>
              <h2 className="font-serif text-2xl font-light">No vigile la pantalla. Reciba la alerta.</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/60">
                Elija resúmenes diarios, alertas de compras de insiders, resúmenes de actividad inusual y probabilidades de eventos
                macro. Por correo; puede darse de baja cuando quiera.
              </p>
            </div>
          </div>
          <ButtonLink href="/es/boletines#alerts" variant="light">
            Configurar alertas
          </ButtonLink>
        </section>

        <section className="grid gap-6 border-t border-term-line pt-8 text-xs leading-relaxed text-paper/60 md:grid-cols-3">
          <p>
            <span className="font-semibold text-paper/70">Fuentes.</span> Cotizaciones: Alpaca Markets (IEX). Macro: FRED®,
            Banco de la Reserva Federal de St. Louis. Opciones: cotizaciones de Cboe con retraso (~15 min). Operaciones de
            insiders: SEC EDGAR. Mercados de predicción: Polymarket (títulos en inglés). Los datos de Goldman Sachs Marquee
            aparecen solo donde hay licencia. Los paneles de socios se activan con un proveedor con licencia.
          </p>
          <p>
            <span className="font-semibold text-paper/70">Retrasos.</span> Los paneles se actualizan con un caché de uno a
            treinta minutos. Las cotizaciones pueden tener retraso y no reflejar precios consolidados. La prima de opciones se
            estima a partir del volumen y el último precio.
          </p>
          <p>
            <span className="font-semibold text-paper/70">No es asesoría.</span> Las señales son información, no
            recomendaciones. La actividad inusual suele ser cobertura. Consulte las{" "}
            <Link href="/es/legal/divulgaciones" className="underline underline-offset-2 hover:text-paper">
              divulgaciones
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
