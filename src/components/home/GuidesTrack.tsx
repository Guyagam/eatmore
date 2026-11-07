"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FoodPhoto from "@/components/media/FoodPhoto";
import type { Guide } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The horizontal journey.
 *
 * The section pins and vertical scroll becomes sideways travel along the
 * guides. The one thing that catches people out here: this is RTL, so the
 * track starts flush right and moves toward POSITIVE x. In an LTR build the
 * same code uses -distance.
 *
 * Under reduced motion nothing pins; the track is a normal horizontally
 * scrollable row that the reader drives themselves.
 */
export default function GuidesTrack({ guides }: { guides: Guide[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 768px)",
        },
        (ctx) => {
          const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
          if (!motion || !wide) return;

          const el = track.current;
          if (!el) return;

          const distance = () => el.scrollWidth - el.clientWidth;

          const tween = gsap.to(el, {
            x: () => distance(), // RTL: positive. LTR would be -distance().
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => "+=" + distance(),
              invalidateOnRefresh: true,
            },
          });

          // The card nearest the middle of the viewport lifts slightly.
          const cards = gsap.utils.toArray<HTMLElement>(".gt-card");
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { scale: 0.94 },
              {
                scale: 1.06,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tween,
                  start: "left 88%",
                  end: "left 42%",
                  scrub: true,
                },
              }
            );
          });

          return () => {
            tween.kill();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden py-16 md:py-20" aria-labelledby="guides-h">
      <div className="mx-auto max-w-[1240px] ps-[max(16px,env(safe-area-inset-left,0px))] pe-[max(16px,env(safe-area-inset-right,0px))]">
        <p className="m-0 font-data text-[12px] font-black tracking-[0.15em] text-chili">
          המדריכים
        </p>
        <h2
          id="guides-h"
          className="mt-2 font-display text-[clamp(36px,6vw,66px)] font-bold leading-[0.95]"
        >
          מדורג, לא מרוכז
        </h2>
        <p className="mt-3 max-w-[52ch] text-muted">
          כל מדריך הוא דירוג עם מקום ראשון ברור. אם אני לא מוכנה להגיד מי ניצח, אין טעם ברשימה.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto md:overflow-visible">
        <div
          ref={track}
          className="flex w-max gap-4 ps-[max(16px,env(safe-area-inset-left,0px))] pe-[max(16px,env(safe-area-inset-right,0px))] will-change-transform"
        >
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="gt-card group relative flex aspect-[3/4] w-[min(72vw,280px)] shrink-0 items-end overflow-hidden rounded-lg p-5"
            >
              <FoodPhoto
                tone={g.tone}
                innerClassName="transition-transform duration-[620ms] ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transform-none"
              />
              <span
                className="absolute inset-0 block"
                style={{
                  background: "linear-gradient(0deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,0) 62%)",
                }}
              />
              <span className="relative z-10">
                <span className="block font-display text-[30px] font-bold leading-[0.95] text-white">
                  {g.title}
                </span>
                <span className="tnum mt-1.5 block font-data text-[12.5px] font-bold text-white/80">
                  {g.ranking.length} מקומות מדורגים
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
