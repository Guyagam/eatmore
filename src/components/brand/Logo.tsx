"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * "הביס" — the bite.
 *
 * A filled disc with three bites taken out of its upper-right edge (the start
 * of the line in Hebrew) and a yolk sitting off-centre. The mark is the trace
 * she leaves behind, not a piece of cutlery.
 *
 * The entry sequence is the one piece of non-user-triggered motion allowed on
 * a page load, and it runs at most once per mount.
 */

type Variant = "full" | "mark" | "mono" | "inverse";

interface Props {
  variant?: Variant;
  /** Mark height in px. The wordmark scales from it. */
  size?: number;
  animate?: boolean;
  className?: string;
}

const WORD = "אוכלים עם מור";

export default function Logo({
  variant = "full",
  size = 44,
  animate = false,
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const maskId = `bite-${uid}`;
  const root = useRef<HTMLDivElement>(null);

  const discFill =
    variant === "mono" ? "var(--ink)" : variant === "inverse" ? "#ffffff" : "var(--chili)";
  const yolkFill =
    variant === "mono" ? "var(--paper)" : variant === "inverse" ? "var(--chili)" : "var(--yolk)";

  useGSAP(
    () => {
      if (!animate) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { transformOrigin: "center" } });
        tl.from(".lg-disc", { scale: 0, duration: 0.64, ease: "back.out(1.9)" })
          .from(
            ".lg-bite",
            { scale: 0, duration: 0.3, ease: "back.out(2.2)", stagger: 0.075 },
            0.47
          )
          .from(
            ".lg-crumb",
            {
              scale: 0.2,
              x: -14,
              y: 10,
              opacity: 0,
              duration: 0.76,
              ease: "expo.out",
              stagger: 0.06,
            },
            0.56
          )
          .from(".lg-yolk", { scale: 0, duration: 0.52, ease: "back.out(2)" }, 0.74)
          .from(
            ".lg-letter",
            { yPercent: 36, opacity: 0, rotate: 2, duration: 0.62, ease: "expo.out", stagger: 0.045 },
            0.82
          )
          .to(".lg-yolk", {
            scale: 1.07,
            duration: 1.7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [animate] }
  );

  const markWidth = (size * 132) / 120;

  return (
    <div
      ref={root}
      className={`group flex items-center gap-[0.38em] ${className}`}
      style={{ fontSize: size }}
    >
      <svg
        viewBox="0 0 132 120"
        width={markWidth}
        height={size}
        className="shrink-0 overflow-visible"
        role="img"
        aria-label="אוכלים עם מור"
      >
        <defs>
          <mask id={maskId}>
            <rect x="-20" y="-20" width="180" height="170" fill="#fff" />
            <circle className="lg-bite" cx="84" cy="19" r="12" />
            <circle className="lg-bite" cx="96" cy="28" r="10.5" />
            <circle className="lg-bite" cx="102" cy="40" r="9.5" />
          </mask>
        </defs>

        <circle
          className="lg-disc origin-center transition-transform duration-500 ease-[var(--ease-pop)] group-hover:rotate-[7deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
          style={{ transformBox: "fill-box" }}
          cx="60"
          cy="60"
          r="47"
          fill={discFill}
          mask={`url(#${maskId})`}
        />
        <circle
          className="lg-yolk"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          cx="52"
          cy="70"
          r="13"
          fill={yolkFill}
        />
        <circle className="lg-crumb" cx="116" cy="13" r="4" fill={discFill} />
        <circle className="lg-crumb" cx="124" cy="29" r="2.6" fill={discFill} />
        <circle className="lg-crumb" cx="110" cy="3" r="2.2" fill={yolkFill} />
      </svg>

      {variant === "full" && (
        <span className="flex flex-col items-start leading-none">
          <span
            className="flex font-display leading-[0.84]"
            style={{ fontSize: size * 0.82, gap: "0.04em" }}
            aria-hidden="true"
          >
            {WORD.split("").map((ch, i) => (
              <span key={i} className="lg-letter inline-block">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <span
            dir="ltr"
            className="font-data font-bold text-muted"
            style={{ fontSize: size * 0.17, letterSpacing: "0.3em" }}
            aria-hidden="true"
          >
            EAT.MOR.E
          </span>
        </span>
      )}
    </div>
  );
}
