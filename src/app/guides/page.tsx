import type { Metadata } from "next";
import Link from "next/link";
import FoodPhoto from "@/components/media/FoodPhoto";
import Reveal from "@/components/motion/Reveal";
import { Container, SectionHead } from "@/components/ui/Section";
import { allGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "מדריכים",
  description: "אוספים מדורגים: בורגרים, ראמן, איטלקיות, קינוחים וארוחות בוקר.",
};

export default function GuidesPage() {
  const guides = allGuides();

  return (
    <Container className="py-12">
      <SectionHead
        kicker="אוספים"
        title="מדריכים"
        level={1}
        lede="כל מדריך הוא דירוג, לא רשימה. יש מקום ראשון, ואני מוכנה להגן עליו."
      />

      <Reveal className="mt-10 grid gap-5 md:grid-cols-2" stagger={60}>
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group relative flex aspect-[16/10] items-end overflow-hidden rounded-lg p-7"
          >
            <FoodPhoto
              tone={g.tone}
              scrim
              innerClassName="transition-transform duration-[700ms] ease-[var(--ease-out)] group-hover:scale-[1.06] motion-reduce:transform-none"
            />
            <span className="relative z-10 max-w-[40ch]">
              <span className="block font-display text-[clamp(32px,4.6vw,46px)] font-bold leading-[0.95] text-white">
                {g.title}
              </span>
              <span className="mt-2 block text-[0.97rem] leading-snug text-white/85">
                {g.blurb}
              </span>
              <span className="tnum mt-3 inline-block rounded-full bg-yolk px-3 py-1 font-data text-[12px] font-black text-[#1A1412]">
                {g.ranking.length} מקומות
              </span>
            </span>
          </Link>
        ))}
      </Reveal>
    </Container>
  );
}
