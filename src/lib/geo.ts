import type { Review } from "@/lib/types";

/**
 * Projection for the review map.
 *
 * Equirectangular with a cosine correction at the centre latitude — at the
 * scale this map works on (a few dozen km of the coastal plain) that is
 * indistinguishable from a proper Mercator, and it keeps the maths readable.
 *
 * Two decisions worth knowing about:
 *
 * 1. The scale is the SAME on both axes. A map that stretches one axis to fill
 *    a pretty box is lying about distance, and distance is the whole question
 *    this map answers. So the CANVAS is fitted to the data instead: the coastal
 *    plain is tall and narrow, so the map comes out tall and narrow.
 *
 * 2. The frame fits the reviews it is handed, not a fixed country outline. It
 *    keeps working unchanged the first time she reviews in Haifa.
 */

export interface Projected {
  review: Review;
  x: number;
  y: number;
}

export interface Projection {
  points: Projected[];
  width: number;
  height: number;
  /** Screen x of the westernmost point, so the sea can be drawn beside it. */
  westX: number;
}

const PAD = { top: 56, right: 40, bottom: 56, left: 76 } as const;

export function projectReviews(
  reviews: Review[],
  height = 720,
  minWidth = 300,
  maxWidth = 620
): Projection {
  if (reviews.length === 0) {
    return { points: [], width: minWidth, height, westX: PAD.left };
  }

  const lats = reviews.map((r) => r.geo.lat);
  const lngs = reviews.map((r) => r.geo.lng);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const k = Math.cos((midLat * Math.PI) / 180);

  const u = (lng: number) => lng * k; // planar east
  const minU = Math.min(...lngs.map(u));
  const maxU = Math.max(...lngs.map(u));
  const minV = Math.min(...lats);
  const maxV = Math.max(...lats);

  // A single point, or a dead-straight line of them, would divide by zero.
  const spanU = maxU - minU || 0.01;
  const spanV = maxV - minV || 0.01;

  const innerH = height - PAD.top - PAD.bottom;
  // Equal scale on both axes, derived from the vertical fit.
  const scale = innerH / spanV;

  const innerW = Math.max(
    minWidth - PAD.left - PAD.right,
    Math.min(maxWidth - PAD.left - PAD.right, spanU * scale)
  );
  const width = innerW + PAD.left + PAD.right;

  // If the clamp kicked in, centre the strip in whatever width we ended up with.
  const offsetX = PAD.left + (innerW - spanU * scale) / 2;

  return {
    points: reviews.map((review) => ({
      review,
      x: offsetX + (u(review.geo.lng) - minU) * scale,
      y: PAD.top + (maxV - review.geo.lat) * scale,
    })),
    width,
    height,
    westX: offsetX,
  };
}

/** Pin radius: bigger means she liked it more. */
export function pinRadius(score: number): number {
  return 6 + Math.max(0, Math.min(10, score)) * 0.55;
}

export interface Placed extends Projected {
  r: number;
  /** Where the name sits relative to the pin, after collision resolution. */
  labelY: number;
  labelAnchor: "start" | "middle" | "end";
}

/**
 * Greedy label placement.
 *
 * Two restaurants 400m apart produce pins that overlap at this scale, and two
 * names stacked on the same baseline are unreadable. Each label is tried below
 * the pin first, then above, then pushed out to the side — the first position
 * that clears everything already placed wins.
 */
export function placeLabels(points: Projected[]): Placed[] {
  const taken: { x: number; y: number }[] = [];
  const CLEAR_Y = 15;
  const CLEAR_X = 86;

  const free = (x: number, y: number) =>
    !taken.some((t) => Math.abs(t.y - y) < CLEAR_Y && Math.abs(t.x - x) < CLEAR_X);

  // North to south, so the order on screen matches the order of resolution.
  return [...points]
    .sort((a, b) => a.y - b.y)
    .map((p) => {
      const r = pinRadius(p.review.score);
      const options: { labelY: number; labelAnchor: Placed["labelAnchor"]; x: number }[] = [
        { labelY: p.y + r + 15, labelAnchor: "middle", x: p.x },
        { labelY: p.y - r - 8, labelAnchor: "middle", x: p.x },
        { labelY: p.y + 4, labelAnchor: "start", x: p.x + r + 8 },
        { labelY: p.y + 4, labelAnchor: "end", x: p.x - r - 8 },
        { labelY: p.y + r + 30, labelAnchor: "middle", x: p.x },
      ];
      const pick = options.find((o) => free(o.x, o.labelY)) ?? options[0];
      taken.push({ x: pick.x, y: pick.labelY });
      return { ...p, r, labelY: pick.labelY, labelAnchor: pick.labelAnchor };
    });
}
