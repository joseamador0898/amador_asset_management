import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost" | "brass" | "light" | "outline-light";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-3 px-6 py-3.5",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-paper px-6 py-3.5",
  ghost: "text-ink hover:text-brass px-0 py-2",
  brass: "bg-brass text-ink hover:bg-brass-light px-6 py-3.5",
  light: "bg-paper text-ink hover:bg-white px-6 py-3.5",
  "outline-light": "border border-paper/50 text-paper hover:bg-paper hover:text-ink px-6 py-3.5",
};

export function buttonClass(variant: Variant = "solid", className?: string) {
  return cn(base, variants[variant], className);
}

export function ButtonLink({
  href,
  variant = "solid",
  className,
  children,
  external,
  arrow = true,
  ...rest
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  external?: boolean;
  arrow?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {children}
      {arrow && <Icon aria-hidden className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn("group", buttonClass(variant, className))}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn("group", buttonClass(variant, className))} {...rest}>
      {content}
    </Link>
  );
}

/** Circular arrow link, used for "read more" style affordances. */
export function CircleArrowLink({
  href,
  label,
  tone = "dark",
  className,
}: {
  href: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-4 text-sm font-medium", className)}>
      <span className={cn("link-underline", tone === "light" ? "text-paper" : "text-ink")}>{label}</span>
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border transition-all duration-300",
          tone === "light"
            ? "border-paper/50 text-paper group-hover:bg-paper group-hover:text-ink"
            : "border-ink/40 text-ink group-hover:bg-ink group-hover:text-paper",
        )}
      >
        <ArrowRight aria-hidden className="h-4 w-4" />
      </span>
    </Link>
  );
}
