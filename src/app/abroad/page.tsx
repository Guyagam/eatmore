import type { Metadata } from "next";
import Link from "next/link";
import FoodPhoto from "@/components/media/FoodPhoto";
import ReviewCard from "@/components/review/ReviewCard";
import Reveal from "@/components/motion/Reveal";
import { Container, SectionHead } from "@/components/ui/Section";
import { allDestinations, reviewsBySlugs } from "@/lib/content";

export const metadata: Metadata = {
  title: "חו״ל",
  description: "מה אכלתי בפראג, בלונדון ובתאילנד — ומה שווה את הנסיעה.",
};

export default function AbroadPage() {
  const destinations = allDestinations();

  return (
    <Container className="py-12">
      <SectionHead
        kicker="מחוץ לארץ"
        title="מה אכלתי בחוץ"
        level={1}
        lede="אותם כללים בדיוק, רק שאני לא יכולה לחזור בשבוע הבא לבדוק שוב — אז אני כותבת רק על מה שאני בטוחה בו."
      />

      <div className="mt-12 grid gap-16">
        {destinations.map((d) => {
          const reviews = reviewsBySlugs(d.reviewSlugs);
          return (
            <section key={d.slug} aria-labelledby={`dest-${d.slug}`}>
              <Link
                href={`/reviews/${d.reviewSlugs[0]}`}
                className="group relative flex aspect-[21/8] items-end overflow-hidden rounded-lg p-7"
              >
                <FoodPhoto
                  tone={d.tone}
                  scrim
                  innerClassName="transition-transform duration-[700ms] ease-[var(--ease-out)] group-hover:scale-[1.06] motion-reduce:transform-none"
                />
                <span className="relative z-10 max-w-[44ch]">
                  <span
                    id={`dest-${d.slug}`}
                    className="block font-display text-[clamp(38px,6vw,68px)] font-bold leading-[0.92] text-white"
                  >
                    {d.name}
                  </span>
                  <span className="mt-2 block text-[1rem] leading-snug text-white/85">
                    {d.blurb}
                  </span>
                </span>
              </Link>

              <Reveal
                className="mt-6 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(265px,1fr))]"
                stagger={40}
              >
                {reviews.map((r) => (
                  <ReviewCard key={r.slug} review={r} />
                ))}
              </Reveal>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
