import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../i18n";

const HERO_IMAGES = {
  webp: [
    { src: "/hero-480.webp", w: 480 },
    { src: "/hero-768.webp", w: 768 },
    { src: "/hero-960.webp", w: 960 },
    { src: "/hero-1280.webp", w: 1280 },
    { src: "/hero-1920.webp", w: 1920 },
    { src: "/hero-2560.webp", w: 2560 },
  ],
  fallback: "/hero.png",
};

const RESERVIO_URLS: Record<string, string> = {
  vrsovice: "https://j-j-barbershop.reservio.com/j-j-barber-shop",
  strasnice: "https://j-j-barbershop.reservio.com/j-j-barber-shop-strasnice",
};

const BRANCH_LABELS: Record<string, string> = {
  vrsovice: "Vršovice",
  strasnice: "Strašnice",
};

const HERO_TICKER_ITEMS = [
  "J&J BARBER SHOP",
  "Vršovice",
  "Strašnice",
  "Tvůj barber shop",
  "Střih",
  "Vousy",
  "Fade",
  "Od 2020",
  "Praha 10",
];

export function Hero() {
  const { t } = useLanguage();
  const [branch, setBranch] = useState(() => {
    try {
      const saved = localStorage.getItem("jj-branch");
      return saved && (saved === "vrsovice" || saved === "strasnice") ? saved : "vrsovice";
    } catch {
      return "vrsovice";
    }
  });
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (branch) {
      try { localStorage.setItem("jj-branch", branch); } catch {}
    }
  }, [branch]);

  const scrollToServices = () => {
    const el = document.querySelector("#services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleReservation = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.open(RESERVIO_URLS[branch], "_blank");
      setRedirecting(false);
    }, 300);
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden scroll-mt-24"
      style={{ height: "100svh", minHeight: "640px", backgroundColor: "#060402" }}
    >
      <div className="absolute inset-0">
        <picture className="block w-full h-full">
          <source
            type="image/webp"
            srcSet={HERO_IMAGES.webp.map(({ src, w }) => `${src} ${w}w`).join(", ")}
            sizes="100vw"
          />
          <img
            src={HERO_IMAGES.fallback}
            alt="Interiér J&J Barber Shop"
            width={1920}
            height={1080}
            sizes="100vw"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(108deg, rgba(6,4,2,0.94) 0%, rgba(6,4,2,0.76) 40%, rgba(6,4,2,0.28) 100%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: "140px", background: "linear-gradient(to bottom, rgba(6,4,2,0.7), transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-7">
            <span style={{ display: "block", width: "36px", height: "1px", background: "#E8C84A" }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#E8C84A",
              }}
            >
              {t("hero.ann.label1")}
            </span>
            <span style={{ color: "rgba(232,200,74,0.4)", fontSize: "0.55rem" }}>/</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.6)",
              }}
            >
              {t("hero.ann.label2")}
            </span>
            <span style={{ color: "rgba(232,200,74,0.4)", fontSize: "0.55rem" }}>/</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.6)",
              }}
            >
              {t("hero.ann.label3")}
            </span>
          </div>

          <div style={{ lineHeight: 0.9, marginBottom: "6px" }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3.6rem, 10vw, 6.5rem)",
                color: "#F5F0E8",
                letterSpacing: "0.02em",
              }}
            >
              {t("hero.big1")}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3.6rem, 10vw, 6.5rem)",
                color: "#F5F0E8",
                letterSpacing: "0.02em",
              }}
            >
              {t("hero.big2")}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3.6rem, 10vw, 6.5rem)",
                color: "#F5F0E8",
                letterSpacing: "0.02em",
              }}
            >
              {t("hero.big3").replace(/\.$/, "")}
            </div>
          </div>

          <div className="flex items-center gap-4 my-5">
            <div style={{ width: "52px", height: "1px", background: "#E8C84A" }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.9)",
              }}
            >
              J&amp;J BARBER SHOP
            </span>
          </div>

          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              color: "#E8C84A",
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "0.01em",
            }}
          >
            {t("hero.subline")}
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "0.92rem",
              color: "rgba(245,240,232,0.86)",
              lineHeight: 1.9,
              maxWidth: "38ch",
              marginBottom: "32px",
            }}
          >
            {t("hero.sub")}
          </p>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ display: "block", width: "18px", height: "1px", background: "rgba(245,240,232,0.4)" }} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.9)",
                }}
              >
                {t("hero.selectPlaceholder")}
              </span>
            </div>

            <div className="flex flex-wrap items-stretch gap-0">
              {(["vrsovice", "strasnice"] as const).map((key) => {
                const active = branch === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBranch(key)}
                    style={{
                      padding: "11px 22px",
                      background: active ? "rgba(232,200,74,0.12)" : "transparent",
                      border: active
                        ? "1px solid #E8C84A"
                        : "1px solid rgba(245,240,232,0.2)",
                      borderRight: key === "vrsovice" ? "none" : undefined,
                      color: active ? "#E8C84A" : "rgba(245,240,232,0.6)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      borderRadius: 0,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {BRANCH_LABELS[key]}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleReservation}
                disabled={redirecting}
                style={{
                  padding: "11px 30px",
                  background: "#E8C84A",
                  border: "none",
                  color: "#060402",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  borderRadius: 0,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  marginLeft: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  opacity: redirecting ? 0.85 : 1,
                  transform: redirecting ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.2s ease-out",
                }}
              >
                {redirecting
                  ? t("cta.redirecting")
                  : `${t("hero.bookBranch")} – ${BRANCH_LABELS[branch]}`}
                <span style={{ fontSize: "0.8rem", marginTop: "-1px" }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToServices}
        className="absolute z-20 flex flex-col items-center gap-2"
        style={{ bottom: "52px", left: "50%", transform: "translateX(-50%)" }}
      >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.9)",
              }}
            >
          {t("hero.scrollDown")}
        </span>
        <span
          aria-hidden
          style={{
            color: "rgba(245,240,232,0.3)",
            fontSize: "0.9rem",
            animation: "hero-bob 1.8s ease-in-out infinite",
          }}
        >
          ↓
        </span>
        <style>
          {`@keyframes hero-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }`}
        </style>
      </button>

      <div
        className="absolute left-0 right-0 overflow-hidden z-10"
        style={{
          bottom: 0,
          height: "32px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          background: "rgba(6,4,2,0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "hero-ticker 26s linear infinite",
          }}
        >
          {[0, 1, 2].flatMap((set) =>
            HERO_TICKER_ITEMS.map((item, i) => (
              <span
                key={`${set}-${item}-${i}`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.52rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.26)",
                  whiteSpace: "nowrap",
                  padding: "0 20px",
                }}
              >
                {item}
                <span style={{ color: "#E8C84A", margin: "0 6px", opacity: 0.7 }}>·</span>
              </span>
            )),
          )}
        </div>
        <style>
          {`@keyframes hero-ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }`}
        </style>
      </div>
    </section>
  );
}
