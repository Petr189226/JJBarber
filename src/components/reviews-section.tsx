"use client";

import dynamic from "next/dynamic";

const ReviewsCarousel = dynamic(
  () => import("@/components/reviews-carousel").then((m) => ({ default: m.ReviewsCarousel })),
  { ssr: false }
);

export function ReviewsSection() {
  return <ReviewsCarousel />;
}
