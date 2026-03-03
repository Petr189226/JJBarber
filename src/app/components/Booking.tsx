import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Phone, ExternalLink } from "lucide-react";
import { useLanguage } from "../i18n";
import { BookButton } from "./BookButton";
import { RESERVIO_URL, RESERVIO_VRSOVICE, RESERVIO_STRASNICE } from "../cta-config";

export function Booking() {
  const ref = useRef(null);
  const rightRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rightInView = useInView(rightRef, { once: true, margin: "100px" });
  const { t } = useLanguage();

  return (
    <section id="booking" className="py-8 md:py-12 lg:py-20 bg-[#0B0B0B] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div ref={ref}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-px bg-[#8A8580]" />
              <span
                className="text-[#8A8580] tracking-[0.25em] uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
              >
                {t("book.label")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-[#C4BEB4] mb-8"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
            >
              {t("book.heading1")}
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A84C", fontSize: "1.12em" }}>{t("book.heading2")}</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-[#8A8278] mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.9 }}
            >
              {t("book.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8A8580] flex-shrink-0 mt-1.5" />
                <div>
                  <span className="text-[#8A8580]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>Vršovice: </span>
                  <span className="text-[#B5AEA4]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}>Vršovická 7/27, 101 00 Praha 10</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8A8580] flex-shrink-0 mt-1.5" />
                <div>
                  <span className="text-[#8A8580]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>Strašnice: </span>
                  <span className="text-[#B5AEA4]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}>Černokostelecká 830/23, 100 00 Praha 10</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8A8580] flex-shrink-0" />
                <div className="flex gap-2 flex-wrap items-center">
                  <Phone size={14} className="text-[#8A8580]" />
                  <a href="tel:+420777507662" className="text-[#B5AEA4] hover:text-[#C4BEB4] transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}>
                    777 507 662
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.5 }}
              className="mt-12 pl-6 border-l-2 border-[#2A2A2A]"
            >
              <p
                className="text-[#6B6660] italic"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "1rem", lineHeight: 1.75 }}
              >
                "{t("book.quote")}"
              </p>
              <span
                className="text-[#8A8580] mt-2 block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.12em" }}
              >
                — J&amp;J BARBER SHOP
              </span>
            </motion.div>
          </div>

          {/* Right column – lazy to reduce initial DOM */}
          <div ref={rightRef} style={{ minHeight: rightInView ? undefined : "320px" }} aria-hidden={!rightInView}>
            {rightInView ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <a
              href={RESERVIO_VRSOVICE}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#111111] border border-white/[0.06] hover:border-[#C9A84C]/40 hover:-translate-y-0.5 rounded-xl p-8 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none"
            >
              <h3 className="text-[#C4BEB4] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.35rem" }}>
                JJ Barber shop – Vršovice
              </h3>
              <p className="text-[#6B6B6B] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                Vršovická 7/27, 101 00 Praha 10
              </p>
              <span
                className="inline-flex items-center gap-2 text-[#C9A84C] group-hover:gap-3 transition-all"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {t("book.reserve")} – Vršovice
                <ExternalLink size={16} />
              </span>
            </a>
            <a
              href={RESERVIO_STRASNICE}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#111111] border border-white/[0.06] hover:border-[#C9A84C]/40 hover:-translate-y-0.5 rounded-xl p-8 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none"
            >
              <h3 className="text-[#C4BEB4] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.35rem" }}>
                JJ Barber shop – Strašnice
              </h3>
              <p className="text-[#6B6B6B] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                Černokostelecká 830/23, 100 00 Praha 10
              </p>
              <span
                className="inline-flex items-center gap-2 text-[#C9A84C] group-hover:gap-3 transition-all"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {t("book.reserve")} – Strašnice
                <ExternalLink size={16} />
              </span>
            </a>
          </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
