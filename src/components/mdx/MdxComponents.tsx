import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, FlaskConical, Info, Lightbulb } from "lucide-react";
import { BarChart, type BarDatum } from "@/components/charts/BarChart";
import { cn } from "@/lib/utils";

/* Components available inside Insights MDX files. */

const calloutStyles = {
  note: { icon: Info, cls: "border-sea/40 bg-sea/5", label: "Note" },
  insight: { icon: Lightbulb, cls: "border-brass/60 bg-brass/5", label: "Key idea" },
  warning: { icon: AlertTriangle, cls: "border-oxblood/50 bg-oxblood/5", label: "Caution" },
  method: { icon: FlaskConical, cls: "border-ink/30 bg-paper-2", label: "Method" },
} as const;

export function Callout({ type = "note", title, children }: { type?: keyof typeof calloutStyles; title?: string; children: ReactNode }) {
  const s = calloutStyles[type] ?? calloutStyles.note;
  const Icon = s.icon;
  return (
    <aside className={cn("not-prose my-8 border-l-2 px-6 py-5 font-sans text-[0.95rem] leading-relaxed text-ink/85", s.cls)}>
      <p className="mb-2 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink/70">
        <Icon className="h-3.5 w-3.5" aria-hidden /> {title ?? s.label}
      </p>
      <div className="space-y-3 [&_a]:underline [&_strong]:font-semibold">{children}</div>
    </aside>
  );
}

export function KeyStats({ items }: { items: Array<{ value: string; label: string }> }) {
  return (
    <div className="not-prose my-10 grid grid-cols-2 gap-px border-y border-line bg-line md:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="bg-paper px-4 py-5">
          <p className="font-serif text-3xl font-light tabular text-ink">{it.value}</p>
          <p className="mt-2 font-sans text-xs leading-snug text-muted">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

export function Chart({ data, title, caption, decimals = 2 }: { data: BarDatum[]; title?: string; caption?: string; decimals?: number }) {
  return <BarChart data={data} title={title} caption={caption} format={(v) => v.toFixed(decimals)} />;
}

export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="not-prose my-12 border-y border-ink/80 py-8">
      <blockquote className="font-serif text-[1.85rem] font-light leading-snug text-ink">{children}</blockquote>
      {cite && <figcaption className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">{cite}</figcaption>}
    </figure>
  );
}

export function Figure({ src, alt, caption, width = 1600, height = 900 }: { src: string; alt: string; caption?: string; width?: number; height?: number }) {
  return (
    <figure className="not-prose my-10">
      <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full border border-line bg-white" sizes="(min-width: 1024px) 720px, 100vw" />
      {caption && <figcaption className="mt-3 font-sans text-xs leading-relaxed text-muted">{caption}</figcaption>}
    </figure>
  );
}

function A({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-scroll">
      <table {...props} />
    </div>
  );
}

export const mdxComponents = { Callout, KeyStats, Chart, PullQuote, Figure, a: A, table: Table };
