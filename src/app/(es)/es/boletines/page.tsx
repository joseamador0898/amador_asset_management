import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BellRing, CalendarClock, FileText, LineChart, Newspaper, Scale, Waves } from "lucide-react";
import { CircleArrowLink } from "@/components/ui/Button";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { AlertList } from "@/components/signals/AlertList";
import { MorningNote } from "@/components/signals/MorningNote";
import { routeAlternates } from "@/lib/i18n";
import { getGsMacro } from "@/lib/signals";
import { buildGsAlerts } from "@/lib/signals/alerts";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Boletines y alertas de mercado por correo",
  description:
    "Resumen diario, memo semanal, alertas de opciones inusuales y compras de insiders, probabilidades macro y novedades del Fondo Nautilus, por correo.",
  alternates: routeAlternates("es", "/briefings"),
};

// Cada producto enlaza al artículo que explica cómo leemos esa señal.
const PRODUCTS = [
  { icon: Newspaper, name: "Resumen diario", cadence: "Días hábiles · 7:30 a. m., hora del centro de EE. UU.", body: "Lo que se movió durante la noche en acciones, tasas, materias primas, divisas y cripto, la agenda del día y una gráfica que importa.", link: { href: "/es/senales", label: "Ver el panel en vivo" } },
  { icon: FileText, name: "Memo semanal", cadence: "Domingos", body: "Un marco o una idea de investigación, bien explicados: el razonamiento de fondo detrás de cómo construimos portafolios.", link: { href: "/es/analisis/el-marco-amador", label: "Leer el Marco Amador" } },
  { icon: Waves, name: "Actividad inusual en opciones", cadence: "Resumen diario después del cierre", body: "Los contratos más grandes que operan muy por encima del interés abierto, con contexto: ¿cobertura, spread o apuesta direccional?", link: { href: "/es/analisis/como-leer-el-flujo-de-opciones", label: "Cómo leemos el flujo de opciones" } },
  { icon: BellRing, name: "Compras de insiders", cadence: "Según se reportan · resumen diario", body: "Compras en el mercado abierto tomadas de los Form 4 de la SEC; se señalan las compras en grupo y se filtran las ventas y los otorgamientos rutinarios.", link: { href: "/es/analisis/que-dicen-las-compras-de-insiders", label: "Qué dicen las compras de insiders" } },
  { icon: Scale, name: "Macro y mercados de predicción", cadence: "Al activarse · en torno al FOMC, la inflación y el empleo", body: "Alertas sobre las condiciones financieras, el nowcast de crecimiento y las sorpresas de datos de Goldman Sachs, y lo que implican los mercados de predicción en cada dato importante.", link: { href: "/es/analisis/indices-de-condiciones-financieras-explicados", label: "Las condiciones financieras, explicadas" } },
  { icon: LineChart, name: "Artículos de investigación", cadence: "Al publicarse", body: "Nueva investigación de Amador, como nuestro trabajo sobre Deep HRP, con un resumen en lenguaje llano y el artículo completo.", link: { href: "/es/analisis/deep-hrp-paridad-de-riesgo-jerarquica-aprendible", label: "Leer el artículo de Deep HRP" } },
  { icon: CalendarClock, name: "Novedades del Fondo Nautilus", cadence: "Solo hitos", body: "Calendario de lanzamiento, eventos para inversionistas y disponibilidad de la oferta, para inversionistas elegibles que lo soliciten.", link: { href: "/es/fondo", label: "Sobre el Fondo Nautilus" } },
];

/** Alertas en vivo de la fuente de Goldman Sachs, con el comentario de IA. Oculto si la fuente está apagada. */
async function LatestAlerts() {
  const gs = await getGsMacro();
  if (!gs) return null;
  const alerts = buildGsAlerts(gs.data, "es");
  if (!alerts.length) return null;
  return (
    <section className="border-b border-line">
      <div className="container-x grid gap-12 py-20 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-brass">Alertas recientes</p>
          <h2 className="display mt-5 text-4xl md:text-5xl">Lo que señalan las alertas ahora.</h2>
          <p className="mt-5 leading-relaxed text-muted">
            Alertas basadas en reglas sobre indicadores macro y pronósticos de GIR de Goldman Sachs, actualizadas durante el día
            y ordenadas por prioridad.
          </p>
          <CircleArrowLink href="/es/senales" label="Abrir Señales" className="mt-8" />
        </div>
        <div className="space-y-8 lg:col-span-8">
          <MorningNote tone="light" lang="es" />
          <AlertList alerts={alerts} tone="light" limit={5} lang="es" />
          <p className="text-[0.66rem] leading-relaxed text-muted">
            Datos de Goldman Sachs © Goldman Sachs. Los pronósticos son de GIR, no de Amador. Solo informativo; no es asesoría
            de inversión.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function BriefingsPageEs() {
  return (
    <>
      <JsonLd data={pageGraph("WebPage", "Boletines y alertas", "/es/boletines", "es")} />
      <PageHero
        eyebrow="Boletines y alertas"
        title={
          <>
            Nuestra investigación, <em className="italic">a su ritmo.</em>
          </>
        }
        intro="Elija exactamente lo que llega a su correo: un resumen matutino, un memo semanal o alertas por eventos de Amador Señales. Sin ruido, sin recomendaciones y con baja en un clic."
      />

      <Suspense fallback={null}>
        <LatestAlerts />
      </Suspense>

      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Los boletines" title="Siete productos. Elija los que quiera." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 60} className="flex flex-col bg-paper p-8">
                <p.icon className="h-6 w-6 text-brass" aria-hidden />
                <p className="mt-6 font-serif text-2xl">{p.name}</p>
                <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">{p.cadence}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{p.body}</p>
                <Link href={p.link.href} className="link-underline mt-5 self-start text-sm font-medium text-ink">
                  {p.link.label}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="alerts" className="scroll-mt-28 border-t border-line">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Suscribirse</p>
            <h2 className="display mt-5 text-5xl">Configure sus boletines.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Gratis durante la beta. Agregue una lista de seguimiento para que sus tickers aparezcan en las alertas de insiders y
              de opciones.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Por ahora, los boletines se envían en inglés. Los análisis del sitio, el panel de Señales y las alertas en pantalla
              ya están en español.
            </p>
          </div>
          <div className="lg:col-span-8">
            <SubscribeForm defaultTopics={["daily-brief", "weekly-memo", "insider-alerts"]} lang="es" />
          </div>
        </div>
      </section>
    </>
  );
}
