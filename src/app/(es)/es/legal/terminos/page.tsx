import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { routeAlternates } from "@/lib/i18n";
import { site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Términos de uso del sitio de Amador",
  description: "Los términos para usar el sitio de Amador Asset Management, incluidos los datos de Amador Señales, la investigación, las consultas y los boletines.",
  alternates: routeAlternates("es", "/legal/terms"),
};

export default function TermsPageEs() {
  return (
    <LegalPage title="Términos de uso" updated="19 de octubre de 2026" current="/es/legal/terminos" lang="es">
      <JsonLd data={pageGraph("WebPage", "Términos de uso", "/es/legal/terminos", "es")} />
      <p>Al usar este sitio usted acepta estos términos. Si no está de acuerdo, por favor no use el sitio.</p>

      <h2>Uso exclusivamente informativo</h2>
      <p>
        El sitio y su contenido se proporcionan con fines de información general y educación. No son asesoría ni una oferta o
        solicitud. Por favor lea nuestras <Link href="/es/legal/divulgaciones">Divulgaciones importantes</Link>.
      </p>

      <h2>Uso permitido</h2>
      <p>
        Puede ver el contenido y compartir enlaces a él con fines personales y no comerciales. No puede extraer de forma
        automatizada, copiar, revender ni redistribuir los datos que se muestran en Amador Señales, que se obtienen bajo licencia
        de terceros o se les atribuyen, ni usar el sitio de una forma que lo interrumpa o infrinja los derechos de otros.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, gráficos, la investigación y el diseño de este sitio son propiedad de {site.name} o de sus licenciantes. Los
        nombres, marcas y datos de terceros pertenecen a sus dueños.
      </p>

      <h2>Sin garantías</h2>
      <p>
        El sitio se proporciona «tal cual» y «según disponibilidad». No garantizamos que el contenido o los datos sean exactos,
        completos, oportunos o ininterrumpidos, y podemos cambiar o retirar contenido en cualquier momento.
      </p>

      <h2>Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley, {site.name} no es responsable de ninguna pérdida derivada del uso del sitio o de
        su contenido, o de la confianza depositada en ellos, incluida cualquier decisión de inversión.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes del Estado de Illinois, sin considerar sus normas sobre conflicto de leyes, salvo
        cuando su legislación local exija otra cosa.
      </p>

      <h2>Contacto</h2>
      <p>
        ¿Preguntas sobre estos términos? <Link href="/es/contacto">Contáctenos</Link>.
      </p>
    </LegalPage>
  );
}
