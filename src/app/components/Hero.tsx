import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../i18n";

const HERO_IMAGE = "/hero.png";

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
  const [branch, setBranch] = useState("");
  const [error, setError] = useState(false);

  const scrollToServices = () => {
    const el = document.querySelector("#services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleReservation = () => {
    if (!branch) {
      setError(true);
      return;
    }
    window.open(RESERVIO_URLS[branch], "_blank");
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Interiér J&J Barber Shop"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/55 to-[#0A0A0A]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-[#0A0A0A]/30" />
      </div>

      {/* Decorative gold line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent origin-center hidden lg:block"
        style={{ left: "6%" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.78rem" }}
            >
              {t("hero.label")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            className="text-[#E8DCC8] mb-4 leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            {t("hero.headline1")}
            <br />
            {t("hero.headline2")} <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("hero.headline3")}</em>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="text-[#A89880] mb-10 max-w-md"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.7 }}
          >
            {t("hero.sub")}
          </motion.p>

          {/* Booking pre-step */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => { setBranch(e.target.value); setError(false); }}
                  className={`appearance-none bg-[#111111] border ${error ? "border-[#C9A84C]" : "border-[#2A2A2A]"} focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/40 focus:shadow-[0_0_12px_rgba(201,168,76,0.2)] text-[#E8DCC8] rounded-sm pl-4 pr-10 py-4 outline-none transition-all duration-300 w-full sm:w-60 cursor-pointer backdrop-blur-sm`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                >
                  <option value="" disabled style={{ color: "#3A3A3A" }}>{t("hero.selectPlaceholder")}</option>
                  <option value="vrsovice" style={{ background: "#111111", color: "#E8DCC8" }}>Vršovice</option>
                  <option value="strasnice" style={{ background: "#111111", color: "#E8DCC8" }}>Strašnice</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" />
              </div>
              <button
                onClick={handleReservation}
                disabled={!branch}
                className="px-8 py-4 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-[#C9A84C]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                {branch ? `${t("hero.bookBranch")} – ${BRANCH_LABELS[branch]}` : t("hero.book")}
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

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            className="mt-4"
          >
            <button
              onClick={scrollToServices}
              className="px-8 py-4 border border-[#E8DCC8]/30 hover:border-[#C9A84C]/60 text-[#E8DCC8] hover:text-[#C9A84C] rounded-sm transition-all duration-300 backdrop-blur-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              {t("hero.pricelist")}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex gap-10 mt-16 pt-8 border-t border-[#E8DCC8]/10"
          >
            {[
              { value: t("hero.stat1value"), label: t("hero.stat1label") },
              { value: "8", label: t("hero.stat2label") },
              { value: "2", label: t("hero.stat3label") },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-[#C9A84C]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[#6B6B6B] mt-1"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", letterSpacing: "0.05em" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6B6B6B] hover:text-[#C9A84C] transition-colors group"
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
