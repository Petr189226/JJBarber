import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../i18n";

const reviews = [
  { name: "Vojtěch Kunetka", initials: "VK", rating: 5, text: "Chodím do J&J pravidelně a vždy jsem spokojený. Je v podstatě jedno, ke komu se objednáte, všichni jsou dobří. Navíc za skvělou cenu. Doporučuji!" },
  { name: "David Omáčka", initials: "DO", rating: 5, text: "Nejlepší barber, kterého jsem kdy zkusil. Chodím sem již cca 4 roky a nikdy jsem nebyl jinde! Doporučuji zakladatele Kubu! Velmi slušný, příjemný a udělá v podstatě jakýkoliv účes za zlomek ceny konkurence. Díky kluci" },
  { name: "Tomáš Tuca", initials: "TT", rating: 5, text: "Našel jsem dle recenzí a nezklamali 🙂 Max. spokojenost, profi přístup a celkově sympatické prostředí. Výborně ostříhán a hlavně vousy upraveny přesně dle představ! Rád se budu vracet!" },
  { name: "bald mfka", initials: "bM", rating: 5, text: "Barbershop na vysoké úrovni, poměr cena kvalita se nedá s žádným jiným barbershopem, který jsem vyzkoušel srovnat (vyzkoušel jsem jich nespočet, pač jsem nikde nenašel to pravé) čili v JJ jsem to našel." },
  { name: "Pavel Rajdl", initials: "PR", rating: 5, text: "Super barber shop. Jestli zvažujete kam jít, tak jedině sem. Dneska jsem byl poprvé a vím kam budu chodit. Barber Milan byl naprostý profík." },
  { name: "Jan Andrle", initials: "JA", rating: 5, text: "Absolutní spokojenost 👍 sice jsem chvíli čekal, ale každá práce vyžaduje svůj čas. Fajn přístup, super kvalita střihu a cena bezkonkurenční 💪👏" },
  { name: "Petr Chajda", initials: "PC", rating: 5, text: "Do JJ chodím už delší dobu a vždycky odcházím maximálně spokojený. Skvělá atmosféra, profesionální přístup a hlavně precizní práce. Kluci si dávají záležet na detailech a přesně ví, co dělají. Poměr cena/výkon je za mě bezkonkurenční. Rozhodně doporučuju!" },
  { name: "Karel Vyhn", initials: "KV", rating: 5, text: "Jak již píší lidé co navštívili předem mnou, maximální spokojenost. Takhle má ta služba vypadat, vše pro zákazníka, nic není problém. Výsledek práce na vysoké úrovni." },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? "text-[#C9A84C] fill-[#C9A84C]" : "text-[#2A2A2A]"} />
      ))}
    </div>
  );
}

export function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const { t } = useLanguage();

  const prev = () => setActive((a) => (a - 1 + reviews.length) % reviews.length);
  const next = () => setActive((a) => (a + 1) % reviews.length);

  return (
    <section id="reviews" className="py-32 bg-[#0A0A0A] overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-[#8A8580]" />
            <span
              className="text-[#8A8580] tracking-[0.25em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
            >
              {t("rev.label")}
            </span>
          </motion.div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#C4BEB4] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.2 }}
            >
              {t("rev.heading")}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 shrink-0"
            >
              <div
                className="text-[#C4BEB4]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "2.25rem", lineHeight: 1 }}
              >
                4.9
              </div>
              <div>
                <StarRating rating={5} />
                <div className="text-[#8A8580] mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
                  {t("rev.google")}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#111111] border border-[#1F1F1F] hover:border-white/[0.08] rounded-sm p-6 transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] group hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col"
            >
              <Quote size={22} className="text-[#8A8580]/60 mb-4" />
              <p
                className="text-[#B5AEA4] mb-6 leading-relaxed flex-1"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.875rem", lineHeight: 1.9 }}
              >
                "{review.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1F1F1F] mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#B5AEA4]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.8rem" }}>
                    {review.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-[#C4BEB4] truncate" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "0.9rem" }}>
                    {review.name}
                  </div>
                  <div className="text-[#8A8580] truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
                    {t("rev.role")}
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-[#111111] border border-[#1F1F1F] rounded-sm p-6"
            >
              <Quote size={22} className="text-[#8A8580]/60 mb-4" />
              <p
                className="text-[#B5AEA4] mb-6 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.9 }}
              >
                "{reviews[active].text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1F1F1F]">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                  <span className="text-[#B5AEA4]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.8rem" }}>
                    {reviews[active].initials}
                  </span>
                </div>
                <div>
                  <div className="text-[#C4BEB4]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "0.9rem" }}>
                    {reviews[active].name}
                  </div>
                  <div className="text-[#8A8580]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
                    {t("rev.role")}
                  </div>
                </div>
              </div>
              <StarRating rating={reviews[active].rating} />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <button onClick={prev} className="w-10 h-10 border border-[#2A2A2A] hover:border-white/15 rounded-sm flex items-center justify-center text-[#C4BEB4] transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1 rounded-full transition-all duration-[180ms] ${i === active ? "w-8 bg-[#8A8580]" : "w-3 bg-[#2A2A2A]"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 border border-[#2A2A2A] hover:border-white/15 rounded-sm flex items-center justify-center text-[#C4BEB4] transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
