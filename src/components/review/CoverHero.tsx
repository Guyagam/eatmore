"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FoodPhoto from "@/components/media/FoodPhoto";
import { Score } from "@/components/review/Bits";
import type { Review } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The cover.
 *
 * This is the one component that must not be redesigned: it is her Instagram
 * post, alive. Close-up photograph, heavy white Hebrew over it, a thin second
 * line, a yellow location pill.
 *
 * Words are split by WORD, never by character — splitting Hebrew into letters
 * breaks final forms and destroys screen-reader output. The real headline stays
 * in the DOM for assistive tech; the animated copy is aria-hidden.
 */
export default function CoverHero({
  review,
  kicker,
  href,
}: {
  review: Review;
  kicker?: string;
  href?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.from(".cv-photo", { scale: 1.12, duration: 1.6, ease: "power2.out" })
          .from(".cv-kicker", { yPercent: 120, opacity: 0, duration: 0.7 }, 0.15)
          .from(".cv-word", { yPercent: 115, duration: 0.9, stagger: 0.07 }, 0.25)
          .from(".cv-sub", { y: 18, opacity: 0, duration: 0.7 }, 0.6)
          .from(
            ".cv-pill",
            { scale: 0.6, opacity: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.08 },
            0.72
          );

        // Ken Burns continues with the scroll, and the type drifts up faster
        // than the photograph behind it.
        const scrub = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        scrub
          .to(".cv-photo", { scale: 1.15, ease: "none" }, 0)
          .to(".cv-type", { yPercent: -18, opacity: 0.25, ease: "none" }, 0);

        return () => {
          tl.kill();
          scrub.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const words = review.title.split(" ");

  const inner = (
    <>
      <FoodPhoto tone={review.tone} scrim innerClassName="cv-photo will-change-transform" />

      <div className="cv-type relative z-10 mx-auto w-full max-w-[1000px] text-center">
        {kicker && (
          <span className="mb-4 block overflow-hidden">
            <span className="cv-kicker inline-block font-data text-[12px] font-black tracking-[0.18em] text-white/85">
              {kicker}
            </span>
          </span>
        )}

        <h1 className="m-0 font-display font-bold leading-[0.9] text-white [text-shadow:0_2px_0_rgba(0,0,0,.45),0_0_26px_rgba(0,0,0,.35)]">
          <span className="sr-only">{review.title}</span>
          <span
            aria-hidden="true"
            className="flex flex-wrap items-baseline justify-center gap-x-[0.22em]"
            style={{ fontSize: "clamp(44px, 9vw, 116px)" }}
          >
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                <span className="cv-word inline-block">{w}</span>
              </span>
            ))}
          </span>
        </h1>

        {review.subtitle && (
          <p className="cv-sub mx-auto mt-3 max-w-[32ch] text-[clamp(15px,2vw,20px)] font-bold text-white/95 [text-shadow:0_1px_6px_rgba(0,0,0,.6)]">
            {review.subtitle}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <span className="cv-pill tnum inline-flex items-center gap-1.5 rounded-full bg-yolk px-3.5 py-1.5 font-data text-[13px] font-black text-[#1A1412]">
            {review.city} · ₪{review.price}
          </span>
          <span className="cv-pill inline-flex items-center rounded-full bg-white/15 px-3.5 py-1.5 font-data text-[13px] font-black text-white backdrop-blur-sm">
            {review.cuisine[0]}
          </span>
          <span className="cv-pill">
            <Score value={review.score} size="md" />
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={root}
      className="relative isolate flex min-h-[min(78svh,760px)] items-center overflow-hidden rounded-lg px-[max(16px,env(safe-area-inset-left,0px))] py-20"
    >
      {href ? (
        <Link href={href} className="contents" aria-label={`לביקורת על ${review.restaurant}`}>
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
