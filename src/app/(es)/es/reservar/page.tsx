import type { Metadata } from "next";
import Link from "next/link";
import { Lock, MessagesSquare, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/Section";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { routeAlternates } from "@/lib/i18n";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Agendar una consulta de inversión",
  description: "Agende una llamada inicial, una revisión de portafolio, una presentación del Fondo Nautilus o una conversación con medios con Amador Asset Management.",
  alternates: routeAlternates("es", "/book"),
};

const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK; // p. ej. "amador/discovery" para un calendario de Cal.com en vivo

const NOTES = [
  { icon: MessagesSquare, title: "Qué esperar", body: "Una conversación estructurada: sus objetivos, sus restricciones y su asignación actual, y cómo los pensaríamos nosotros. Se lleva notas en cualquier caso." },
  { icon: Lock, title: "Confidencial", body: "Tratamos lo que comparte como confidencial. Por favor no envíe números de cuenta ni contraseñas por ningún formulario." },
  { icon: ShieldCheck, title: "Sin compromiso", body: "Las consultas son informativas. Cualquier contratación de asesoría requiere un contrato por escrito y los registros aplicables." },
];

const READS = [
  { href: "/es/enfoque", title: "Nuestro enfoque", body: "Investigar, construir, controlar, revisar: cómo construimos portafolios y a qué estándar los sometemos." },
  { href: "/es/analisis/el-marco-amador", title: "El Marco Amador", body: "Las cinco preguntas que hacemos antes de que una posición reciba capital, desde qué la refutaría hasta cómo dimensionarla." },
  { href: "/es/analisis/la-aritmetica-de-los-drawdowns", title: "La aritmética de los drawdowns", body: "Por qué las pérdidas pesan más que las ganancias, y por qué el tamaño parte del drawdown que se puede sobrevivir." },
];

export default function BookPageEs() {
  return (
    <>
      <JsonLd data={pageGraph("WebPage", "Agendar una consulta", "/es/reservar", "es")} />
      <PageHero
        eyebrow="Consultas"
        title={
          <>
            Hablemos de <em className="italic">su portafolio.</em>
          </>
        }
        intro="Elija una conversación y un horario que le acomoden. Confirmamos personalmente cada solicitud por correo en un día hábil."
      />
      <section className="bg-paper-2">
        <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {calLink ? (
              <iframe
                src={`https://cal.com/${calLink}?embed=true&theme=light`}
                title="Agendar con Amador Asset Management"
                className="h-[720px] w-full border border-line bg-white"
              />
            ) : (
              <BookingFlow lang="es" />
            )}
          </div>
          <aside className="space-y-10 lg:col-span-4">
            {NOTES.map((b) => (
              <div key={b.title} className="border-t border-ink pt-6">
                <b.icon className="h-5 w-5 text-brass" aria-hidden />
                <p className="mt-4 font-serif text-2xl">{b.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="container-x grid gap-10 py-16 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Antes de hablar</p>
            <h2 className="display mt-5 text-4xl">Cómo pensamos, en tres lecturas.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Una consulta rinde más cuando ya conoce nuestro proceso. Estas tres páginas responden la mayoría de las preguntas
              que la gente trae a una primera conversación.
            </p>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-3 lg:col-span-8">
            {READS.map((r) => (
              <li key={r.href} className="bg-paper-2 p-6">
                <Link href={r.href} className="link-underline font-serif text-xl text-ink">
                  {r.title}
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
