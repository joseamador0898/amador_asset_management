import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { FUND_NAME, routeAlternates } from "@/lib/i18n";
import { fund, site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Divulgaciones importantes",
  description: "Divulgaciones de Amador: contenido educativo, no asesoría de inversión; datos de terceros; límites de la investigación y un fondo en prelanzamiento.",
  alternates: routeAlternates("es", "/legal/disclosures"),
};

export default function DisclosuresPageEs() {
  return (
    <LegalPage title="Divulgaciones importantes" updated="19 de octubre de 2026" current="/es/legal/divulgaciones" lang="es">
      <JsonLd data={pageGraph("WebPage", "Divulgaciones importantes", "/es/legal/divulgaciones", "es")} />
      <h2>Sin oferta ni asesoría</h2>
      <p>
        El contenido de este sitio, incluidos la investigación, los artículos, los videos, los boletines, las alertas y el panel
        Amador Señales, lo proporciona {site.name} («Amador») con fines exclusivamente informativos y educativos. No constituye
        asesoría de inversión, legal, fiscal ni contable, no toma en cuenta los objetivos, la situación financiera ni las
        necesidades de persona alguna, y no es una recomendación para comprar, vender o mantener valor alguno ni para adoptar
        estrategia alguna.
      </p>
      <p>
        Nada en este sitio es una oferta de venta ni una solicitud de oferta de compra de valor o producto de inversión alguno.
        Los servicios de asesoría, cuando se ofrezcan, se prestarán solo bajo un contrato por escrito y solo después de que Amador
        haya cumplido los requisitos de registro que le sean aplicables o califique para una exención. Ningún registro implica un
        determinado nivel de habilidad o capacitación.
      </p>

      <h2>El {FUND_NAME.es}</h2>
      <p>
        {fund.legalName} no se ha constituido y no ha comenzado ninguna oferta. Las descripciones de su estrategia, términos y
        calendario son preliminares, reflejan intenciones actuales y pueden cambiar. Si se realiza una oferta, se hará únicamente
        a inversionistas elegibles (por ejemplo, inversionistas acreditados en Estados Unidos) mediante un memorándum
        confidencial de colocación privada y documentos relacionados, que contendrán información importante sobre riesgos,
        comisiones y conflictos de interés. Registrar interés no es vinculante y no reserva una asignación.
      </p>

      <h2>Investigación, backtests y resultados hipotéticos</h2>
      <p>
        La investigación publicada en este sitio, incluida la investigación sobre Paridad de Riesgo Jerárquica Diferenciable
        (DHRP), reporta resultados hipotéticos y de backtests. El rendimiento hipotético tiene limitaciones inherentes: se prepara
        con el beneficio de la retrospectiva, no refleja operaciones reales ni el efecto de factores económicos y de mercado
        relevantes en la toma de decisiones, y puede no reflejar todas las comisiones, costos y fricciones. No se declara que
        alguna cuenta logrará, o probablemente logrará, resultados similares a los mostrados. Los resultados de investigación no
        son el rendimiento de ningún fondo ni cuenta gestionados por Amador.
      </p>

      <h2>Datos de mercado y contenido de terceros</h2>
      <p>
        Amador Señales muestra datos de terceros, que pueden incluir Alpaca Markets (feed IEX), FRED® (Banco de la Reserva
        Federal de St. Louis), cotizaciones con retraso de Cboe, reportes de SEC EDGAR, Polymarket y, cuando exista licencia,
        Unusual Whales y Goldman Sachs Global Investment Research (vía Marquee). Los datos pueden tener retraso, estar incompletos
        o ser inexactos, y se proporcionan «tal cual», sin garantía. Las cifras de primas de opciones son estimaciones. Si un
        proveedor no está disponible, el panel afectado muestra datos de muestra y se identifica como «Muestra». Las marcas y los
        datos siguen siendo propiedad de sus respectivos dueños, y su aparición no implica respaldo alguno.
      </p>
      <p>
        Algunos resúmenes, como el «Comentario del analista» de Señales, los genera automáticamente un modelo de IA a partir de
        los datos mostrados y pueden contener errores.
      </p>

      <h2>Mercados de predicción</h2>
      <p>
        Los precios de los mercados de predicción se muestran como información sobre probabilidades implícitas por el mercado.
        Amador no facilita la operación de contratos de eventos. La legalidad y la disponibilidad de los mercados de predicción
        varían según la jurisdicción.
      </p>

      <h2>Riesgos</h2>
      <p>
        Toda inversión implica riesgo, incluida la posible pérdida del capital. Las estrategias con riesgo balanceado, apalancadas,
        con derivados y multiactivo están sujetas a riesgo de modelo, rompimientos de correlación (activos que normalmente se
        diversifican entre sí pueden caer juntos), riesgo de liquidez, riesgo de apalancamiento, riesgo de contraparte y el riesgo
        de que las relaciones históricas no persistan. Los activos digitales son muy volátiles y pueden estar sujetos a riesgos
        regulatorios y de custodia adicionales.
      </p>

      <h2>Opiniones y declaraciones a futuro</h2>
      <p>
        Las opiniones corresponden a la fecha de publicación y pueden cambiar sin previo aviso. Las declaraciones a futuro están
        sujetas a incertidumbre, y los resultados reales pueden diferir de forma importante. Amador, su personal o sus afiliados
        pueden tener posiciones en los instrumentos comentados y operarlos sin previo aviso.
      </p>

      <h2>Enlaces</h2>
      <p>Los enlaces a sitios de terceros se proporcionan por conveniencia; Amador no es responsable de su contenido.</p>
    </LegalPage>
  );
}
