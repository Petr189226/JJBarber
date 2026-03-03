import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";

const barbers = [
  { name: "Kuba", image: "/team/kuba.png" },
  { name: "Pepa", image: "/team/pepa.png" },
  { name: "Oliver", image: "/team/oliver.png" },
  { name: "Milan", image: "/team/milan.png" },
  { name: "Honza", image: "/team/honza.png" },
  { name: "Ondra", image: "/team/ondra.png" },
  { name: "Vojta", image: "/team/vojta.png" },
  { name: "Fila", image: "/team/fila.png" },
];

function TeamCard({ barber, index }: { barber: typeof barbers[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: "easeOut" }}
      className={`group ${index >= 4 ? "pt-3" : ""}`}
    >
      <div className="relative overflow-hidden rounded-xl border border-[#1F1F1F] group-hover:border-[#C9A84C]/25 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={barber.image}
            alt={barber.name}
            className="w-full h-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span
            className="text-[#C4BEB4] group-hover:text-[#B5AEA4] transition-colors duration-200"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1.25rem" }}
          >
            {barber.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Team() {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const contentInView = useInView(contentRef, { once: true, margin: "100px" });
  const { t } = useLanguage();

  return (
    <section id="team" className="py-8 md:py-12 lg:py-20 bg-[#0F0F0F] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="mb-20">
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
              {t("team.label")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="text-[#C4BEB4] mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.2 }}
          >
            J<span className="text-[#C9A84C]">&</span>J {t("team.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
            className="text-[#B5AEA4] max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.9 }}
          >
            {t("team.description")}
          </motion.p>
        </div>

        <div ref={contentRef} style={{ minHeight: contentInView ? undefined : "480px" }} aria-hidden={!contentInView}>
          {contentInView ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {barbers.map((barber, i) => (
                <TeamCard key={barber.name} barber={barber} index={i} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
