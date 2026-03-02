"use client";

import Link from "next/link";
import Image from "next/image";
import { Scissors, MapPin, Instagram, Facebook, Phone } from "lucide-react";
import { getBookingLink, getBookingLinkForBranch } from "@/lib/booking-url";
import { Hero } from "@/components/hero";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { ReviewsSection } from "@/components/reviews-section";
import { useLocale } from "@/lib/locale-context";

const BRANCHES = [
  {
    id: "1",
    name: "Vršovice",
    address: "Vršovická 7/27, 101 00 Praha 10",
    image: "/branches/vrsovice.png",
    rating: "4.9",
    reviewsCount: "1500+",
    opening: "Po–Pá 9:00–20:00, So 9:00–18:00",
  },
  {
    id: "2",
    name: "Strašnice",
    address: "Černokostelecká 830/23, 100 00 Praha 10",
    image: "/branches/strasnice.png",
    rating: "4.9",
    reviewsCount: "1500+",
    opening: "Po–Pá 9:00–20:00, So 9:00–18:00",
  },
];

const SERVICES = [
  { id: "1", durationMinutes: 45, basePriceCzk: 490, nameKey: "service1Name" as const, benefitKey: "service1Benefit" as const },
  { id: "2", durationMinutes: 60, basePriceCzk: 690, nameKey: "service2Name", benefitKey: "service2Benefit" },
  { id: "3", durationMinutes: 30, basePriceCzk: 390, nameKey: "service3Name", benefitKey: "service3Benefit" },
  { id: "4", durationMinutes: 75, basePriceCzk: 790, nameKey: "service4Name", benefitKey: "service4Benefit", isPopular: true },
  { id: "5", durationMinutes: 30, basePriceCzk: 450, nameKey: "service5Name", benefitKey: "service5Benefit" },
];

const TEAM = [
  { name: "Kuba", photo: "/barbers/kuba.png" },
  { name: "Pepa", photo: "/barbers/pepa.png" },
  { name: "Oliver", photo: "/barbers/oliver.png" },
  { name: "Milan", photo: "/barbers/milan.png" },
  { name: "Honza", photo: "/barbers/honza.png" },
  { name: "Ondra", photo: "/barbers/ondra.png" },
  { name: "Vojta", photo: "/barbers/vojta.png" },
  { name: "Fila", photo: "/barbers/fila.png" },
];

export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="barbershop-bg min-h-[calc(100dvh-56px)] relative pb-20 md:pb-0">
      <div className="relative z-10">
      <Hero />

      <section id="pobocky" className="section-alt scroll-mt-20 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">{t("branchesTitle")}</h2>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[var(--accent)]" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-gray-300 leading-relaxed">
            {t("branchesIntro")}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {BRANCHES.map((b) => (
              <div
                key={b.id}
                className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition hover:border-[var(--accent)]/50 hover:shadow-[0_0_24px_rgba(251,191,36,0.12)]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={b.image}
                    alt={b.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20">
                    <MapPin className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{b.name}</h3>
                      <span className="rounded-full border border-[var(--accent)]/40 bg-black/30 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                        ⭐ {b.rating}/5 ({b.reviewsCount})
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-300">{b.address}</p>
                    <p className="mt-1 text-xs text-gray-400">{b.opening}</p>
                    <Link
                      {...getBookingLinkForBranch(b)}
                      className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)]"
                    >
                      {t("branchBook")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sluzby" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" aria-hidden />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("servicesTitle")}</h2>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[var(--accent)]" />
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            {t("servicesIntro")}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/50"
            >
              {"isPopular" in s && s.isPopular && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-bold text-black">
                  {t("servicePopular")}
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/20">
                <Scissors className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{t(s.nameKey)}</h3>
              <p className="mt-1 text-sm text-[var(--accent)]/90">{t(s.benefitKey)}</p>
              <p className="mt-2 text-sm text-gray-300">
                {s.durationMinutes} {t("serviceMinFrom")} {s.basePriceCzk} Kč
              </p>
              <Link
                {...getBookingLink()}
                className="mt-4 flex w-full items-center justify-center rounded-lg bg-[var(--accent)] py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)]"
              >
                {t("serviceBook")}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="cenik" className="section-alt scroll-mt-20 mx-auto max-w-6xl border-t border-[var(--border)] px-4 py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("pricingTitle")}</h2>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[var(--accent)]" />
          <p className="mx-auto mt-4 max-w-xl text-gray-300">{t("pricingIntro")}</p>
          <Link
            href="/cenik"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-black transition hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)]"
          >
            {t("pricingViewFull")}
          </Link>
        </div>
      </section>

      <section id="tym" className="scroll-mt-20 mx-auto max-w-6xl border-t border-[var(--border)] px-4 py-20 sm:py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-[var(--accent)]/50 rounded-full" aria-hidden />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--accent)] sm:text-4xl">{t("teamTitle")}</h2>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[var(--accent)]" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-gray-300">
            {t("teamIntro")}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TEAM.map((barber) => (
            <div
              key={barber.name}
              className="flex flex-col items-center text-center transition-transform duration-200 ease-out hover:scale-[1.2]"
            >
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <Image src={barber.photo} alt={barber.name} fill sizes="(max-width: 640px) 50vw, 200px" className="object-cover" />
              </div>
              <p className="mt-3 text-lg font-bold tracking-wide text-[var(--accent)]">{barber.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            {...getBookingLink()}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-black shadow-lg transition hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)]"
          >
            {t("teamCtaBook")}
          </Link>
        </div>
      </section>

      <section id="poukaz" className="section-alt scroll-mt-20 mx-auto max-w-6xl border-t border-[var(--border)] px-4 py-20 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("voucherTitle")}</h2>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[var(--accent)]" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-gray-300">
            {t("voucherIntro")}
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center">
          <div className="relative aspect-[1024/726] w-full max-w-md overflow-hidden rounded-3xl bg-[var(--card)] shadow-xl shadow-black/20">
            <Image
              src="/darkovy-poukaz-novy.png"
              alt="Dárkový poukaz J&J Barber Shop"
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-contain"
            />
          </div>
          <Link
            href="/voucher"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-8 py-3 font-semibold text-black hover:bg-[var(--accent-hover)]"
          >
            {t("voucherOrder")}
          </Link>
        </div>
      </section>

      <section id="kontakt" className="scroll-mt-20 mx-auto max-w-6xl px-4 pb-16 pt-20 sm:pb-20 sm:pt-24">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 sm:p-10">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">{t("contactTitle")}</h2>
          <p className="mt-2 text-center text-gray-300">{t("contactIntro")}</p>
          <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/jjbarbershops/"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/jjbarbershopvrsovicka"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
                <span className="hidden sm:inline">Facebook</span>
              </a>
            </div>
            <a
              href="tel:+420777507662"
              className="flex min-h-[44px] items-center gap-2 text-lg font-semibold tracking-wide text-white transition hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)]"
            >
              <Phone className="h-5 w-5" />
              777 507 662
            </a>
          </div>
          <p className="mt-6 text-center">
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="text-sm text-gray-400 transition hover:text-[var(--accent)]"
            >
              {t("contactPrivacy")}
            </Link>
          </p>
        </div>
      </section>
    </div>
    <StickyMobileCTA />
    </div>
  );
}
