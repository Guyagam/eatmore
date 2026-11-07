"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Staggered entrance for a group of siblings.
 *
 * Children render visible in the HTML. Only after mount, and only when motion
 * is allowed, do they get armed into their hidden start state and released on
 * scroll. A reader with JS off, a crawler, or anyone with reduced motion on
 * sees the finished page — which is also what the first paint and any
 * screenshot of the page show.
 */

interface Props {
  children: ReactNode;
  /** ms between siblings. 40 inside a grid, 70 between whole bands. */
  stagger?: number;
  className?: string;
  as?: "div" | "ul" | "section";
}

export default function Reveal({
  children,
  stagger = 40,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(host.children) as HTMLElement[];
    items.forEach((el) => el.setAttribute("data-reveal", "armed"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          items.forEach((el, i) => {
            window.setTimeout(() => el.setAttribute("data-reveal", "in"), i * stagger);
          });
          io.disconnect();
        });
      },
      { rootMargin: "0px 0px -15% 0px" }
    );

    io.observe(host);

    // Safety net: if anything stops the observer from ever firing, show the
    // content rather than leaving a blank band on the page.
    const bail = window.setTimeout(
      () => items.forEach((el) => el.setAttribute("data-reveal", "in")),
      2500
    );

    return () => {
      io.disconnect();
      window.clearTimeout(bail);
    };
  }, [stagger]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
