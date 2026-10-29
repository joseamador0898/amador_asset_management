import type { Metadata } from "next";
import { Monogram } from "@/components/brand/Logo";
import { ButtonLink, CircleArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { routeAlternates } from "@/lib/i18n";
import { fund, site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Acerca de Amador Asset Management: la firma",
  description: `${site.name} es una firma de inversión independiente construida sobre investigación, disciplina de riesgo y transparencia.`,
  alternates: routeAlternates("es", "/firm"),
};

const VALUES = [
  { title: "El riesgo antes que el rendimiento", body: "Empezamos cada decisión por lo que puede salir mal y cuánto puede costar. El rendimiento es lo que queda después de sobrevivir." },
  { title: "Evidencia sobre narrativa", body: "Probamos con muchas semillas, regímenes y costos, y publicamos las limitaciones y los resultados negativos junto con los aciertos." },
  { title: "Transparencia", body: "Los métodos, las fuentes y los retrasos se declaran. Cuando nos equivocamos, lo decimos por escrito." },
  { title: "Alineación", body: "Pretendemos invertir junto a nuestros clientes y mantener incentivos tan simples que se expliquen en una frase." },
  { title: "Independencia", body: "Sin estante de productos que llenar ni visión de la casa que defender. Nuestro único mandato es la calidad de la decisión." },
  { title: "Paciencia", body: "Componer premia a quien sigue en el juego. Preferimos ser constantes por décadas que brillantes por un trimestre." },
];

const HOW = [
  { step: "Investigar", body: "Formular hipótesis falsables, probarlas fuera de muestra y entre regímenes, y publicar lo que aprendemos." },
  { step: "Construir", body: "Asignar riesgo, no dólares, entre estaciones económicas y grupos de correlación." },
  { step: "Controlar", body: "Dimensionar las posiciones para sobrevivir a los malos resultados; comprometer de antemano límites, rebalanceo y reglas de salida." },
  { step: "Reportar", body: "Explicar a los clientes el posicionamiento, el riesgo y los errores en lenguaje llano y con una cadencia regular." },
];

export default function FirmPageEs() {
  return (
    <>
      <JsonLd data={pageGraph("AboutPage", "La firma", "/es/firma", "es")} />
      <PageHero
        eyebrow="La firma"
        title={
          <>
            Una firma independiente, <em className="italic">construida sobre evidencia.</em>
          </>
        }
        intro={`${site.name} investiga, construye y explica portafolios diseñados para perdurar. Combinamos métodos de nivel académico con disciplina de riesgo práctica, y pensamos en público.`}
      />

      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Nuestro nombre</p>
          </div>
          <Reveal className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-8">
            <p className="display text-3xl leading-snug text-ink md:text-[2.6rem]">
              <em>Amador</em> es quien ama. Amamos el oficio: el trabajo paciente y poco glamoroso de construir portafolios que
              resisten.
            </p>
            <p>
              Pusimos un apellido en la puerta porque la responsabilidad debe ser personal. Cada investigación que publicamos,
              cada señal que mostramos y cada portafolio que gestionamos lleva ese nombre, y la responsabilidad que lo acompaña.
            </p>
            <p>
              Nuestro fondo insignia, el Fondo Nautilus de Amador, toma su nombre de una criatura que ha sobrevivido a todas las
              tormentas que ha producido el océano. Su lema también es el nuestro: <em>{fund.taglineEs}</em>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper-2">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Liderazgo" title="Fundador" />
          <div className="mt-14 grid gap-10 border-t border-ink pt-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="grid aspect-[4/5] max-w-sm place-items-center bg-ink text-paper">
                <Monogram className="h-28 w-28" horizon="var(--color-brass-light)" />
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="font-serif text-4xl font-light">{site.founder.name}</p>
              <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brass">Fundador y director de inversiones</p>
              <div className="mt-8 max-w-2xl space-y-5 leading-relaxed text-ink/80">
                <p>
                  Jose Luis dirige la investigación y el diseño de portafolios de la firma. Su trabajo se centra en la construcción
                  de portafolios, el aprendizaje automático aplicado a la asignación de activos y el contenido informativo de los
                  mercados, incluidos los mercados de predicción.
                </p>
                <p>
                  Es autor de la investigación sobre Paridad de Riesgo Jerárquica Diferenciable (DHRP), una extensión aprendible de
                  la paridad de riesgo jerárquica evaluada en ocho universos de activos con barras de error de diez semillas, y de
                  un recuento honesto de dónde las señales de texto con IA no ayudaron.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-6">
                <CircleArrowLink href="/es/analisis/deep-hrp-paridad-de-riesgo-jerarquica-aprendible" label="Leer la investigación DHRP" />
                <CircleArrowLink href="/es/reservar" label="Agendar una conversación" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Valores" title="Lo que no negociamos." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 70} className="bg-paper p-8 md:p-10">
                <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 font-serif text-3xl font-light">{v.title}</p>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain bg-ink text-paper">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Cómo trabajamos" title="Cuatro pasos, siempre." tone="light" />
          <ol className="mt-14 grid gap-10 md:grid-cols-4">
            {HOW.map((h, i) => (
              <Reveal as="li" key={h.step} delay={i * 80} className="border-t border-brass-light/60 pt-6">
                <p className="font-mono text-sm text-brass-light">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-4 font-serif text-3xl font-light">{h.step}</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">{h.body}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-16 flex flex-wrap gap-3">
            <ButtonLink href="/es/enfoque" variant="light">
              Nuestro enfoque a fondo
            </ButtonLink>
            <ButtonLink href="/es/contacto" variant="outline-light">
              Contáctenos
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
