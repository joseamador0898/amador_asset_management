"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarPlus, CheckCircle2, Clock } from "lucide-react";
import { CONSULTATION_TYPES, CONSULTATION_TYPES_ES } from "@/lib/forms/schemas";
import { buttonClass } from "@/components/ui/Button";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Check, Field, FormMessage, Honeypot, SUBMIT_MESSAGES, TextArea, formToObject, useSubmit } from "@/components/forms/fields";

/* Availability, in the firm's time zone. Requests are confirmed by email. */
const FIRM_TZ = "America/Chicago";
const DAY_START = 9; // 9:00
const DAY_END = 17; // last slot must end by 17:00
const DAYS_AHEAD = 14;
const MIN_LEAD_HOURS = 20;

const COPY = {
  en: {
    localTime: "your local time",
    received: "Request received.",
    confirm: "We'll confirm by email within one business day. If the time no longer works, we'll propose alternatives.",
    addToCalendar: "Add to calendar (tentative)",
    steps: ["Consultation", "Date & time", "Your details"],
    discuss: "What would you like to discuss?",
    chooseTime: "Choose a time",
    timesShown: (tz: string) => `Times shown in ${tz}. Requests are confirmed by email.`,
    continue: "Continue",
    details: "Your details",
    name: "Full name",
    email: "Email",
    phone: "Phone (optional)",
    company: "Company (optional)",
    notes: "What should we prepare? (optional)",
    consent1: "I accept the",
    privacy: "privacy notice",
    privacyHref: "/legal/privacy",
    consent2: " and understand a consultation is not investment advice unless agreed in writing.",
    sending: "Sending request…",
    submit: "Request this time",
    icsSummary: (label: string) => `${label} with Amador Asset Management (requested)`,
    icsDescription: "Requested consultation. Amador will confirm the time by email.",
  },
  es: {
    localTime: "su hora local",
    received: "Solicitud recibida.",
    confirm: "Le confirmaremos por correo en un día hábil. Si el horario ya no le funciona, le propondremos alternativas.",
    addToCalendar: "Agregar al calendario (tentativo)",
    steps: ["Consulta", "Fecha y hora", "Sus datos"],
    discuss: "¿De qué le gustaría hablar?",
    chooseTime: "Elija un horario",
    timesShown: (tz: string) => `Horarios en ${tz}. Las solicitudes se confirman por correo.`,
    continue: "Continuar",
    details: "Sus datos",
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono (opcional)",
    company: "Empresa (opcional)",
    notes: "¿Qué debemos preparar? (opcional)",
    consent1: "Acepto el",
    privacy: "aviso de privacidad",
    privacyHref: "/es/legal/privacidad",
    consent2: " y entiendo que una consulta no es asesoría de inversión salvo acuerdo por escrito.",
    sending: "Enviando solicitud…",
    submit: "Solicitar este horario",
    icsSummary: (label: string) => `${label} con Amador Asset Management (solicitada)`,
    icsDescription: "Consulta solicitada. Amador confirmará el horario por correo.",
  },
};

type Slot = { firmDate: string; firmTime: string; start: Date; end: Date };

const noopSubscribe = () => () => {};

function tzOffsetMinutes(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return (Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - date.getTime()) / 60000;
}

function zonedToUtc(date: string, time: string, tz: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  return new Date(guess - tzOffsetMinutes(new Date(guess), tz) * 60000);
}

function firmDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FIRM_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function buildDays(now: Date, minutes: number) {
  const days: Array<{ key: string; slots: Slot[] }> = [];
  for (let i = 0; days.length < 10 && i < DAYS_AHEAD + 6; i++) {
    const key = firmDateKey(new Date(now.getTime() + i * 86400000));
    const weekday = new Date(`${key}T12:00:00Z`).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const slots: Slot[] = [];
    const step = minutes >= 60 ? 60 : 30;
    for (let t = DAY_START * 60; t + minutes <= DAY_END * 60; t += step) {
      const firmTime = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
      const start = zonedToUtc(key, firmTime, FIRM_TZ);
      if (start.getTime() - now.getTime() < MIN_LEAD_HOURS * 3600000) continue;
      slots.push({ firmDate: key, firmTime, start, end: new Date(start.getTime() + minutes * 60000) });
    }
    if (slots.length) days.push({ key, slots });
  }
  return days;
}

function icsFor(slot: Slot, summary: string, description: string) {
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amador Asset Management//Consultations//EN",
    "BEGIN:VEVENT",
    `UID:${stamp(slot.start)}-${Math.random().toString(36).slice(2)}@amador`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(slot.start)}`,
    `DTEND:${stamp(slot.end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function BookingFlow({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const locale = lang === "es" ? "es-MX" : undefined;
  const [typeId, setTypeId] = useState<string>(CONSULTATION_TYPES[0].id);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // "now" is captured when the visitor picks a consultation (an event, never
  // during prerender), so the static HTML stays stable.
  const [now, setNow] = useState<Date | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const localTz = useSyncExternalStore(
    noopSubscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => t.localTime,
  );
  const { state, submit } = useSubmit("/api/book", SUBMIT_MESSAGES[lang]);
  const fe = state.fieldErrors ?? {};

  const type = CONSULTATION_TYPES.find((ty) => ty.id === typeId)!;
  const days = useMemo(() => (now ? buildDays(now, type.minutes) : []), [now, type.minutes]);
  const day = days.find((d) => d.key === dayKey) ?? days[0];

  // Looked up by id (a string), so the selected type is never handed to a function and stays safe to memoize on.
  const labelOf = (id: string, english: string) => (lang === "es" ? (CONSULTATION_TYPES_ES[id]?.label ?? english) : english);
  const descriptionOf = (id: string, english: string) => (lang === "es" ? (CONSULTATION_TYPES_ES[id]?.description ?? english) : english);
  const typeLabel = labelOf(type.id, type.label);

  const fmtDay = (key: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(`${key}T12:00:00Z`).toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { timeZone: "UTC", ...opts });
  const fmtLocal = (d: Date) => d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const fmtLocalFull = (d: Date) => d.toLocaleString(locale, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });

  if (state.status === "success" && slot) {
    const href = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsFor(slot, t.icsSummary(typeLabel), t.icsDescription))}`;
    return (
      <div className="border border-line bg-white p-8 md:p-10" role="status">
        <CheckCircle2 className="h-8 w-8 text-up" aria-hidden />
        <p className="display mt-6 text-4xl">{t.received}</p>
        <p className="mt-4 max-w-xl text-muted">
          {typeLabel} · {fmtLocalFull(slot.start)}. {t.confirm}
        </p>
        <a href={href} download="amador-consultation.ics" className={buttonClass("outline", "mt-8")}>
          <CalendarPlus className="h-4 w-4" aria-hidden /> {t.addToCalendar}
        </a>
      </div>
    );
  }

  return (
    <div className="border border-line bg-white">
      {/* Progress */}
      <ol className="grid grid-cols-3 border-b border-line text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
        {t.steps.map((label, i) => (
          <li key={label} className={cn("px-4 py-4 md:px-6", i + 1 === step ? "text-ink" : "text-muted/60", i > 0 && "border-l border-line")}>
            <span className="mr-2 font-mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        ))}
      </ol>

      <div className="p-6 md:p-10">
        {step === 1 && (
          <div>
            <p className="font-serif text-3xl font-light">{t.discuss}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {CONSULTATION_TYPES.map((ty) => (
                <button
                  key={ty.id}
                  type="button"
                  onClick={() => {
                    setTypeId(ty.id);
                    setSlot(null);
                    setDayKey(null);
                    setNow(new Date());
                    setStep(2);
                  }}
                  className={cn(
                    "group flex flex-col items-start border p-6 text-left transition-all hover:-translate-y-0.5 hover:border-ink",
                    ty.id === typeId ? "border-ink" : "border-line",
                  )}
                >
                  <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-muted">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {ty.minutes} min
                  </span>
                  <span className="mt-3 font-serif text-2xl">{labelOf(ty.id, ty.label)}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{descriptionOf(ty.id, ty.description)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <button type="button" onClick={() => setStep(1)} className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> {typeLabel} · {type.minutes} min
            </button>
            <p className="font-serif text-3xl font-light">{t.chooseTime}</p>
            <p className="mt-2 text-sm text-muted">{t.timesShown(localTz)}</p>
            {!now ? (
              <div className="mt-8 h-40 animate-pulse bg-paper-2" aria-hidden />
            ) : (
              <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5">
                  {days.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => {
                        setDayKey(d.key);
                        setSlot(null);
                      }}
                      aria-pressed={day?.key === d.key}
                      className={cn(
                        "flex flex-col items-center border px-2 py-3 transition-colors",
                        day?.key === d.key ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                      )}
                    >
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] opacity-70">{fmtDay(d.key, { weekday: "short" })}</span>
                      <span className="mt-1 font-serif text-2xl">{fmtDay(d.key, { day: "numeric" })}</span>
                      <span className="text-[0.6rem] uppercase opacity-60">{fmtDay(d.key, { month: "short" })}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    {day ? fmtDay(day.key, { weekday: "long", month: "long", day: "numeric" }) : ""}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {day?.slots.map((s) => (
                      <button
                        key={s.start.toISOString()}
                        type="button"
                        onClick={() => setSlot(s)}
                        aria-pressed={slot?.start.getTime() === s.start.getTime()}
                        className={cn(
                          "border px-3 py-2.5 font-mono text-sm transition-colors",
                          slot?.start.getTime() === s.start.getTime() ? "border-brass bg-brass/10" : "border-line hover:border-ink",
                        )}
                      >
                        {fmtLocal(s.start)}
                      </button>
                    ))}
                  </div>
                  <button type="button" disabled={!slot} onClick={() => setStep(3)} className={buttonClass("solid", "mt-8")}>
                    {t.continue}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && slot && (
          <form
            noValidate
            className="relative"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = formToObject(e.currentTarget);
              await submit({ ...data, type: type.id, date: slot.firmDate, time: slot.firmTime, timezone: FIRM_TZ, lang });
            }}
          >
            <button type="button" onClick={() => setStep(2)} className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> {typeLabel} · {fmtLocalFull(slot.start)}
            </button>
            <p className="font-serif text-3xl font-light">{t.details}</p>
            <Honeypot />
            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <Field label={t.name} name="name" required autoComplete="name" error={fe.name} />
              <Field label={t.email} name="email" type="email" required autoComplete="email" error={fe.email} />
              <Field label={t.phone} name="phone" type="tel" autoComplete="tel" />
              <Field label={t.company} name="company" autoComplete="organization" />
              <TextArea label={t.notes} name="notes" className="sm:col-span-2" rows={4} />
              <div className="sm:col-span-2">
                <Check name="consent" error={fe.consent}>
                  {t.consent1}{" "}
                  <Link href={t.privacyHref} className="underline underline-offset-2">
                    {t.privacy}
                  </Link>
                  {t.consent2}
                </Check>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <FormMessage state={state} />
              <button type="submit" disabled={state.status === "submitting"} className={buttonClass("solid", "self-start")}>
                {state.status === "submitting" ? t.sending : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
