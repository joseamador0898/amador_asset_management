import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <Eyebrow className={cn(tone === "light" ? "text-brass-light" : "text-brass", align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "display mt-5 text-[2.35rem] sm:text-5xl md:text-[3.5rem]",
          tone === "light" ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <div className={cn("mt-6 max-w-2xl text-[1.05rem] leading-relaxed", tone === "light" ? "text-paper/70" : "text-muted", align === "center" && "mx-auto")}>
          {intro}
        </div>
      )}
      {children}
    </Reveal>
  );
}

/** Page hero used on interior pages. */
export function PageHero({
  eyebrow,
  title,
  intro,
  tone = "light",
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  children?: ReactNode;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section className={cn(dark ? "grain bg-ink text-paper" : "bg-paper text-ink", "border-b", dark ? "border-line-dark" : "border-line", className)}>
      <div className="container-x pb-16 pt-14 md:pb-24 md:pt-24">
        <Eyebrow className={dark ? "text-brass-light" : "text-brass"}>{eyebrow}</Eyebrow>
        <h1 className="display mt-6 max-w-5xl text-[2.75rem] sm:text-6xl md:text-[5rem]">{title}</h1>
        {intro && <div className={cn("mt-8 max-w-2xl text-lg leading-relaxed", dark ? "text-paper/70" : "text-muted")}>{intro}</div>}
        {children}
      </div>
    </section>
  );
}
