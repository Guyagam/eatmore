import type { Metadata } from "next";
import ReviewsExplorer from "@/components/review/ReviewsExplorer";
import { Container, SectionHead } from "@/components/ui/Section";
import { allCities, allCuisines, allReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "כל הביקורות",
  description:
    "הארכיון המלא. סינון לפי עיר, מטבח, כשרות ומחיר, ומיון לפי ציון או לפי מה שחדש.",
};

export default function ReviewsPage() {
  return (
    <Container className="py-12">
      <SectionHead
        kicker="הארכיון"
        title="כל הביקורות"
        lede="כל מקום שהייתי בו, עם ציון, מחיר ופסק דין. סננו לפי מה שחשוב לכם."
      />
      <div className="mt-8">
        <ReviewsExplorer
          reviews={allReviews()}
          cities={allCities()}
          cuisines={allCuisines()}
        />
      </div>
    </Container>
  );
}
