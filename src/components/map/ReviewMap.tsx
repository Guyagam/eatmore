"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { KashrutBadge, PriceBadge } from "@/components/review/Bits";
import { placeLabels, projectReviews } from "@/lib/geo";
import type { Review } from "@/lib/types";
import { VERDICT_LABEL } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The map.
 *
 * Deliberately NOT a street basemap. Three reasons: a tile layer is a third
 * party that can rate-limit or disappear, OSM grey fights every colour in the
 * palette, and at this scale the street names carry no information she is
 * giving — what matters is which direction, how good, how much.
 *
 * So the pins are plotted from their real coordinates, at true scale, onto a
 * brand-coloured plane with the sea where the sea is. Swapping in MapLibre
 * later touches this file and src/lib/geo.ts and nothing else.
 *
 * Abroad reviews are excluded on purpose — three dots in Europe and Asia would
 * squeeze the whole coastal plain into a smudge.
 */

const HEIGHT = 720;

type Mode = "all" | "worth" | "skip";

const MODES: [Mode, string][] = [
  ["all", "הכול"],
  ["worth", "שווה"],
  ["skip", "לא שווה"],
];

export default function ReviewMap({ reviews }: { reviews: Review[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const local = useMemo(() => reviews.filter((r) => !r.abroad), [reviews]);

  // The frame is fitted to EVERY local review, not to the filtered subset, so
  // the map doesn't lurch around when someone flips a filter.
  const projection = useMemo(() => projectReviews(local, HEIGHT), [local]);

  const placed = useMemo(() => placeLabels(projection.points), [projection.points]);

  const visible = useMemo(
    () =>
      placed.filter((p) =>
        mode === "all"
          ? true
          : mode === "worth"
            ? p.review.verdict === "worth"
            : p.review.verdict === "skip"
      ),
    [placed, mode]
  );

  const active = useMemo(() => local.find((r) => r.slug === activeSlug) ?? null, [local, activeSlug]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        tl.from(".map-sea", { xPercent: -10, opacity: 0, duration: 0.9, ease: "expo.out" }).from(
          ".map-pin",
          {
            scale: 0,
            y: -20,
            opacity: 0,
            duration: 0.55,
            ease: "back.out(2)",
            stagger: { each: 0.05, from: "start" },
            transformOrigin: "center",
          },
          0.2
        );
        return () => tl.kill();
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const W = projection.width;
  const sea = projection.westX - 30;

  return (
    <div ref={root}>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {MODES.map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={[
              "min-h-[44px] rounded-full border px-4 py-2 font-data text-[14px] font-bold",
              "transition-[background-color,border-color,color] duration-[var(--t-base)]",
              mode === m ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink",
            ].join(" ")}
          >
            {label}
          </button>
        ))}

        <span className="ms-auto flex flex-wrap items-center gap-x-3.5 gap-y-1 font-data text-[12px] font-bold text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-mint" aria-hidden="true" />
            שווה
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-chili" aria-hidden="true" />
            לא שווה
          </span>
          <span>גודל הסיכה = הציון</span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
        {/* ── the plane ── */}
        <div className="overflow-hidden rounded-lg border border-line bg-surface p-2">
          <svg
            viewBox={`0 0 ${W} ${HEIGHT}`}
            className="mx-auto block h-auto w-full max-w-[340px] lg:w-[340px]"
            role="img"
            aria-label={`מפת ${visible.length} מסעדות במרכז הארץ, מצפון לדרום. אותן מסעדות מופיעות גם ברשימה שליד המפה.`}
          >
            {/* sea */}
            <path
              className="map-sea"
              d={`M -20 -20 L ${sea} -20 C ${sea - 26} ${HEIGHT * 0.28}, ${sea + 22} ${HEIGHT * 0.66}, ${sea - 14} ${HEIGHT + 20} L -20 ${HEIGHT + 20} Z`}
              fill="var(--sunk)"
            />
            <path
              className="map-sea"
              d={`M ${sea} -20 C ${sea - 26} ${HEIGHT * 0.28}, ${sea + 22} ${HEIGHT * 0.66}, ${sea - 14} ${HEIGHT + 20}`}
              fill="none"
              stroke="var(--line)"
              strokeWidth="2"
            />
            <text
              x={Math.max(16, sea - 40)}
              y={HEIGHT * 0.5}
              className="font-data"
              fontSize="14"
              fontWeight="700"
              letterSpacing="4"
              fill="var(--muted)"
              opacity="0.8"
            >
              הים
            </text>

            <text
              x={W - 14}
              y="30"
              textAnchor="end"
              className="font-data"
              fontSize="12"
              fontWeight="900"
              letterSpacing="1.5"
              fill="var(--muted)"
            >
              ↑ צפון
            </text>

            {/* pins, north to south */}
            {visible.map(({ review, x, y, r, labelY, labelAnchor }) => {
              const on = activeSlug === review.slug;
              const colour = review.verdict === "worth" ? "var(--mint)" : "var(--chili)";
              const labelX =
                labelAnchor === "middle" ? x : labelAnchor === "start" ? x + r + 8 : x - r - 8;
              return (
                <g
                  key={review.slug}
                  className="map-pin cursor-pointer"
                  onMouseEnter={() => setActiveSlug(review.slug)}
                  onClick={() => setActiveSlug(review.slug)}
                >
                  {on && <circle cx={x} cy={y} r={r + 10} fill={colour} opacity="0.2" />}
                  {/* a leader line when the label had to move off the pin */}
                  {labelAnchor === "middle" && Math.abs(labelY - y) > r + 20 && (
                    <line
                      x1={x}
                      y1={y + r}
                      x2={x}
                      y2={labelY - 9}
                      stroke="var(--muted)"
                      strokeWidth="1"
                      opacity="0.45"
                    />
                  )}
                  <circle cx={x} cy={y} r={r} fill={colour} stroke="var(--paper)" strokeWidth="2.5" />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={labelAnchor}
                    className="pointer-events-none font-data"
                    fontSize="12.5"
                    fontWeight={on ? 900 : 700}
                    fill="var(--ink)"
                    opacity={on ? 1 : 0.68}
                  >
                    {review.restaurant}
                  </text>
                  {/* transparent disc guaranteeing a 44px tap target on every pin */}
                  <circle
                    cx={x}
                    cy={y}
                    r={Math.max(r, 22)}
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${review.restaurant}, ${review.city}. ציון ${review.score.toFixed(1)}, ${VERDICT_LABEL[review.verdict]}, ${review.price} שקלים לסועד.`}
                    onFocus={() => setActiveSlug(review.slug)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSlug(review.slug);
                      }
                    }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── the rail: the selected place, then the same pins as a list ── */}
        <div className="grid gap-5 lg:sticky lg:top-24">
          {active ? (
            <div className="rounded-lg border border-line bg-paper p-5">
              <p className="m-0 font-data text-[11.5px] font-black tracking-[0.12em] text-muted">
                {active.city}
              </p>
              <h3 className="mt-1 text-[1.3rem] font-extrabold leading-tight">{active.restaurant}</h3>
              <p className="m-0 mt-3 border-s-[3px] border-chili ps-3 text-[0.96rem] leading-relaxed">
                {active.quote}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <PriceBadge price={active.price} />
                <KashrutBadge kashrut={active.kashrut} />
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2.5 py-1 font-data text-[12px] font-bold",
                    active.verdict === "worth" ? "bg-mint/15 text-mint" : "bg-chili/15 text-chili",
                  ].join(" ")}
                >
                  {VERDICT_LABEL[active.verdict]}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/reviews/${active.slug}`}
                  className="flex min-h-[48px] flex-1 items-center justify-center rounded-sm bg-ink px-5 font-data text-[14px] font-black text-paper transition-opacity duration-200 hover:opacity-90"
                >
                  לביקורת המלאה
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${active.geo.lat},${active.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[48px] flex-1 items-center justify-center rounded-sm border-2 border-ink px-5 font-data text-[14px] font-black transition-colors duration-200 hover:bg-ink hover:text-paper"
                >
                  ניווט לכאן
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-line bg-surface p-5">
              <p className="m-0 text-[1.05rem] font-extrabold">בחרו מקום מהמפה</p>
              <p className="m-0 mt-2 text-[0.93rem] leading-relaxed text-muted">
                או מהרשימה כאן למטה — אותם מקומות, מסודרים מצפון לדרום בדיוק כמו הסיכות.
              </p>
            </div>
          )}

          {/* The same data as a plain list. This is what a screen reader reads,
              what a keyboard tabs through, and what works on a narrow phone. */}
          <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line">
            {visible.map(({ review }) => {
              const on = activeSlug === review.slug;
              return (
                <li key={review.slug} className="bg-paper">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveSlug(review.slug)}
                    onClick={() => setActiveSlug(review.slug)}
                    aria-pressed={on}
                    className={[
                      "flex w-full min-h-[52px] items-center gap-3 px-4 py-3 text-start",
                      "transition-colors duration-[var(--t-base)]",
                      on ? "bg-surface" : "hover:bg-surface",
                    ].join(" ")}
                  >
                    <span
                      className="tnum inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-data text-[12.5px] font-black text-on-accent"
                      style={{
                        background:
                          review.verdict === "worth" ? "var(--mint)" : "var(--chili)",
                      }}
                    >
                      {review.score.toFixed(1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.98rem] font-extrabold">
                        {review.restaurant}
                      </span>
                      <span className="tnum block font-data text-[12.5px] text-muted">
                        {review.city} · ₪{review.price}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="m-0 text-[0.88rem] text-muted">
            {local.length} מקומות במרכז. מה שאכלתי בחו״ל יושב ב
            <Link href="/abroad" className="font-bold text-chili underline underline-offset-4">
              עמוד נפרד
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
