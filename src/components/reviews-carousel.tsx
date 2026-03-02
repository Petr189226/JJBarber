"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

const REVIEWS = [
  { text: "Jak již píší lidé co navštívili předem mnou, maximální spokojenost. Takhle má vypadat služba, vše pro zákazníka, nic není problém. Výsledek práce na vysoké úrovni.", name: "Karel Vyhn" },
  { text: "Chodím do J&J pravidelně a vždy jsem spokojený. Je v podstatě jedno, ke komu se objednáte, všichni jsou dobří. Navíc za skvělou cenu. Doporučuji!", name: "Vojtěch Kunetka" },
  { text: "Nejlepší barber, kterého jsem kdy zkusil. Chodím sem již cca 4 roky a nikdy jsem nebyl jinde! Doporučuji zakladatele Kubu!", name: "David Omáčka" },
  { text: "Našel jsem je podle recenzí a nezklamali. Max. spokojenost, profesionální přístup a celkově příjemné prostředí.", name: "Tomáš Bureš" },
  { text: "Barbershop na vysoké úrovni, poměr cena–kvalita se nedá srovnat. V J&J jsem to našel.", name: "Martin Kovář" },
  { text: "Super barber shop. Jestli zvažujete kam jít, tak jedině sem. Barber Milan byl naprostý profík.", name: "Jakub Novák" },
  { text: "Příjemná atmosféra, skvělá práce. Střih i vousy přesně podle přání. Určitě doporučuji.", name: "Ondřej Svoboda" },
  { text: "Konečně barber, kde vás nepospíchají a dělají to pořádně. J&J má můj vstup na stálo.", name: "Filip Horák" },
];

export function ReviewsCarousel() {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const total = REVIEWS.length;

  const scrollToIndex = useCallback((i: number) => {
    const cont = scrollRef.current;
    const card = cardRef.current;
    if (!cont || !card) return;
    const gap = 24;
    const step = card.offsetWidth + gap;
    const maxScroll = Math.max(0, cont.scrollWidth - cont.clientWidth);
    const targetScroll = Math.min(i * step, maxScroll);
    cont.scrollTo({ left: targetScroll, behavior: "smooth" });
    setIndex(i);
  }, []);

  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont) return;
    const onScroll = () => {
      const card = cardRef.current;
      if (!card) return;
      const gap = 24;
      const step = card.offsetWidth + gap;
      const maxScroll = Math.max(0, cont.scrollWidth - cont.clientWidth);
      if (maxScroll <= 0) {
        setIndex(0);
        return;
      }
      if (cont.scrollLeft >= maxScroll - 2) {
        setIndex(total - 1);
        return;
      }
      const i = Math.round(cont.scrollLeft / step);
      setIndex(Math.min(i, total - 1));
    };
    cont.addEventListener("scroll", onScroll, { passive: true });
    return () => cont.removeEventListener("scroll", onScroll);
  }, [total]);

  return (
    <section id="recenze" className="scroll-mt-20 border-t border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("reviewsTitle")}</h2>
            <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[var(--accent)] sm:mx-0" />
            <p className="mx-auto mt-4 max-w-xl text-gray-300 sm:mx-0">{t("reviewsIntro")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
              {t("reviewsRating")}
            </span>
            <a
              href="https://www.google.com/search?sa=X&q=JJ+Barber+Shop+-+Vr%C5%A1ovice+Recenze&tbm=lcl&hl=cs-CZ#lkt=LocalPoiReviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
            >
              {t("reviewsViewAll")}
            </a>
          </div>
        </div>

        {/* Desktop: 3 recenze bez slideru */}
        <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-3">
          {REVIEWS.slice(0, 3).map((r, i) => (
            <div
              key={i}
              className="flex min-h-[220px] flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <p className="flex-1 text-base leading-relaxed text-gray-100">„{r.text}"</p>
              <p className="mt-4 font-semibold text-white">{r.name}</p>
            </div>
          ))}
        </div>

        {/* Mobile: slider */}
        <div className="flex items-stretch gap-3 sm:gap-4 md:hidden">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            aria-label="Předchozí recenze"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)]/60 bg-[var(--card)] text-white transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div
            ref={scrollRef}
            className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max gap-6">
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  ref={i === 0 ? cardRef : undefined}
                  className="w-[85vw] shrink-0 snap-start sm:w-[340px] md:w-[380px]"
                >
                  <div className="flex min-h-[240px] flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
                    <p className="flex-1 text-base leading-relaxed text-gray-100">„{r.text}"</p>
                    <p className="mt-4 font-semibold text-white">{r.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToIndex(Math.min(total - 1, index + 1))}
            disabled={index >= total - 1}
            aria-label="Další recenze"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)]/60 bg-[var(--card)] text-white transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2 md:hidden">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Recenze ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-[var(--accent)]" : "w-2 bg-[var(--border)] hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
