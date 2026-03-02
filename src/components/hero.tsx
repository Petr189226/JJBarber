"use client";

import Link from "next/link";
import Image from "next/image";
import { getBookingLink } from "@/lib/booking-url";
import { useLocale } from "@/lib/locale-context";

const HERO_IMAGE = "/hero.png";

const HERO_BADGE_KEYS = ["heroBadgeRating", "heroBadgeLocations", "heroBadgeBooking"] as const;

export function Hero() {
  const { t } = useLocale();
  return (
    <section
      className="relative min-h-[85vh] overflow-hidden border-b border-[var(--border)]"
      aria-label="Úvodní sekce"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="hero-fade-in relative mx-auto h-20 w-40 sm:h-24 sm:w-48 md:h-28 md:w-56">
            <Image
              src="/logo.png"
              alt="J&J Barber Shop"
              fill
              sizes="(min-width: 768px) 224px, (min-width: 640px) 192px, 160px"
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>

          <h1 className="hero-fade-in hero-fade-in-delay-1 mt-6 text-[2rem] font-bold leading-tight tracking-tight text-white drop-shadow-md sm:text-[2.35rem] md:text-[3.15rem]">
            {t("heroHeadline")}
          </h1>

          <div className="hero-fade-in hero-fade-in-delay-2 mt-6 flex flex-wrap items-center justify-center gap-2">
            {HERO_BADGE_KEYS.map((key, i) => (
              <span
                key={key}
                className={`rounded-full border border-[var(--accent)]/40 bg-black/25 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md ${i === 0 ? "hero-badge-stagger-0" : i === 1 ? "hero-badge-stagger-1" : "hero-badge-stagger-2"}`}
              >
                {t(key)}
              </span>
            ))}
          </div>

          <div className="hero-fade-in hero-fade-in-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <Link
              {...getBookingLink()}
              className="cta-primary-hero inline-flex w-full min-h-[52px] items-center justify-center rounded-lg bg-[var(--accent)] px-8 py-4 text-lg font-bold text-black shadow-lg hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-black/50 focus-visible:ring-2 sm:w-auto"
              aria-label={t("heroAriaBook")}
            >
              {t("heroCtaBook")}
            </Link>
            <a
              href="#pobocky"
              className="cta-secondary-hero inline-flex w-full min-h-[48px] items-center justify-center rounded-lg border-2 border-white/40 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:border-[var(--accent)]/60 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-black/50 focus-visible:ring-2 sm:w-auto"
              aria-label={t("heroAriaBranch")}
            >
              {t("heroCtaPickBranch")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
