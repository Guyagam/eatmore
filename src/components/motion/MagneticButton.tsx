"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/**
 * The primary CTA. Pulls toward the cursor inside a 160px radius.
 * Pointer-fine only — on a phone it is an ordinary link with a press state.
 */

interface Props {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
}

export default function MagneticButton({
  href,
  children,
  variant = "solid",
  className = "",
}: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const el = btn.current;
    if (!host || !el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 160) {
        xTo(dx * 0.34);
        yTo(dy * 0.34);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  const base =
    "inline-flex items-center justify-center rounded-sm font-data text-[15px] font-black " +
    "px-7 py-[15px] min-h-[48px] transition-[background,color,border-color] duration-200 " +
    "active:scale-[0.96] will-change-transform";

  const skin =
    variant === "solid"
      ? "bg-chili text-on-accent border-2 border-chili hover:bg-ink hover:border-ink"
      : "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-paper";

  return (
    <span ref={wrap} className="inline-flex p-3 -m-3">
      <Link ref={btn} href={href} className={`${base} ${skin} ${className}`}>
        {children}
      </Link>
    </span>
  );
}
