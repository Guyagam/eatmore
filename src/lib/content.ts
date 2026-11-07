import { REVIEWS } from "@/lib/data/reviews";
import { DESTINATIONS, GUIDES } from "@/lib/data/guides";
import type { Cuisine, Filters, Review } from "@/lib/types";

/**
 * The only module the app queries for content.
 *
 * Everything here is synchronous today because the seed lives in memory. When
 * a CMS replaces src/lib/data, these functions become async and the call sites
 * (all of them server components) just await — no component changes.
 */

const byDate = (a: Review, b: Review) => b.date.localeCompare(a.date);

export function allReviews(): Review[] {
  return [...REVIEWS].sort(byDate);
}

export function reviewBySlug(slug: string): Review | undefined {
  return REVIEWS.find((r) => r.slug === slug);
}

export function reviewsBySlugs(slugs: string[]): Review[] {
  return slugs
    .map((s) => REVIEWS.find((r) => r.slug === s))
    .filter((r): r is Review => Boolean(r));
}

export function latestReviews(n: number): Review[] {
  return allReviews()
    .filter((r) => !r.abroad)
    .slice(0, n);
}

/** The newest review, used as the home page cover. */
export function coverReview(): Review {
  return allReviews()[0];
}

export function skippedReviews(n: number): Review[] {
  return allReviews()
    .filter((r) => r.verdict === "skip")
    .slice(0, n);
}

export function abroadReviews(): Review[] {
  return allReviews().filter((r) => Boolean(r.abroad));
}

export function allGuides() {
  return GUIDES;
}

export function guideBySlug(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

export function allDestinations() {
  return DESTINATIONS;
}

export function destinationBySlug(slug: string) {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function allCities(): string[] {
  return Array.from(new Set(REVIEWS.filter((r) => !r.abroad).map((r) => r.city))).sort(
    (a, b) => a.localeCompare(b, "he")
  );
}

export function allCuisines(): Cuisine[] {
  const set = new Set<Cuisine>();
  REVIEWS.forEach((r) => r.cuisine.forEach((c) => set.add(c)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "he"));
}

/** Price brackets offered in the filter bar, in shekels per diner. */
export const PRICE_STEPS = [50, 70, 100] as const;

export function filterReviews(reviews: Review[], f: Filters): Review[] {
  const q = f.q.trim();
  const out = reviews.filter((r) => {
    if (f.city && r.city !== f.city) return false;
    if (f.cuisine && !r.cuisine.includes(f.cuisine)) return false;
    if (f.kashrut && r.kashrut !== f.kashrut) return false;
    if (f.maxPrice && r.price > f.maxPrice) return false;
    if (f.verdict && r.verdict !== f.verdict) return false;
    if (q) {
      const hay = [r.restaurant, r.city, r.title, r.quote, ...r.cuisine].join(" ");
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (f.sort === "score") out.sort((a, b) => b.score - a.score);
  else if (f.sort === "price") out.sort((a, b) => a.price - b.price);
  else out.sort(byDate);

  return out;
}

const HE_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ב${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
