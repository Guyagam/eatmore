/**
 * Content model for eat.mor.e.
 *
 * These fields come straight from the spec: every one of them exists because
 * Mor already writes it on the cover of her posts. If a field here isn't used
 * on a card, a filter or a cover, it shouldn't be in the model.
 *
 * The data layer behind this (src/lib/data) is a local seed today. Swapping it
 * for a CMS means replacing those modules; nothing else in the app imports the
 * data files directly — everything goes through the query helpers.
 */

/** The photographic tone of a dish, used by the placeholder renderer until real
 *  photography is in. Replacing <FoodPhoto> with next/image retires this. */
export type Tone = "burger" | "ramen" | "sweet" | "green" | "coffee" | "pizza";

export type Verdict = "worth" | "skip";

export type Kashrut = "kosher" | "not" | "supervised";

export type Cuisine =
  | "ראמן"
  | "בורגרים"
  | "בשרים"
  | "איטלקי"
  | "קינוחים"
  | "ארוחת בוקר"
  | "בתי קפה"
  | "אסייתי"
  | "מקסיקני"
  | "פיצה";

export interface Review {
  slug: string;
  /** The cover line — the sentence she'd put in white over the photo. */
  title: string;
  /** The second line on the cover. Short. */
  subtitle?: string;
  restaurant: string;
  city: string;
  address: string;
  geo: { lat: number; lng: number };
  cuisine: Cuisine[];
  kashrut: Kashrut;
  /** Per-diner spend in shekels. Drives the price filter and the yellow badge. */
  price: number;
  /** 1–10, one decimal. */
  score: number;
  verdict: Verdict;
  /** The one line that appears on the card. 140 chars max. */
  quote: string;
  /** Full review body, paragraph per entry. */
  body: string[];
  /** Practical details shown under the review. */
  details: { label: string; value: string }[];
  tone: Tone;
  /** Link back to the original reel. */
  reel?: string;
  date: string; // ISO
  abroad?: string; // destination name when the review is from a trip
}

export interface Guide {
  slug: string;
  title: string;
  blurb: string;
  tone: Tone;
  /** Review slugs, in ranked order. Position 1 is the winner. */
  ranking: string[];
}

export interface Destination {
  slug: string;
  name: string;
  tone: Tone;
  blurb: string;
  reviewSlugs: string[];
}

export interface Filters {
  q: string;
  city: string | null;
  cuisine: Cuisine | null;
  kashrut: Kashrut | null;
  maxPrice: number | null;
  verdict: Verdict | null;
  sort: "recent" | "score" | "price";
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  city: null,
  cuisine: null,
  kashrut: null,
  maxPrice: null,
  verdict: null,
  sort: "recent",
};

export const KASHRUT_LABEL: Record<Kashrut, string> = {
  kosher: "כשר",
  supervised: "בפיקוח",
  not: "לא כשר",
};

export const VERDICT_LABEL: Record<Verdict, string> = {
  worth: "שווה את זה",
  skip: "לא שווה",
};
