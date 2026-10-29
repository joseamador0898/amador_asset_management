import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { routeAlternates } from "@/lib/i18n";
import { site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contactar a Amador Asset Management",
  description: `Contacte a ${site.name}: asesoría, el Fondo Nautilus, medios, colaboraciones de investigación y carreras. Puede escribirnos en español.`,
  alternates: routeAlternates("es", "/contact"),
};

export default function ContactPageEs() {
  return (
    <>
      <JsonLd data={pageGraph("ContactPage", "Contacto", "/es/contacto", "es")} />
      <PageHero
        eyebrow="Contacto"
        title="Iniciemos una conversación."
        intro="Cuéntenos en qué está trabajando. Leemos cada mensaje y respondemos la mayoría en un día hábil. Puede escribirnos en español o en inglés."
      />
      <section>
        <div className="container-x grid gap-16 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm lang="es" />
            <div className="mt-14 border-t border-line pt-8">
              <h2 className="font-serif text-2xl">Qué pasa después</h2>
              <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                <li>
                  <span className="font-semibold text-ink">Lo leemos.</span> Los mensajes llegan directo a nuestro correo; no hay una
                  fila de tickets.
                </li>
                <li>
                  <span className="font-semibold text-ink">Respondemos en un día hábil,</span> normalmente con una respuesta y a veces
                  con una pregunta o un horario para hablar.
                </li>
                <li>
                  <span className="font-semibold text-ink">Sus datos se quedan con nosotros.</span> Los usamos para responder y nunca
                  los vendemos; el{" "}
                  <Link href="/es/legal/privacidad" className="text-ink underline underline-offset-2">
                    aviso de privacidad
                  </Link>{" "}
                  explica el resto.
                </li>
              </ol>
            </div>
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Oficina</p>
              <p className="mt-3 font-serif text-2xl">{site.location}</p>
              {site.email && (
                <a href={`mailto:${site.email}`} className="link-underline mt-2 inline-block">
                  {site.email}
                </a>
              )}
            </div>
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">¿Prefiere hablar?</p>
              <p className="mt-3 leading-relaxed text-muted">
                <Link href="/es/reservar" className="text-ink underline underline-offset-2">
                  Agende una consulta
                </Link>{" "}
                y elija un horario directamente.
              </p>
            </div>
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Inversionistas</p>
              <p className="mt-3 leading-relaxed text-muted">
                ¿Le interesa el Fondo Nautilus?{" "}
                <Link href="/es/fondo#registro" className="text-ink underline underline-offset-2">
                  Registre su interés
                </Link>
                .
              </p>
            </div>
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">¿Busca otra cosa?</p>
              <p className="mt-3 leading-relaxed text-muted">
                Nuestra investigación está en{" "}
                <Link href="/es/analisis" className="text-ink underline underline-offset-2">
                  Análisis
                </Link>
                , el panel de mercados en vivo es{" "}
                <Link href="/es/senales" className="text-ink underline underline-offset-2">
                  Amador Señales
                </Link>
                , y los{" "}
                <Link href="/es/boletines" className="text-ink underline underline-offset-2">
                  boletines y alertas
                </Link>{" "}
                por correo no requieren ninguna conversación. Medios, conferencias y colaboraciones de investigación son
                bienvenidos a través del formulario.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
