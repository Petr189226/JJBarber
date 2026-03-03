import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLanguage } from "../i18n";
import { BookButton } from "./BookButton";

export function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-[#0D0D0D] to-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-[#C9A84C]/40" />

      <div ref={ref} className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-[#E8DCC8]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.15,
          }}
        >
          {t("cta.heading1")}
          <br />
          <em className="text-[#C9A84C] italic">{t("cta.heading2")}</em>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[#6B6B6B] mt-4 mb-8"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1rem", lineHeight: 1.7 }}
        >
          {t("cta.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <BookButton
            href="#booking"
            label={t("cta.button")}
            variant="textLink"
            action="scroll"
            showIcon
          />
        </motion.div>
      </div>
    </section>
  );
}
