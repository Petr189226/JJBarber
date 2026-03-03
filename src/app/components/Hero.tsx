import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../i18n";

const HERO_IMAGES = {
  webp: [
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

export function Hero() {
  const { t } = useLanguage();
  const [branch, setBranch] = useState(() => {
    try {
      const saved = localStorage.getItem("jj-branch");
      return saved && (saved === "vrsovice" || saved === "strasnice") ? saved : "";
    } catch {
      return "";
    }
  });
  const [error, setError] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (branch) {
      try { localStorage.setItem("jj-branch", branch); } catch { /* noop */ }
    }
  }, [branch]);

  const scrollToServices = () => {
    const el = document.querySelector("#services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleReservation = () => {
    if (!branch) {
      setError(true);
      return;
    }
    setRedirecting(true);
    setTimeout(() => {
      window.open(RESERVIO_URLS[branch], "_blank");
      setRedirecting(false);
    }, 300);
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background image – responsive WebP with fallback */}
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
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/55 to-[#0A0A0A]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-[#0A0A0A]/30" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 70% at 20% 50%, rgba(10,10,10,0.45) 0%, transparent 55%)" }}
          aria-hidden
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-[#8A8580]" />
            <span
              className="text-[#8A8580] tracking-[0.25em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
            >
              {t("hero.label")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            className="text-[#C4BEB4] mb-4 flex flex-col gap-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            <span>{t("hero.headline1")}</span>
            <span><em style={{ fontStyle: "italic", color: "#C9A84C", letterSpacing: "0.02em" }}>{t("hero.headline2")} {t("hero.headline3")}</em></span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#B5AEA4] mb-10 max-w-md"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1rem", lineHeight: 1.8 }}
          >
            {t("hero.sub")}
          </motion.p>

          {/* Booking pre-step */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => { setBranch(e.target.value); setError(false); }}
                  className={`appearance-none bg-[#111111] border ${error ? "border-[#C9A84C]" : "border-[#2A2A2A]"} focus-visible:border-white/25 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none text-[#C4BEB4] rounded-xl pl-4 pr-10 py-4 outline-none transition-all duration-200 w-full sm:w-60 cursor-pointer backdrop-blur-sm`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                >
                  <option value="" disabled style={{ color: "#3A3A3A" }}>{t("hero.selectPlaceholder")}</option>
                  <option value="vrsovice" style={{ background: "#111111", color: "#C4BEB4" }}>Vršovice</option>
                  <option value="strasnice" style={{ background: "#111111", color: "#C4BEB4" }}>Strašnice</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8580] pointer-events-none" />
              </div>
              <button
                onClick={handleReservation}
                disabled={!branch || redirecting}
                className={`px-8 py-5 bg-gradient-to-b from-[#D4B85A] to-[#C9A84C] hover:from-[#DDC268] hover:to-[#D4B85A] text-[#0A0A0A] rounded-xl transition-all duration-200 ease-out shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(212,175,55,0.2),0_4px_24px_rgba(201,168,76,0.3)] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 ${redirecting ? "scale-[0.98] opacity-90" : "active:scale-[0.98]"}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.18em", textTransform: "uppercase" }}
              >
                {redirecting ? t("cta.redirecting") : branch ? `${t("hero.bookBranch")} – ${BRANCH_LABELS[branch]}` : t("hero.book")}
              </button>
            </div>
            {error && (
              <p
                className="text-[#C9A84C] mt-2"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
              >
                {t("hero.selectError")}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8A8580] hover:text-[#B5AEA4] transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:rounded-xl"
      >
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>{t("hero.scrollDown")}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
