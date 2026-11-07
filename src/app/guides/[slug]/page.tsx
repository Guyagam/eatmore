import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReviewCard from "@/components/review/ReviewCard";
import Reveal from "@/components/motion/Reveal";
import { Container, SectionHead } from "@/components/ui/Section";
import { allGuides, guideBySlug, reviewsBySlugs } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.blurb };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const ranked = reviewsBySlugs(guide.ranking);

  return (
    <Container className="py-12">
      <SectionHead kicker="מדריך" title={guide.title} lede={guide.blurb} />

      <Reveal
        className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(265px,1fr))]"
        stagger={50}
      >
        {ranked.map((r, i) => (
          <ReviewCard key={r.slug} review={r} rank={i + 1} />
        ))}
      </Reveal>

      <p className="mt-10 max-w-[58ch] text-muted">
        הדירוג מתעדכן. אם מקום משתפר או מידרדר אני חוזרת, בודקת שוב, ומזיזה אותו — עם תאריך
        הביקור המעודכן בעמוד שלו.
      </p>
    </Container>
  );
}
