import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Award, Clock, MapPin } from "lucide-react";

const ABOUT_IMAGE = "https://images.unsplash.com/photo-1733995471058-3d6ff2013de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBncm9vbWluZyUyMGJlYXJkJTIwc2hhdmluZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI1MTkwMzR8MA&ixlib=rb-4.1.0&q=80&w=900";
const TOOL_IMAGE = "https://images.unsplash.com/photo-1585309370118-f40f3fce2f1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBzY2lzc29ycyUyMGNvbWIlMjBibGFjayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyNTE5MDM0fDA&ixlib=rb-4.1.0&q=80&w=600";

const pillars = [
  {
    icon: Award,
    title: "Certifikovaní mistři",
    desc: "Všichni naši barbers mají mezinárodní certifikaci a pravidelně se vzdělávají.",
  },
  {
    icon: Clock,
    title: "Flexibilní otevírací doba",
    desc: "Otevřeno 7 dní v týdnu od 9:00 do 20:00. Online rezervace 24/7.",
  },
  {
    icon: MapPin,
    title: "Srdce Prahy",
    desc: "Najdete nás na Náměstí Republiky. Dostupní MHD ze všech směrů.",
  },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const pillarsRef = useRef(null);
  const pillarsInView = useInView(pillarsRef, { once: true, margin: "-60px" });

  return (
    <section id="about" className="py-28 bg-[#0D0D0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Images column */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <img
                src={ABOUT_IMAGE}
                alt="Barber při práci"
                className="w-full aspect-[4/5] object-cover rounded-sm"
                style={{ filter: "contrast(1.05) saturate(0.9)" }}
              />
              {/* Gold border accent */}
              <div className="absolute -inset-px rounded-sm opacity-30 pointer-events-none"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, transparent 50%, #C9A84C 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "1px" }} />
            </motion.div>

            {/* Floating tool image */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute -bottom-10 -right-6 lg:-right-10 w-44 lg:w-56 z-20 border-2 border-[#0D0D0D]"
            >
              <img
                src={TOOL_IMAGE}
                alt="Barber nástroje"
                className="w-full aspect-square object-cover rounded-sm"
              />
            </motion.div>

            {/* Years badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute top-8 -right-4 lg:-right-8 z-20 w-24 h-24 bg-[#C9A84C] rounded-sm flex flex-col items-center justify-center text-[#0A0A0A]"
            >
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "2rem", lineHeight: 1 }}>12</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>let praxe</span>
            </motion.div>

            {/* BG decoration */}
            <div className="absolute -top-6 -left-6 w-48 h-48 border border-[#C9A84C]/8 rounded-sm -z-10" />
            <div className="absolute -bottom-3 -left-3 w-32 h-32 border border-[#C9A84C]/5 rounded-sm -z-10" />
          </div>

          {/* Text column */}
          <div ref={ref} className="order-1 lg:order-2">
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
                Náš příběh
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[#C4BEB4] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.15 }}
            >
              Kde tradice
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A84C" }}>potkává</em> styl
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-4 mb-10"
            >
              <p
                className="text-[#A89880]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
              >
                Blade & Co. vznikl z vášně k řemeslu a úcty k tradici klasického holení.
                Od roku 2012 jsme domovem pro muže, kteří chápou, že dobrý střih
                není jen o vlasech — je o sebevědomí.
              </p>
              <p
                className="text-[#6B6B6B]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
              >
                Náš tým čítá šest certifikovaných barbers s kolektivní zkušeností
                přes 40 let. Každý detail, od výběru nástrojů po přání na závěr,
                je promyšlen tak, aby vaše návštěva byla zážitkem.
              </p>
            </motion.div>

            {/* Pillars */}
            <div ref={pillarsRef} className="space-y-5">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={pillarsInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#C9A84C]/35 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <Icon size={16} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <div
                        className="text-[#C4BEB4] mb-1"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1rem" }}
                      >
                        {pillar.title}
                      </div>
                      <div
                        className="text-[#6B6B6B]"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}
                      >
                        {pillar.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
