import type { Metadata } from "next";
import Link from "next/link";
import { Nautilus } from "@/components/art/Nautilus";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { FundGate } from "@/components/fund/FundGate";
import { FundInterestForm } from "@/components/forms/FundInterestForm";
import { routeAlternates } from "@/lib/i18n";
import { fund, site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

const FUND_ES = "Fondo Nautilus de Amador";

export const metadata: Metadata = {
  title: `${FUND_ES}: el fondo insignia`,
  description: `${FUND_ES} (prelanzamiento): una estrategia multiactivo con riesgo balanceado para todas las estaciones económicas. ${fund.taglineEs}`,
  alternates: routeAlternates("es", "/fund"),
};

const ENVIRONMENTS = [
  { title: "Crecimiento al alza", assets: ["Acciones", "Crédito corporativo", "Materias primas", "Activos de mercados emergentes"] },
  { title: "Crecimiento a la baja", assets: ["Bonos gubernamentales nominales", "Bonos ligados a la inflación", "Duración de alta calidad"] },
  { title: "Inflación al alza", assets: ["Bonos ligados a la inflación", "Materias primas y oro", "Activos reales"] },
  { title: "Inflación a la baja", assets: ["Acciones", "Bonos gubernamentales nominales"] },
];

const PILLARS = [
  {
    title: "Núcleo con riesgo balanceado",
    body: "El capital se asigna de modo que ninguna estación económica domine el riesgo del portafolio: las exposiciones tipo acciones, tipo tasas y sensibles a la inflación llevan cada una una porción deliberada.",
  },
  {
    title: "Asignación jerárquica",
    body: "Dentro de cada segmento, los pesos siguen cómo se agrupan realmente los activos por correlación, a partir de nuestra investigación publicada sobre paridad de riesgo jerárquica y su extensión aprendible, DHRP.",
  },
  {
    title: "Disciplina de drawdown",
    body: "Objetivos de volatilidad, límites de exposición y reglas de rebalanceo comprometidas de antemano, diseñados para mantener el portafolio estable cuando los mercados no lo están.",
  },
  {
    title: "Líquido y transparente",
    body: "La estrategia pretende usar instrumentos líquidos cotizados en bolsa, con cartas periódicas que expliquen el posicionamiento, el riesgo y los errores en lenguaje llano.",
  },
];

const TERMS = [
  ["Vehículo", `${fund.legalName} (sociedad limitada de Delaware, anticipada)`],
  ["Estrategia", "Multiactivo, riesgo balanceado, todas las estaciones"],
  ["Gestor de inversiones", `${site.name}; estatus regulatorio por confirmar antes del lanzamiento`],
  ["Inversionistas elegibles", "Solo inversionistas acreditados y otros inversionistas elegibles"],
  ["Inversión mínima", "Por anunciar"],
  ["Comisiones", "Por anunciar"],
  ["Liquidez", "Por anunciar"],
  ["Proveedores de servicios", "Administrador, auditor y asesores legales por designar"],
  ["Reportes", "Cartas mensuales y reportes trimestrales (anticipado)"],
];

const TIMELINE = [
  { phase: "Investigación y diseño", status: "En curso", body: "Investigación de la estrategia, marco de riesgo y el benchmark DHRP-8." },
  { phase: "Constitución", status: "Siguiente", body: "Entidad del fondo, documentos de oferta, proveedores de servicios y programa de cumplimiento." },
  { phase: "Primer cierre", status: "Planeado", body: "Capital inicial de inversionistas fundadores que registren interés." },
  { phase: "Lanzamiento y reportes", status: "Planeado", body: "Comienza la operación; cartas mensuales y reportes trimestrales a inversionistas." },
];

const FAQ = [
  {
    q: "¿El fondo está abierto a inversión?",
    a: "Todavía no. El fondo está en preparación. Registrar interés no es vinculante y nos permite contactarle cuando los materiales de oferta estén disponibles para inversionistas elegibles.",
  },
  {
    q: "¿Quién podrá invertir?",
    a: "Solo inversionistas que cumplan los requisitos de elegibilidad aplicables, como los inversionistas acreditados en Estados Unidos, mediante documentos de oferta definitivos. Los requisitos varían según la jurisdicción.",
  },
  {
    q: "¿Cómo se relaciona el fondo con Amador Señales y Análisis?",
    a: "Señales y Análisis son productos públicos de investigación y datos. No son un registro de las posiciones del fondo, y nada de lo publicado ahí es una recomendación.",
  },
  {
    q: "¿Mostrarán backtests o rendimientos proyectados?",
    a: "No en este sitio. Cualquier información de rendimiento se proporcionará solo como lo permitan las regulaciones aplicables, con la metodología y las limitaciones divulgadas.",
  },
];

export default function FundPageEs() {
  return (
    <>
      <JsonLd data={pageGraph("WebPage", FUND_ES, "/es/fondo", "es")} />
      <section className="relative overflow-hidden bg-sea text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,169,110,0.18),transparent_55%)]" aria-hidden />
        <div className="container-x relative grid gap-10 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow text-brass-light">El fondo insignia · Prelanzamiento</p>
            <h1 className="display mt-6 text-6xl md:text-8xl">{FUND_ES}</h1>
            <p className="mt-8 font-serif text-3xl font-light italic">{fund.taglineEs}</p>
            <p className="mt-1 font-serif text-2xl font-light text-paper/60">{fund.taglineEn}</p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/75">
              Una estrategia multiactivo con riesgo balanceado para todas las estaciones, en preparación: diseñada para mantener
              el rumbo entre regímenes de crecimiento e inflación en lugar de ganar un pronóstico en particular.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#registro" variant="light">
                Registrar interés
              </ButtonLink>
              <ButtonLink href="/es/reservar" variant="outline-light">
                Hable con nosotros
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Nautilus className="mx-auto w-full max-w-[460px] text-paper/85" />
          </div>
        </div>
      </section>

      <FundGate lang="es">
        {/* Por qué el nombre */}
        <section className="border-b border-line">
          <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-brass">Por qué “Nautilus”</p>
              <p className="mt-6 font-serif text-xl italic text-muted">Casi la misma palabra en inglés y en español.</p>
            </div>
            <Reveal className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-8">
              <p className="display text-3xl leading-snug text-ink md:text-4xl">
                El nautilo no le gana a la tormenta nadando más rápido. Ajusta el equilibrio de sus cámaras y mantiene su
                profundidad.
              </p>
              <p>
                Su linaje ha cruzado cerca de quinientos millones de años de océano, a través de eras de hielo y extinciones
                masivas. El animal regula su flotabilidad moviendo fluido dentro y fuera de cámaras selladas, y su concha crece
                como una espiral logarítmica: cada cámara nueva es mayor que la anterior y se construye sobre todo lo que la
                precede.
              </p>
              <p>
                Ese es el portafolio que estamos construyendo: balanceado en cada estación económica, rebalanceado con disciplina
                y componiendo cámara por cámara. Lo decimos en cuatro palabras: <em>firme en mar fuerte</em>.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Todas las estaciones */}
        <section className="bg-paper-2">
          <div className="container-x py-20 md:py-28">
            <SectionHeader
              eyebrow="Para todas las estaciones, por diseño"
              title="Balancear el riesgo, no los dólares."
              intro="Los mercados se mueven entre entornos de crecimiento al alza o a la baja y de inflación al alza o a la baja. Distintos activos han tendido a comportarse bien en cada uno. Un portafolio tradicional 60/40 concentra la mayor parte de su riesgo en acciones, y por lo tanto en un solo entorno. Nuestro objetivo es repartir el riesgo deliberadamente entre los cuatro."
            />
            <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
              {ENVIRONMENTS.map((e, i) => (
                <Reveal key={e.title} delay={i * 70} className="bg-paper p-8">
                  <p className="font-mono text-xs text-sea">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-5 font-serif text-2xl">{e.title}</p>
                  <ul className="mt-5 space-y-2 text-sm text-muted">
                    {e.assets.map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden /> {a}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted">
              Tendencias históricas estilizadas con fines ilustrativos, no predicciones. Las relaciones entre clases de activos
              cambian, como mostró 2022 cuando acciones y bonos cayeron juntos. Vea{" "}
              <Link href="/es/analisis/las-cuatro-estaciones-de-la-economia" className="underline underline-offset-2">
                Las cuatro estaciones de la economía
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Pilares */}
        <section>
          <div className="container-x py-20 md:py-28">
            <SectionHeader eyebrow="Estrategia (anticipada)" title="Cuatro compromisos de diseño." />
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 60} className="border-t border-ink pt-6">
                  <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-4 font-serif text-3xl font-light">{p.title}</p>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Términos y cronograma */}
        <section className="border-t border-line bg-paper-2">
          <div className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-brass">Términos indicativos</p>
              <h2 className="display mt-5 text-4xl">Datos clave</h2>
              <dl className="mt-10 border-t border-ink">
                {TERMS.map(([k, v]) => (
                  <div key={k} className="grid gap-2 border-b border-line py-4 sm:grid-cols-3">
                    <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">{k}</dt>
                    <dd className="sm:col-span-2">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted">Todos los términos son indicativos, están sujetos a cambios y a los documentos de oferta definitivos.</p>
            </div>
            <div className="lg:col-span-5">
              <p className="eyebrow text-brass">Camino al lanzamiento</p>
              <h2 className="display mt-5 text-4xl">Cronograma</h2>
              <ol className="mt-10 space-y-8 border-l border-ink/30 pl-8">
                {TIMELINE.map((t) => (
                  <li key={t.phase} className="relative">
                    <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-paper-2 bg-sea" aria-hidden />
                    <p className="flex items-center gap-3">
                      <span className="font-serif text-2xl">{t.phase}</span>
                      <span className="border border-ink/20 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted">{t.status}</span>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section className="border-t border-line">
          <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-brass">Preguntas</p>
              <h2 className="display mt-5 text-4xl">Preguntas frecuentes para inversionistas</h2>
            </div>
            <div className="divide-y divide-line border-y border-line lg:col-span-8">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl">
                    {f.q}
                    <span className="text-2xl font-light text-brass transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </FundGate>

      {/* Registro */}
      <section id="registro" className="scroll-mt-28 bg-ink text-paper">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brass-light">Portal del inversionista · prelanzamiento</p>
            <h2 className="display mt-5 text-5xl">Registre su interés.</h2>
            <p className="mt-6 leading-relaxed text-paper/65">
              Los inversionistas fundadores serán los primeros en conocer los documentos de oferta, el primer cierre y los eventos
              para inversionistas. El registro no es vinculante. Un portal completo para inversionistas abrirá en el lanzamiento.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FundInterestForm lang="es" />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="container-x py-10 text-xs leading-relaxed text-muted">
          <p>
            <strong className="font-semibold text-ink">Información importante.</strong> {fund.legalName} no se ha constituido ni
            registrado, y no ha comenzado ninguna oferta. Esta página tiene fines exclusivamente informativos y no es una oferta de
            venta ni una solicitud de oferta de compra de valor alguno, lo cual solo puede hacerse mediante documentos de oferta
            definitivos a inversionistas elegibles, donde la ley lo permita. Las descripciones de la estrategia reflejan intenciones
            actuales y pueden cambiar. Invertir implica riesgo, incluida la posible pérdida del capital; las estrategias con riesgo
            balanceado y apalancadas conllevan riesgos específicos, incluidos rompimientos de correlación y riesgo de liquidez.
            Consulte las{" "}
            <Link href="/es/legal/divulgaciones" className="underline underline-offset-2">
              Divulgaciones importantes
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
