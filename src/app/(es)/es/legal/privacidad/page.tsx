import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { routeAlternates } from "@/lib/i18n";
import { site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Aviso de privacidad: cómo tratamos sus datos",
  description: "Cómo Amador recopila y usa información: formularios, analítica sin cookies, cookies de AdSense y cómo desactivarlas, proveedores, conservación y derechos.",
  alternates: routeAlternates("es", "/legal/privacy"),
};

export default function PrivacyPageEs() {
  return (
    <LegalPage title="Aviso de privacidad" updated="22 de octubre de 2026" current="/es/legal/privacidad" lang="es">
      <JsonLd data={pageGraph("WebPage", "Aviso de privacidad", "/es/legal/privacidad", "es")} />
      <p>
        Este aviso explica cómo {site.name} («Amador», «nosotros») recopila y usa información personal a través de este sitio.
      </p>

      <h2>Qué recopilamos</h2>
      <ul>
        <li>
          <strong>Información que usted nos da</strong> en formularios: nombre, correo electrónico y, según el formulario,
          teléfono, empresa, país, perfil de inversionista, interés indicativo, preferencias de consulta, contenido del mensaje y
          preferencias de boletines (incluida cualquier lista de seguimiento).
        </li>
        <li>
          <strong>Información técnica</strong> que procesa nuestro proveedor de hospedaje para entregar y proteger el sitio, como
          la dirección IP, el tipo de navegador y los registros de solicitudes.
        </li>
        <li>
          <strong>Almacenamiento del navegador:</strong> si usted acepta el aviso para inversionistas en la página del fondo, esa
          elección se guarda en el almacenamiento local de su navegador, al igual que el identificador anónimo descrito en
          Analítica. Nuestra analítica no usa cookies. Si se muestran anuncios, Google y sus socios pueden establecer cookies
          publicitarias, como se describe en Publicidad.
        </li>
      </ul>

      <h2>Analítica</h2>
      <p>
        Medimos las visitas con Microsoft Azure Application Insights para saber qué páginas se leen y qué tan rápido cargan. Está
        configurada para recopilar lo menos posible:
      </p>
      <ul>
        <li>Sin cookies. Un identificador aleatorio guardado en el almacenamiento local de su navegador, renovado al menos cada
          395 días, nos permite contar a los visitantes recurrentes sin saber quiénes son.</li>
        <li>Las páginas se registran como plantillas (por ejemplo, /es/analisis/:slug), nunca como direcciones completas,
          términos de búsqueda ni nada de lo que usted escriba. Del sitio que lo envió, solo se conserva su dominio.</li>
        <li>Navegador, sistema operativo, tipo de dispositivo y una ubicación aproximada (país, región y ciudad) que Microsoft
          deriva de su dirección IP, la cual no se conserva completa.</li>
        <li>Los datos de analítica se eliminan después de 30 días.</li>
      </ul>
      <p>
        Si su navegador envía Do Not Track o Global Privacy Control, no se registra nada. También puede desactivar la analítica
        en su navegador en cualquier momento visitando{" "}
        {/* Carga completa a propósito: el script de analítica lee la exclusión de la dirección al cargar la página. */}
        <a href="/es?noanalytics=1" rel="nofollow">amadoram.com/es?noanalytics=1</a>.
      </p>

      <h2>Publicidad</h2>
      <p>
        Podemos mostrar anuncios de Google AdSense. Proveedores externos, incluido Google, usan cookies para mostrar anuncios
        basados en las visitas previas del usuario a este sitio o a otros sitios. El uso de cookies publicitarias permite a
        Google y a sus socios mostrarle anuncios basados en sus visitas a este sitio u otros sitios de internet.
      </p>
      <ul>
        <li>
          Puede desactivar la publicidad personalizada en la{" "}
          <a href="https://adssettings.google.com" rel="noopener noreferrer">Configuración de anuncios</a> de Google, y
          desactivar el uso de cookies de algunos proveedores externos para publicidad personalizada en{" "}
          <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer">aboutads.info</a>.
        </li>
        <li>
          A los visitantes del Espacio Económico Europeo, el Reino Unido y Suiza se les pide su consentimiento mediante una
          plataforma de gestión de consentimiento certificada por Google antes de mostrar anuncios personalizados.
        </li>
        <li>
          Para saber cómo usa Google la información de los sitios que usan sus servicios, consulte{" "}
          <a href="https://policies.google.com/technologies/partner-sites?hl=es" rel="noopener noreferrer">
            Cómo utiliza Google la información de sitios web o aplicaciones que utilizan sus servicios
          </a>
          .
        </li>
      </ul>

      <h2>Cómo la usamos</h2>
      <ul>
        <li>Para responder consultas, agendar reuniones y entregar los boletines y alertas que usted solicite.</li>
        <li>Para contactar a posibles inversionistas sobre el fondo, cuando hayan registrado su interés.</li>
        <li>Para operar, proteger y mejorar el sitio, y para cumplir obligaciones legales y regulatorias.</li>
      </ul>
      <p>No vendemos información personal.</p>

      <h2>Proveedores de servicios</h2>
      <p>
        Usamos proveedores de servicios para hospedar el sitio, medir visitas, enviar correos, administrar listas de suscriptores,
        agendar reuniones y dirigir los formularios a nuestro equipo (por ejemplo, Microsoft Azure para hospedaje y analítica,
        Google para publicidad, un servicio de envío de correo, una herramienta de agenda y automatización de flujos de trabajo).
        Procesan la información en nuestro nombre conforme a sus propios compromisos de seguridad y privacidad.
      </p>
      <p>
        Los videos incrustados se cargan desde el dominio de privacidad mejorada de YouTube solo después de que usted presiona
        reproducir; a partir de ese momento aplica la política de privacidad de YouTube.
      </p>

      <h2>Conservación y sus opciones</h2>
      <p>
        Conservamos la información el tiempo necesario para los fines anteriores o el que exija la ley. Cada correo de boletín
        incluye una forma de darse de baja. Puede solicitarnos acceder a su información, corregirla o eliminarla, sujeto a los
        requisitos legales, <Link href="/es/contacto">contactándonos</Link>. Según dónde viva (por ejemplo, California o el
        Espacio Económico Europeo), puede tener derechos adicionales.
      </p>

      <h2>Seguridad</h2>
      <p>
        Usamos salvaguardas razonables, pero ninguna transmisión por internet es completamente segura. Por favor no envíe números
        de cuenta, contraseñas ni identificaciones oficiales por los formularios del sitio.
      </p>

      <h2>Menores de edad</h2>
      <p>Este sitio no está dirigido a menores de 16 años, y no recopilamos su información a sabiendas.</p>

      <h2>Cambios</h2>
      <p>Podemos actualizar este aviso y cambiaremos la fecha de arriba cuando lo hagamos.</p>
    </LegalPage>
  );
}
