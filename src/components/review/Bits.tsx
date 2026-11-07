"use client";

import { useEffect, useRef, useState } from "react";
import type { Kashrut, Verdict } from "@/lib/types";
import { KASHRUT_LABEL, VERDICT_LABEL } from "@/lib/types";

/* ───────────────── Score ─────────────────
   Counts up from 0 when it scrolls into view. Renders its final value in the
   HTML, so the number is correct before any script runs. */

export function Score({
  value,
  size = "md",
  animate = true,
}: {
  value: number;
  size?: "sm" | "md" | "xl";
  animate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - t0) / 700, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(Number((value * eased).toFixed(1)));
          if (p < 1) frame = requestAnimationFrame(step);
        };
        setShown(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, animate]);

  const cls =
    size === "xl"
      ? "text-[clamp(52px,10vw,86px)] leading-none px-0 py-0 bg-transparent text-ink"
      : size === "sm"
        ? "text-[14px] px-2 py-[3px] bg-ink text-paper rounded-sm"
        : "text-[17px] px-2.5 py-1 bg-ink text-paper rounded-sm";

  return (
    <span
      ref={ref}
      className={`tnum inline-block font-data font-black ${cls}`}
      aria-label={`ציון ${value.toFixed(1)} מתוך 10`}
    >
      <span aria-hidden="true">{shown.toFixed(1)}</span>
    </span>
  );
}

/* ───────────────── Verdict stamp ─────────────────
   The component that makes this a guide and not a feed. Never colour alone —
   the words carry the meaning. */

export function VerdictStamp({
  verdict,
  size = "md",
  animate = true,
}: {
  verdict: Verdict;
  size?: "sm" | "md";
  animate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => setArmed(true), 420);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  const on = animate ? armed : true;
  const tone = verdict === "worth" ? "text-mint" : "text-chili";
  const pad = size === "sm" ? "px-3 py-1.5 text-[17px]" : "px-4 py-2 text-[22px]";

  return (
    <span
      ref={ref}
      className={[
        "inline-block rounded-sm border-[2.5px] border-current font-display leading-none",
        tone,
        pad,
        "transition-[transform,opacity] duration-500 ease-[var(--ease-pop)] motion-reduce:transition-none",
        on ? "rotate-[-4deg] scale-100 opacity-100" : "rotate-[-4deg] scale-0 opacity-0",
      ].join(" ")}
    >
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

/* ───────────────── Badges ───────────────── */

export function PriceBadge({ price }: { price: number }) {
  return (
    <span className="tnum inline-flex items-center rounded-full border border-yolk/55 bg-yolk/20 px-2.5 py-1 font-data text-[12px] font-bold text-ink">
      ₪{price}
    </span>
  );
}

export function KashrutBadge({ kashrut }: { kashrut: Kashrut }) {
  if (kashrut === "not") return null;
  return (
    <span className="inline-flex items-center rounded-full border border-mint/35 bg-mint/15 px-2.5 py-1 font-data text-[12px] font-bold text-mint">
      {KASHRUT_LABEL[kashrut]}
    </span>
  );
}

export function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 font-data text-[12px] font-bold text-muted">
      {children}
    </span>
  );
}
