import Link from "next/link";
import FoodPhoto from "@/components/media/FoodPhoto";
import { KashrutBadge, PriceBadge, Score, TagBadge, VerdictStamp } from "@/components/review/Bits";
import type { Review } from "@/lib/types";

/**
 * The atom of the whole site. Same frame everywhere: archive, search, city
 * page, guide. Score in the corner, name, where, one line in her voice,
 * the filters as tags, and the verdict at the bottom.
 */
export default function ReviewCard({
  review,
  compact = false,
  rank,
}: {
  review: Review;
  compact?: boolean;
  rank?: number;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-paper transition-[transform,box-shadow] duration-[var(--t-base)] ease-[var(--ease-out)] hover:-translate-y-1.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.13)] motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative aspect-[4/3] overflow-hidden">
        <FoodPhoto
          tone={review.tone}
          innerClassName="transition-transform duration-[620ms] ease-[var(--ease-out)] group-hover:scale-[1.08] motion-reduce:transform-none motion-reduce:transition-none"
        />
        <span className="absolute start-2.5 top-2.5 z-10">
          <Score value={review.score} size="sm" />
        </span>
        {typeof rank === "number" && (
          <span className="tnum absolute end-2.5 top-2.5 z-10 inline-flex h-8 min-w-8 items-center justify-center rounded-sm bg-yolk px-2 font-data text-[15px] font-black text-[#1A1412]">
            {rank}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-4 pb-5">
        <div>
          <h3 className="text-[1.15rem] font-extrabold leading-tight">
            <Link
              href={`/reviews/${review.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {review.restaurant}
            </Link>
          </h3>
          <p className="m-0 font-data text-[13px] text-muted">
            {review.city} · {review.cuisine[0]}
          </p>
        </div>

        {!compact && (
          <p className="m-0 border-s-[3px] border-chili ps-3 text-[0.95rem] leading-relaxed">
            {review.quote}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <PriceBadge price={review.price} />
          <KashrutBadge kashrut={review.kashrut} />
          {!compact && <TagBadge>{review.cuisine[0]}</TagBadge>}
        </div>

        <div className="mt-auto pt-1">
          <VerdictStamp verdict={review.verdict} size="sm" />
        </div>
      </div>
    </article>
  );
}
