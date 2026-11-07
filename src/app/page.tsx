import Link from "next/link";
import CoverHero from "@/components/review/CoverHero";
import ReviewCard from "@/components/review/ReviewCard";
import GuidesTrack from "@/components/home/GuidesTrack";
import NotWorthIt from "@/components/home/NotWorthIt";
import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/motion/MagneticButton";
import FoodPhoto from "@/components/media/FoodPhoto";
import ReviewMap from "@/components/map/ReviewMap";
import { Container, SectionHead } from "@/components/ui/Section";
import {
  abroadReviews,
  allCities,
  allGuides,
  allReviews,
  coverReview,
  latestReviews,
  skippedReviews,
} from "@/lib/content";

export default function Home() {
  const cover = coverReview();
  const latest = latestReviews(6);
  const guides = allGuides();
  const skipped = skippedReviews(3);
  const abroad = abroadReviews().slice(0, 3);
  const cities = allCities();

  return (
    <>
      <Container className="pt-4">
        <CoverHero review={cover} kicker="הביקורת האחרונה" href={`/reviews/${cover.slug}`} />
      </Container>

      {/* ── quick entry by city ── */}
      <Container className="py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-data text-[11.5px] font-black tracking-[0.12em] text-muted">
            לפי עיר
          </span>
          {cities.map((c) => (
            <Link
              key={c}
              href={`/reviews?city=${encodeURIComponent(c)}`}
              className="min-h-[44px] rounded-full border border-line px-4 py-2 font-data text-[14px] font-bold transition-colors duration-[var(--t-base)] hover:border-ink"
            >
              {c}
            </Link>
          ))}
        </div>
      </Container>

      {/* ── latest ── */}
      <Container className="py-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHead
            kicker="מה חדש"
            title="הביקורות האחרונות"
            lede="ציון, מחיר ופסק דין. אם משהו פה לא ברור לכם — זו אשמתי, תכתבו לי."
            id="latest-h"
          />
          <MagneticButton href="/reviews" variant="ghost">
            לכל הביקורות
          </MagneticButton>
        </div>

        <Reveal
          className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(265px,1fr))]"
          stagger={40}
        >
          {latest.map((r) => (
            <ReviewCard key={r.slug} review={r} />
          ))}
        </Reveal>
      </Container>

      {/* ── guides: pinned horizontal ── */}
      <GuidesTrack guides={guides} />

      {/* ── the band nobody else runs ── */}
      <NotWorthIt reviews={skipped} />

      {/* ── the map ── */}
      <Container className="py-20">
        <SectionHead
          kicker="לפי מיקום"
          title="מה יש לידכם"
          lede="כל סיכה היא מקום שהייתי בו. ירוק שווה, אדום לא, והגודל הוא הציון."
          id="map-h"
        />
        <div className="mt-10">
          <ReviewMap reviews={allReviews()} />
        </div>
      </Container>

      {/* ── abroad ── */}
      <Container className="py-20">
        <SectionHead
          kicker="חו״ל"
          title="מה אכלתי בחוץ"
          lede="אותם כללים, רק שהמחירים מתורגמים ואני לא יכולה לחזור בשבוע הבא לבדוק שוב."
          id="abroad-h"
        />
        <Reveal className="mt-10 grid gap-5 md:grid-cols-3" stagger={70}>
          {abroad.map((r) => (
            <Link
              key={r.slug}
              href={`/reviews/${r.slug}`}
              className="group relative flex aspect-[16/11] items-end overflow-hidden rounded-lg p-6"
            >
              <FoodPhoto
                tone={r.tone}
                scrim
                innerClassName="transition-transform duration-[700ms] ease-[var(--ease-out)] group-hover:scale-[1.07] motion-reduce:transform-none"
              />
              <span className="relative z-10">
                <span className="block font-data text-[12px] font-black tracking-[0.14em] text-white/75">
                  {r.abroad}
                </span>
                <span className="mt-1 block font-display text-[32px] font-bold leading-[0.95] text-white">
                  {r.restaurant}
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </Container>

      {/* ── newsletter ── */}
      <Container className="pb-8">
        <div className="rounded-lg border border-line bg-surface p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="m-0 font-display text-[clamp(30px,4.6vw,50px)] font-bold leading-[0.96]">
                ביקורת אחת בשבוע, בלי ספאם
              </h2>
              <p className="mt-3 max-w-[46ch] text-muted">
                מה שפתחתי השבוע, מה שלא שווה, וכמה זה עלה. אפשר להסיר בלחיצה אחת.
              </p>
            </div>
            <form className="grid gap-3" action="/api/subscribe" method="post">
              <label htmlFor="email" className="font-data text-[12px] font-black tracking-[0.12em] text-muted">
                כתובת מייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                dir="ltr"
                className="min-h-[48px] rounded-sm border border-line bg-paper px-3.5 py-2 text-[15px] outline-none transition-colors duration-200 focus:border-ink"
              />
              <button
                type="submit"
                className="min-h-[48px] rounded-sm bg-chili px-6 font-data text-[15px] font-black text-on-accent transition-colors duration-200 hover:bg-ink"
              >
                הרשמה
              </button>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
