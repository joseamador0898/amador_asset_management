"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const KEY = "amador-fund-ack-v1";

const COPY = {
  en: {
    types: [
      { id: "accredited", label: "Accredited investor", detail: "Individual meeting SEC accredited-investor criteria" },
      { id: "institution", label: "Institution or family office", detail: "Pension, endowment, foundation, family office" },
      { id: "professional", label: "Financial professional", detail: "RIA, consultant, wealth manager, private bank" },
      { id: "other", label: "None of the above", detail: "General visitor" },
    ],
    title: "Before you continue",
    intro: "The following pages describe a private investment fund in preparation. Information is provided for eligible investors and their advisers and is not an offer to sell, or a solicitation of an offer to buy, any security.",
    select: "Select your investor type",
    limited1: "Fund details are limited to eligible investors. You can still explore our",
    research: "research",
    researchHref: "/insights",
    signals: "Signals",
    signalsHref: "/signals",
    and: "and",
    briefings: "briefings",
    briefingsHref: "/briefings",
    confirm1: "I confirm the investor type above, and I have read and accept the",
    disclosures: "Important Disclosures",
    disclosuresHref: "/legal/disclosures",
    terms: "Terms of Use",
    termsHref: "/legal/terms",
    continue: "Continue to fund details",
    home: "Return home",
    homeHref: "/",
  },
  es: {
    types: [
      { id: "accredited", label: "Inversionista acreditado", detail: "Persona física que cumple los criterios de inversionista acreditado de la SEC" },
      { id: "institution", label: "Institución o family office", detail: "Fondo de pensiones, endowment, fundación, family office" },
      { id: "professional", label: "Profesional financiero", detail: "RIA, consultor, gestor patrimonial, banca privada" },
      { id: "other", label: "Ninguno de los anteriores", detail: "Visitante general" },
    ],
    title: "Antes de continuar",
    intro: "Las páginas siguientes describen un fondo de inversión privado en preparación. La información se proporciona a inversionistas elegibles y sus asesores, y no constituye una oferta de venta ni una solicitud de oferta de compra de valor alguno.",
    select: "Seleccione su perfil de inversionista",
    limited1: "Los detalles del fondo se limitan a inversionistas elegibles. Aun así puede explorar nuestra",
    research: "investigación",
    researchHref: "/es/analisis",
    signals: "Señales",
    signalsHref: "/es/senales",
    and: "y",
    briefings: "boletines",
    briefingsHref: "/es/boletines",
    confirm1: "Confirmo el perfil de inversionista indicado arriba, y he leído y acepto las",
    disclosures: "Divulgaciones importantes",
    disclosuresHref: "/es/legal/divulgaciones",
    terms: "Términos de uso",
    termsHref: "/es/legal/terminos",
    continue: "Continuar a los detalles del fondo",
    home: "Volver al inicio",
    homeHref: "/es",
  },
} as const;

/**
 * Investor-type acknowledgement before fund details are shown (a common
 * practice for private-fund websites). Stored only in this browser.
 */
function readStored() {
  try {
    return window.localStorage.getItem(KEY) === "yes";
  } catch {
    return false;
  }
}
const subscribe = () => () => {};

export function FundGate({ children, lang = "en" }: { children: ReactNode; lang?: Lang }) {
  const t = COPY[lang];
  // null on the server (unknown), then the stored acknowledgement in the browser.
  const stored = useSyncExternalStore<boolean | null>(subscribe, readStored, () => null);
  const [confirmed, setConfirmed] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const ack = confirmed || stored;

  if (ack) return <>{children}</>;

  const confirm = () => {
    try {
      window.localStorage.setItem(KEY, "yes");
    } catch {
      /* storage unavailable: acknowledgement lasts for this visit only */
    }
    setConfirmed(true);
  };

  return (
    <section className="bg-paper" aria-labelledby="gate-title">
      <div className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-4xl border border-line bg-white p-8 md:p-12">
          <ShieldCheck className="h-7 w-7 text-sea" aria-hidden />
          <h2 id="gate-title" className="display mt-6 text-4xl md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">{t.intro}</p>

          {ack === null ? (
            <div className="mt-10 h-40 animate-pulse bg-paper-2" aria-hidden />
          ) : (
            <>
              <fieldset className="mt-10">
                <legend className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">{t.select}</legend>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {t.types.map((ty) => (
                    <label
                      key={ty.id}
                      className={cn("flex cursor-pointer gap-3 border p-5 transition-colors", type === ty.id ? "border-ink" : "border-line hover:border-ink/50")}
                    >
                      <input type="radio" name="investor-type" value={ty.id} checked={type === ty.id} onChange={() => setType(ty.id)} className="mt-1 accent-[var(--color-sea)]" />
                      <span>
                        <span className="block font-semibold">{ty.label}</span>
                        <span className="mt-0.5 block text-sm text-muted">{ty.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {type === "other" ? (
                <div className="mt-8 border-l-2 border-brass bg-paper-2 p-5 text-sm leading-relaxed">
                  {t.limited1}{" "}
                  <Link href={t.researchHref} className="underline underline-offset-2">
                    {t.research}
                  </Link>
                  ,{" "}
                  <Link href={t.signalsHref} className="underline underline-offset-2">
                    {t.signals}
                  </Link>{" "}
                  {t.and}{" "}
                  <Link href={t.briefingsHref} className="underline underline-offset-2">
                    {t.briefings}
                  </Link>
                  .
                </div>
              ) : (
                <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/80">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-sea)]" />
                  <span>
                    {t.confirm1}{" "}
                    <Link href={t.disclosuresHref} className="underline underline-offset-2">
                      {t.disclosures}
                    </Link>{" "}
                    {t.and}{" "}
                    <Link href={t.termsHref} className="underline underline-offset-2">
                      {t.terms}
                    </Link>
                    .
                  </span>
                </label>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" disabled={!type || type === "other" || !agree} onClick={confirm} className={buttonClass("solid")}>
                  {t.continue}
                </button>
                <Link href={t.homeHref} className={buttonClass("outline")}>
                  {t.home}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
