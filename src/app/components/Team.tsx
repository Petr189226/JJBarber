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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-sm border border-[#1F1F1F] group-hover:border-[#C9A84C]/30 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={barber.image}
            alt={barber.name}
            className="w-full h-full object-cover object-top transition-transform duration-600 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span
            className="text-[#E8DCC8] group-hover:text-[#C9A84C] transition-colors duration-200"
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
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <section id="team" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
            >
              {t("team.label")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#E8DCC8] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.15 }}
          >
            J<span className="text-[#C9A84C]">&</span>J {t("team.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#A89880] max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
          >
            {t("team.description")}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {barbers.map((barber, i) => (
            <TeamCard key={barber.name} barber={barber} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
