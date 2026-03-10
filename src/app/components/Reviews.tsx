import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLanguage } from "../i18n";

const reviews = [
  { id: "01", name: "Vojtěch Kunetka", initials: "VK", rating: 5, text: "Chodím do J&J pravidelně a vždy jsem spokojený. Je v podstatě jedno, ke komu se objednáte, všichni jsou dobří. Navíc za skvělou cenu. Doporučuji!" },
  { id: "02", name: "David Omáčka", initials: "DO", rating: 5, text: "Nejlepší barber, kterého jsem kdy zkusil. Chodím sem již cca 4 roky a nikdy jsem nebyl jinde! Doporučuji zakladatele Kubu! Velmi slušný, příjemný a udělá v podstatě jakýkoliv účes za zlomek ceny konkurence. Díky kluci" },
  { id: "03", name: "Tomáš Tuca", initials: "TT", rating: 5, text: "Našel jsem dle recenzí a nezklamali 🙂 Max. spokojenost, profi přístup a celkově sympatické prostředí. Výborně ostříhán a hlavně vousy upraveny přesně dle představ! Rád se budu vracet!" },
  { id: "04", name: "bald mfka", initials: "bM", rating: 5, text: "Barbershop na vysoké úrovni, poměr cena kvalita se nedá s žádným jiným barbershopem, který jsem vyzkoušel srovnat (vyzkoušel jsem jich nespočet, pač jsem nikde nenašel to pravé) čili v JJ jsem to našel." },
  { id: "05", name: "Pavel Rajdl", initials: "PR", rating: 5, text: "Super barber shop. Jestli zvažujete kam jít, tak jedině sem. Dneska jsem byl poprvé a vím kam budu chodit. Barber Milan byl naprostý profík." },
  { id: "06", name: "Jan Andrle", initials: "JA", rating: 5, text: "Absolutní spokojenost 👍 sice jsem chvíli čekal, ale každá práce vyžaduje svůj čas. Fajn přístup, super kvalita střihu a cena bezkonkurenční 💪👏" },
  { id: "07", name: "Petr Chajda", initials: "PC", rating: 5, text: "Do JJ chodím už delší dobu a vždycky odcházím maximálně spokojený. Skvělá atmosféra, profesionální přístup a hlavně precizní práce. Kluci si dávají záležet na detailech a přesně ví, co dělají. Poměr cena/výkon je za mě bezkonkurenční. Rozhodně doporučuju!" },
  { id: "08", name: "Karel Vyhn", initials: "KV", rating: 5, text: "Jak již píší lidé co navštívili předem mnou, maximální spokojenost. Takhle má ta služba vypadat, vše pro zákazníka, nic není problém. Výsledek práce na vysoké úrovni." },
];

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <Star
      size={14}
      className={filled ? "text-[#C9A255] fill-[#C9A255]" : "text-[#3A3224]"}
    />
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: (typeof reviews)[number]; index: number }) {
  return (
    <div
      className="relative flex flex-col cursor-default"
      style={{
        padding: "1.5rem",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.35s ease",
      }}
    >
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, transparent)",
          transition: "background 0.35s ease",
        }}
      />

      <div
        aria-hidden
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "3.5rem",
          lineHeight: 0.6,
          color: "rgba(201,162,85,0.18)",
          fontWeight: 300,
          userSelect: "none",
          marginBottom: "0.75rem",
        }}
      >
        "
      </div>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.82rem",
          color: "rgba(245,240,232,0.9)",
          lineHeight: 1.9,
          letterSpacing: "0.01em",
          margin: 0,
          flex: 1,
        }}
      >
        {review.text}
      </p>

      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          margin: "1.25rem 0 1rem",
        }}
      />

      <div className="flex items-center gap-3">
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(201,162,85,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.06em",
              color: "#C9A255",
              fontWeight: 500,
            }}
          >
            {review.initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#F5F0E8",
              letterSpacing: "0.02em",
              marginBottom: "3px",
            }}
          >
            {review.name}
          </div>
          <StarRating rating={review.rating} />
        </div>
        <span
          aria-hidden
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.4rem",
            fontWeight: 300,
            color: "rgba(201,162,85,0.16)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export function Reviews() {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    setInView(true);
  }, []);
  const { t } = useLanguage();

  return (
    <section
      id="reviews"
      className="relative py-14 md:py-24 lg:py-28 overflow-hidden scroll-mt-24"
      style={{ background: "#080808", borderTop: "1px solid rgba(201,162,85,0.08)" }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-2%",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(10rem, 18vw, 18rem)",
          fontWeight: 300,
          color: "rgba(201,162,85,0.018)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {t("rev.heading")}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: "40px", height: "1px", background: "#C9A255" }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                color: "#C9A255",
                textTransform: "uppercase",
              }}
            >
              {t("rev.label")}
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-end">
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(3rem, 6vw, 5.4rem)",
                  fontWeight: 300,
                  color: "#F5F0E8",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  margin: "0 0 1.5rem",
                }}
              >
                {t("rev.title1")}
                <br />
                <em style={{ fontStyle: "italic", color: "#C9A255" }}>{t("rev.title2")}</em>
              </h2>

              <div className="flex items-center gap-4">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "3.4rem",
                    fontWeight: 300,
                    color: "#C9A255",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  4.9
                </span>
                <div>
                  <StarRating rating={5} />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.18em",
                      color: "rgba(245,240,232,0.78)",
                      textTransform: "uppercase",
                      display: "block",
                      marginTop: "6px",
                    }}
                  >
                    {t("rev.google")}
                  </span>
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "rgba(245,240,232,0.86)",
                lineHeight: 1.95,
                letterSpacing: "0.01em",
                margin: 0,
                paddingBottom: "0.5rem",
                borderLeft: "2px solid rgba(201,162,85,0.2)",
                paddingLeft: "1.5rem",
              }}
            >
              {t("rev.descriptionLong")}
            </p>
          </div>
        </div>

        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, rgba(201,162,85,0.4), rgba(201,162,85,0.05) 60%, transparent)",
            marginBottom: "3.5rem",
          }}
        />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <div className="hidden md:block flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
          <a
            href="https://www.google.com/maps/search/?api=1&query=JJ+Barber+Shop"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "0.8rem 2rem",
              border: "1px solid rgba(201,162,85,0.6)",
              background: "rgba(201,162,85,0.08)",
              color: "rgba(245,240,232,0.95)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {t("rev.allOnGoogle")}
          </a>
          <div className="hidden md:block flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
        </div>
      </div>
    </section>
  );
}
