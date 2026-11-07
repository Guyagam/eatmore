import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverHero from "@/components/review/CoverHero";
import ReviewCard from "@/components/review/ReviewCard";
import Reveal from "@/components/motion/Reveal";
import { KashrutBadge, PriceBadge, Score, TagBadge, VerdictStamp } from "@/components/review/Bits";
import { Container } from "@/components/ui/Section";
import { allReviews, formatDate, reviewBySlug } from "@/lib/content";
import { KASHRUT_LABEL } from "@/lib/types";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allReviews().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const review = reviewBySlug(slug);
  if (!review) return {};
  return {
    title: `${review.restaurant}, ${review.city}`,
    description: review.quote,
  };
}

export default async function ReviewPage({ params }: Params) {
  const { slug } = await params;
  const review = reviewBySlug(slug);
  if (!review) notFound();

  const more = allReviews()
    .filter((r) => r.slug !== review.slug && r.cuisine.some((c) => review.cuisine.includes(c)))
    .slice(0, 3);

  return (
    <>
      <Container className="pt-4">
        <CoverHero review={review} kicker={formatDate(review.date)} />
      </Container>

      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ── the verdict, above everything ── */}
          <article className="min-w-0">
            <div className="flex flex-wrap items-center gap-4 border-b border-line pb-7">
              <Score value={review.score} size="xl" />
              <div className="min-w-0">
                <h1 className="m-0 text-[clamp(26px,4vw,38px)] font-extrabold leading-tight">
                  {review.restaurant}
                </h1>
                <p className="m-0 font-data text-[14px] text-muted">
                  {review.address}
                </p>
              </div>
              <div className="ms-auto">
                <VerdictStamp verdict={review.verdict} />
              </div>
            </div>

            <p className="mt-7 border-s-[3px] border-chili ps-4 text-[1.22rem] font-bold leading-relaxed">
              {review.quote}
            </p>

            <div className="mt-8 grid gap-5 text-[1.05rem] leading-[1.75] [max-width:65ch]">
              {review.body.map((para, i) => (
                <p key={i} className="m-0">
                  {para}
                </p>
              ))}
            </div>

            {review.reel && (
              <a
                href={review.reel}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-[48px] items-center rounded-sm border-2 border-ink px-6 font-data text-[14px] font-black transition-colors duration-200 hover:bg-ink hover:text-paper"
              >
                לריל המקורי באינסטגרם
              </a>
            )}
          </article>

          {/* ── practical details ── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-line bg-surface p-6">
              <h2 className="m-0 font-data text-[11.5px] font-black tracking-[0.13em] text-muted">
                לפני שאתם הולכים
              </h2>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <PriceBadge price={review.price} />
                <KashrutBadge kashrut={review.kashrut} />
                {review.cuisine.map((c) => (
                  <TagBadge key={c}>{c}</TagBadge>
                ))}
              </div>

              <dl className="mt-5 grid gap-3.5">
                {review.details.map((d) => (
                  <div key={d.label} className="border-t border-line pt-3.5 first:border-0 first:pt-0">
                    <dt className="font-data text-[11.5px] font-black tracking-[0.1em] text-muted">
                      {d.label}
                    </dt>
                    <dd className="m-0 mt-1 text-[0.95rem] leading-snug">{d.value}</dd>
                  </div>
                ))}
                <div className="border-t border-line pt-3.5">
                  <dt className="font-data text-[11.5px] font-black tracking-[0.1em] text-muted">
                    כשרות
                  </dt>
                  <dd className="m-0 mt-1 text-[0.95rem]">{KASHRUT_LABEL[review.kashrut]}</dd>
                </div>
              </dl>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${review.geo.lat},${review.geo.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex min-h-[48px] items-center justify-center rounded-sm bg-ink px-5 font-data text-[14px] font-black text-paper transition-opacity duration-200 hover:opacity-90"
              >
                ניווט לכאן
              </a>
            </div>
          </aside>
        </div>
      </Container>

      {more.length > 0 && (
        <Container className="pb-16">
          <h2 className="font-display text-[clamp(28px,4.4vw,46px)] font-bold leading-[0.96]">
            באותו ראש
          </h2>
          <Reveal className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(265px,1fr))]">
            {more.map((r) => (
              <ReviewCard key={r.slug} review={r} />
            ))}
          </Reveal>
          <p className="mt-6">
            <Link
              href="/reviews"
              className="inline-flex min-h-[44px] items-center font-data font-bold underline underline-offset-4"
            >
              לכל הביקורות
            </Link>
          </p>
        </Container>
      )}
    </>
  );
}
