import type { Metadata } from "next";
import Link from "next/link";
import { Dendrogram } from "@/components/art/Dendrogram";
import { ButtonLink, CircleArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { routeAlternates } from "@/lib/i18n";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Nuestro enfoque: proceso sobre predicción",
  description:
    "Cómo Amador investiga, construye y controla el riesgo: balance para todas las estaciones, asignación jerárquica y un estándar de evidencia que reporta fallas.",
  alternates: routeAlternates("es", "/approach"),
};

const PROCESS = [
  {
    title: "Investigar",
    lead: "Ideas falsables, probadas fuera de muestra.",
    points: ["Cada hipótesis declara qué la refutaría", "Entrenar, validar y probar en periodos separados, con purgas entre ellos", "Diez semillas para cualquier modelo con aleatoriedad", "Costos de transacción y rotación incluidos desde el primer día"],
  },
  {
    title: "Construir",
    lead: "Asignar riesgo, no dólares.",
    points: ["Balancear el riesgo entre regímenes de crecimiento e inflación", "Agrupar activos por correlación; presupuestar el riesgo jerarquía abajo", "Preferir estimadores robustos a optimizadores frágiles", "Liquidez dimensionada para la peor semana, no para la promedio"],
  },
  {
    title: "Controlar",
    lead: "Sobrevivir primero, luego componer.",
    points: ["Objetivos de volatilidad y límites de exposición", "Dimensionamiento fraccional: Kelly es un techo, nunca un objetivo", "Rebalanceo y revisiones de drawdown comprometidos de antemano", "Pruebas de estrés con choques históricos e hipotéticos"],
  },
  {
    title: "Revisar",
    lead: "Escribirlo todo, sobre todo los errores.",
    points: ["Post mortem de cada decisión cerrada", "Cartas periódicas que explican posicionamiento y riesgo", "Investigación pública, incluidos los resultados negativos", "Cambios de modelo registrados y revalidados"],
  },
];

const STANDARD = [
  { k: "Ratio de Sharpe probabilístico", v: "¿Es probable que el ratio de Sharpe sea positivo, dados el sesgo, las colas gruesas y una muestra corta?" },
  { k: "Ratio de Sharpe deflactado", v: "¿Sobrevive después de considerar cuántas estrategias se probaron?" },
  { k: "Probabilidad de sobreajuste del backtest", v: "¿El ganador dentro de muestra sigue ganando fuera de muestra?" },
  { k: "Pruebas pareadas contra referencias", v: "¿Es mejor que alternativas simples, no solo mejor que cero?" },
  { k: "Barras de error con varias semillas", v: "¿Otra semilla aleatoria habría contado otra historia?" },
  { k: "Sensibilidad a costos", v: "¿A qué costo de operación desaparece la ventaja?" },
];

export default function ApproachPageEs() {
  return (
    <>
      <JsonLd data={pageGraph("WebPage", "Nuestro enfoque", "/es/enfoque", "es")} />
      <PageHero
        eyebrow="Enfoque"
        title={
          <>
            Proceso sobre <em className="italic">predicción.</em>
          </>
        }
        intro="No podemos saber qué estación viene después. Sí podemos construir portafolios que no necesiten saberlo, y exigirnos un estándar de evidencia lo bastante estricto para atrapar nuestros propios errores."
      />

      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="El proceso de inversión" title="Investigar, construir, controlar, revisar." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 80} className="bg-paper p-8 md:p-12">
                <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 font-serif text-4xl font-light">{p.title}</p>
                <p className="mt-2 text-lg text-muted">{p.lead}</p>
                <ul className="mt-6 space-y-3 text-[0.95rem]">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-brass" aria-hidden />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain bg-ink text-paper">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brass-light">Nuestra investigación</p>
            <h2 className="display mt-6 text-5xl">Jerarquías que aprenden.</h2>
            <p className="mt-6 leading-relaxed text-paper/65">
              La paridad de riesgo jerárquica agrupa los activos según cómo se mueven juntos y reparte el riesgo por ese árbol,
              evitando la frágil inversión de matrices que hay detrás de la optimización clásica de media-varianza. Nuestra
              investigación DHRP hace la jerarquía diferenciable, de modo que puede entrenarse de principio a fin, y luego la
              prueba en ocho universos de activos con diez semillas, publicando dónde funciona y dónde no.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <CircleArrowLink href="/es/analisis/deep-hrp-paridad-de-riesgo-jerarquica-aprendible" label="Deep HRP" tone="light" />
              <CircleArrowLink href="/es/analisis/paridad-de-riesgo-jerarquica-explicada" label="HRP explicada" tone="light" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <Dendrogram className="w-full text-paper/80" />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Estándar de evidencia</p>
            <h2 className="display mt-5 text-4xl md:text-5xl">Seis preguntas que todo backtest debe responder.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              La mayoría de los backtests son halagadores por construcción. Estas pruebas son nuestra manera de ser menos
              halagadores con nosotros mismos.
            </p>
            <Link href="/es/analisis/como-leer-un-backtest-con-escepticismo" className="link-underline mt-6 inline-block text-sm font-semibold">
              Cómo leer un backtest con escepticismo →
            </Link>
          </div>
          <dl className="divide-y divide-line border-y border-ink lg:col-span-8">
            {STANDARD.map((s) => (
              <div key={s.k} className="grid gap-2 py-6 md:grid-cols-5">
                <dt className="font-serif text-xl md:col-span-2">{s.k}</dt>
                <dd className="text-muted md:col-span-3">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="container-x flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between">
          <p className="display max-w-2xl text-4xl">Vea el enfoque aplicado a su portafolio.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/es/reservar">Agendar una revisión de portafolio</ButtonLink>
            <ButtonLink href="/es/fondo" variant="outline">
              El Fondo Nautilus
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
