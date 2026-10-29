"use client";

import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SubmitState = { status: "idle" | "submitting" | "success" | "error"; error?: string; fieldErrors?: Record<string, string> };

type SubmitMessages = {
  generic: string;
  network: string;
  /** When set (Spanish), these replace the API's English messages: by status, and per field. */
  invalid?: string;
  rate?: string;
  fields?: Record<string, string>;
  fieldFallback?: string;
};

export const SUBMIT_MESSAGES: Record<"en" | "es", SubmitMessages> = {
  en: { generic: "Something went wrong. Please try again.", network: "Network error. Please check your connection and try again." },
  es: {
    generic: "Algo salió mal. Inténtelo de nuevo.",
    network: "Error de red. Revise su conexión e inténtelo de nuevo.",
    invalid: "Revise los campos señalados.",
    rate: "Demasiadas solicitudes. Inténtelo de nuevo en un minuto.",
    fields: {
      name: "Escriba su nombre.",
      email: "Escriba un correo electrónico válido.",
      message: "Cuéntenos un poco más (10 caracteres o más).",
      consent: "Acepte el aviso de privacidad para continuar.",
      attestation: "Confirme la declaración para continuar.",
      country: "Indique su país de residencia.",
      topics: "Elija al menos un boletín.",
      date: "Elija una fecha.",
      time: "Elija un horario.",
    },
    fieldFallback: "Revise este campo.",
  },
};

/** POSTs JSON to an API route and tracks status and field errors (the API writes them in English; see SubmitMessages). */
export function useSubmit(endpoint: string, messages: SubmitMessages = SUBMIT_MESSAGES.en) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  async function submit(payload: Record<string, unknown>) {
    setState({ status: "submitting" });
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (res.ok && json.ok) {
        setState({ status: "success" });
        return true;
      }
      const fieldErrors = messages.fields
        ? Object.fromEntries(Object.keys(json.fieldErrors ?? {}).map((k) => [k, messages.fields?.[k] ?? messages.fieldFallback ?? ""]))
        : json.fieldErrors;
      const error = (res.status === 422 && messages.invalid) || (res.status === 429 && messages.rate) || (messages.fields ? messages.generic : json.error);
      setState({ status: "error", error: error ?? messages.generic, fieldErrors });
    } catch {
      setState({ status: "error", error: messages.network });
    }
    return false;
  }
  return { state, submit, reset: () => setState({ status: "idle" }) };
}

type Tone = "light" | "dark";

const labelCls = (tone: Tone) =>
  cn("mb-2 block text-[0.66rem] font-semibold uppercase tracking-[0.16em]", tone === "dark" ? "text-paper/60" : "text-muted");

const inputCls = (tone: Tone, invalid?: boolean) =>
  cn(
    "w-full border-0 border-b bg-transparent px-0 py-2.5 text-[0.95rem] outline-none transition-colors placeholder:opacity-40 focus:ring-0",
    tone === "dark" ? "border-paper/25 text-paper focus:border-brass-light" : "border-ink/25 text-ink focus:border-brass",
    invalid && "border-down",
  );

export function Field({
  label,
  name,
  error,
  tone = "light",
  hint,
  className,
  ...props
}: { label: string; name: string; error?: string; tone?: Tone; hint?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls(tone)}>
        {label}
        {props.required && <span aria-hidden> *</span>}
      </label>
      <input id={id} name={name} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-err` : undefined} className={inputCls(tone, !!error)} {...props} />
      {hint && !error && <p className={cn("mt-1.5 text-xs", tone === "dark" ? "text-paper/60" : "text-muted")}>{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-down">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  name,
  error,
  tone = "light",
  className,
  ...props
}: { label: string; name: string; error?: string; tone?: Tone } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls(tone)}>
        {label}
        {props.required && <span aria-hidden> *</span>}
      </label>
      <textarea id={id} name={name} rows={4} aria-invalid={!!error || undefined} className={cn(inputCls(tone, !!error), "resize-y")} {...props} />
      {error && <p className="mt-1.5 text-xs text-down">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  error,
  tone = "light",
  options,
  className,
  ...props
}: { label: string; name: string; error?: string; tone?: Tone; options: Array<{ value: string; label: string }> } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls(tone)}>
        {label}
        {props.required && <span aria-hidden> *</span>}
      </label>
      <select id={id} name={name} className={cn(inputCls(tone, !!error), "cursor-pointer", tone === "dark" && "[&>option]:bg-ink")} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-down">{error}</p>}
    </div>
  );
}

export function Check({
  name,
  children,
  error,
  tone = "light",
  ...props
}: { name: string; children: ReactNode; error?: string; tone?: Tone } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className={cn("flex cursor-pointer items-start gap-3 text-sm leading-relaxed", tone === "dark" ? "text-paper/70" : "text-ink/75")}>
        <input type="checkbox" name={name} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brass)]" {...props} />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1.5 pl-7 text-xs text-down">{error}</p>}
    </div>
  );
}

/** Invisible honeypot field for bots. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormMessage({ state, tone = "light" }: { state: SubmitState; tone?: Tone }) {
  if (state.status !== "error" || !state.error) return null;
  return (
    <p role="alert" className={cn("text-sm", tone === "dark" ? "text-down" : "text-oxblood")}>
      {state.error}
    </p>
  );
}

/** Reads a form element into a plain object; checkboxes sharing a name become arrays. */
export function formToObject(form: HTMLFormElement) {
  const data: Record<string, unknown> = {};
  const fd = new FormData(form);
  const multi = new Set(
    Array.from(form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-multi]')).map((el) => el.name),
  );
  for (const name of multi) data[name] = fd.getAll(name).map(String);
  for (const el of Array.from(form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:not([data-multi])'))) {
    data[el.name] = el.checked;
  }
  fd.forEach((value, key) => {
    if (multi.has(key) || key in data) return;
    data[key] = typeof value === "string" ? value : "";
  });
  return data;
}
