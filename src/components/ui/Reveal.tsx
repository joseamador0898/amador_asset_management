"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Fades content up as it scrolls into view. Content is visible by default:
 * only elements that start below the fold are hidden (offscreen, so there is
 * no flash) and revealed by an IntersectionObserver. Without JavaScript, or
 * with reduced motion, nothing is ever hidden.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return; // already on screen

    el.dataset.reveal = "hidden";
    let timer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          timer = window.setTimeout(() => {
            el.dataset.reveal = "shown";
          }, delay);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
      el.dataset.reveal = "shown";
    };
  }, [delay]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
