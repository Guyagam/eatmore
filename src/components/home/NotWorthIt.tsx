"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Score } from "@/components/review/Bits";
import type { Review } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The band no competitor will run, which is exactly why it is the most
 * important section on the home page: the places she told people to skip.
 *
 * It is the only section that changes the page background, and the red
 * opening out from the centre is the single most dramatic moment on the site.
 */
export default function NotWorthIt({ reviews }: { reviews: Review[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        });
        tl.from(".nw-bg", { scaleX: 0, duration: 0.8, ease: "expo.out" }).from(
          ".nw-item",
          { y: 26, opacity: 0, duration: 0.6, ease: "expo.out", stagger: 0.07 },
          0.35
        );
        return () => tl.kill();
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  if (reviews.length === 0) return null;

  return (
    <section ref={root} className="relative isolate py-20" aria-labelledby="skip-h">
      <div className="nw-bg absolute inset-0 -z-10 origin-center bg-chili" />

      <div className="mx-auto max-w-[1240px] ps-[max(16px,env(safe-area-inset-left,0px))] pe-[max(16px,env(safe-area-inset-right,0px))]">
        <p className="m-0 font-data text-[12px] font-black tracking-[0.15em] text-white/70">
          פסק דין
        </p>
        <h2
          id="skip-h"
          className="mt-2 font-display text-[clamp(40px,8vw,88px)] font-bold leading-[0.9] text-white"
        >
          לא שווה
        </h2>
        <p className="mt-4 max-w-[46ch] text-white/85">
          אלה המקומות שהלכתי אליהם כדי שלא תצטרכו. אם משהו פה משתנה — אני חוזרת ובודקת שוב.
        </p>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-lg bg-white/25">
          {reviews.map((r) => (
            <li key={r.slug} className="nw-item bg-chili">
              <Link
                href={`/reviews/${r.slug}`}
                className="group flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-5 transition-colors duration-200 hover:bg-[#B01F12]"
              >
                <span className="score-on-red shrink-0">
                  <Score value={r.score} size="xl" animate={false} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.2rem] font-extrabold text-white">
                    {r.restaurant}
                  </span>
                  <span className="block font-data text-[13px] text-white/70">
                    {r.city} · ₪{r.price}
                  </span>
                </span>
                <span className="w-full text-[0.97rem] leading-relaxed text-white/90 md:w-auto md:max-w-[46ch]">
                  {r.quote}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}
