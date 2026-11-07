"use client";

import { useMemo, useState } from "react";
import ReviewCard from "@/components/review/ReviewCard";
import ReviewMap from "@/components/map/ReviewMap";
import { filterReviews, PRICE_STEPS } from "@/lib/content";
import { EMPTY_FILTERS, type Cuisine, type Filters, type Kashrut, type Review } from "@/lib/types";

/**
 * The archive.
 *
 * Four filters, because those are the four things she puts in every cover
 * line: city, cuisine, kashrut, price. Plus a free-text box and a sort.
 * Everything is client-side over a list that is small by design — when the
 * archive passes a few hundred reviews this moves to the server with the
 * filters in the URL.
 */

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "min-h-[44px] rounded-full border px-4 py-2 font-data text-[14px] font-bold",
        "transition-[background-color,border-color,color] duration-[var(--t-base)]",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink hover:border-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-data text-[11.5px] font-black tracking-[0.12em] text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function ReviewsExplorer({
  reviews,
  cities,
  cuisines,
}: {
  reviews: Review[];
  cities: string[];
  cuisines: Cuisine[];
}) {
  const [f, setF] = useState<Filters>(EMPTY_FILTERS);
  const [openFilters, setOpenFilters] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setF((prev) => ({ ...prev, [key]: prev[key] === value ? EMPTY_FILTERS[key] : value }));

  const results = useMemo(() => filterReviews(reviews, f), [reviews, f]);
  const mapResults = useMemo(() => results.filter((r) => !r.abroad), [results]);
  const activeCount = [f.city, f.cuisine, f.kashrut, f.maxPrice, f.verdict].filter(
    (v) => v !== null
  ).length;
  const dirty = f.q !== "" || activeCount > 0;

  return (
    <div>
      {/* Sticky from md up only. On a phone the control block is ~190px tall
          even collapsed, and pinning a quarter of the screen to filter a list
          you then have to scroll is a bad trade — scrolling back up is one
          flick. */}
      <div className="z-30 -mx-[max(16px,env(safe-area-inset-left,0px))] border-y border-line bg-paper/92 px-[max(16px,env(safe-area-inset-left,0px))] py-4 backdrop-blur-xl md:sticky md:top-[64px]">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="q" className="sr-only">
              חיפוש מסעדה, עיר או מטבח
            </label>
            <input
              id="q"
              type="search"
              value={f.q}
              onChange={(e) => setF((p) => ({ ...p, q: e.target.value }))}
              placeholder="חיפוש מסעדה, עיר או מטבח"
              className="min-h-[44px] w-full max-w-[340px] rounded-sm border border-line bg-paper px-3.5 py-2 text-[15px] outline-none transition-colors duration-200 focus:border-ink"
            />

            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="font-data text-[11.5px] font-black tracking-[0.12em] text-muted"
              >
                מיון
              </label>
              <select
                id="sort"
                value={f.sort}
                onChange={(e) => setF((p) => ({ ...p, sort: e.target.value as Filters["sort"] }))}
                className="min-h-[44px] rounded-sm border border-line bg-paper px-3 py-2 font-data text-[14px] font-bold outline-none focus:border-ink"
              >
                <option value="recent">הכי חדש</option>
                <option value="score">הציון הגבוה</option>
                <option value="price">הזול קודם</option>
              </select>
            </div>

            <div
              className="flex overflow-hidden rounded-sm border border-line"
              role="group"
              aria-label="תצוגה"
            >
              {(
                [
                  ["grid", "רשימה"],
                  ["map", "מפה"],
                ] as ["grid" | "map", string][]
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={[
                    "min-h-[44px] px-4 font-data text-[14px] font-bold transition-colors duration-[var(--t-base)]",
                    view === v ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-surface",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpenFilters((v) => !v)}
              aria-expanded={openFilters}
              aria-controls="filter-groups"
              className="min-h-[44px] rounded-sm border border-line px-4 font-data text-[14px] font-bold md:hidden"
            >
              סינון{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>

            {dirty && (
              <button
                type="button"
                onClick={() => setF(EMPTY_FILTERS)}
                className="min-h-[44px] font-data text-[13.5px] font-bold text-chili underline underline-offset-4"
              >
                ניקוי הסינון
              </button>
            )}
          </div>

          <div
            id="filter-groups"
            className={`${openFilters ? "flex" : "hidden"} max-h-[46svh] flex-col gap-2.5 overflow-y-auto pb-1 md:flex md:max-h-none md:overflow-visible`}
          >
            <Group label="עיר">
              {cities.map((c) => (
                <Pill key={c} active={f.city === c} onClick={() => set("city", c)}>
                  {c}
                </Pill>
              ))}
            </Group>

            <Group label="מטבח">
              {cuisines.map((c) => (
                <Pill key={c} active={f.cuisine === c} onClick={() => set("cuisine", c)}>
                  {c}
                </Pill>
              ))}
            </Group>

            <div className="flex flex-wrap gap-x-6 gap-y-2.5">
              <Group label="כשרות">
                {(["kosher", "supervised"] as Kashrut[]).map((k) => (
                  <Pill key={k} active={f.kashrut === k} onClick={() => set("kashrut", k)}>
                    {k === "kosher" ? "כשר" : "בפיקוח"}
                  </Pill>
                ))}
              </Group>

              <Group label="מחיר">
                {PRICE_STEPS.map((p) => (
                  <Pill key={p} active={f.maxPrice === p} onClick={() => set("maxPrice", p)}>
                    עד ₪{p}
                  </Pill>
                ))}
              </Group>

              <Group label="פסק דין">
                <Pill active={f.verdict === "worth"} onClick={() => set("verdict", "worth")}>
                  שווה
                </Pill>
                <Pill active={f.verdict === "skip"} onClick={() => set("verdict", "skip")}>
                  לא שווה
                </Pill>
              </Group>
            </div>
          </div>
        </div>
      </div>

      <p
        className="tnum mt-6 font-data text-[13px] font-bold text-muted"
        role="status"
        aria-live="polite"
      >
        {results.length} ביקורות
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-line bg-surface p-10 text-center">
          <p className="m-0 text-[1.1rem] font-extrabold">אין לי עדיין משהו שעונה על זה.</p>
          <p className="m-0 mt-2 text-muted">
            נסו לוותר על אחד הפילטרים, או שלחו לי את המסעדה שאתם מחפשים ואלך לבדוק.
          </p>
        </div>
      ) : view === "map" ? (
        mapResults.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-line bg-surface p-10 text-center">
            <p className="m-0 text-[1.1rem] font-extrabold">כל התוצאות האלה בחו״ל.</p>
            <p className="m-0 mt-2 text-muted">
              המפה מראה רק את מה שבארץ. עברו לתצוגת רשימה כדי לראות אותן.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <ReviewMap key={mapResults.map((r) => r.slug).join("|")} reviews={mapResults} />
          </div>
        )
      ) : (
        <div className="mt-4 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(265px,1fr))]">
          {results.map((r) => (
            <ReviewCard key={r.slug} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
