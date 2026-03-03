import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Clock, ExternalLink } from "lucide-react";

const RESERVIO_VRSOVICE = "https://j-j-barbershop.reservio.com/j-j-barber-shop";
const RESERVIO_STRASNICE = "https://j-j-barbershop.reservio.com/j-j-barber-shop-strasnice";

const locations = [
  {
    name: "Vršovice",
    address: "Vršovická 7/27, 101 00 Praha 10",
    image: "/location-vrsovice.png",
    hours: [
      "Pondělí — Pátek 9:00 — 21:00",
      "Sobota 10:00 — 17:00",
      "Neděle 10:00 — 17:00",
    ],
    reservioUrl: RESERVIO_VRSOVICE,
  },
  {
    name: "Strašnice",
    address: "Černokostelecká 830/23, 100 00 Praha 10",
    image: "/location-strasnice.png",
    hours: [
      "Pondělí — Pátek 9:00 — 21:00",
      "Sobota 10:00 — 17:00",
      "Neděle zavřeno",
    ],
    reservioUrl: RESERVIO_STRASNICE,
  },
];

export function Locations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="locations" className="py-24 bg-[#0D0D0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="mb-16">
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
              Kde nás najdete
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#E8DCC8] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.15 }}
          >
            Pobočky
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#A89880] max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
          >
            Na našich pobočkách ve Vršovicích a Strašnicích tě čeká tým zkušených profesionálů, kteří mají vášeň pro své řemeslo. Kdykoliv přijdeš, očekávej profesionální službu ve veselé a přátelské atmosféře.
          </motion.p>
        </div>

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#111111] border border-[#1F1F1F] hover:border-[#C9A84C]/30 rounded-sm overflow-hidden transition-all duration-400 group"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={loc.image}
                  alt={`Interiér JJ Barber shop ${loc.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3
                  className="text-[#E8DCC8] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.5rem" }}
                >
                  JJ Barber shop – {loc.name}
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={18} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
                  <span
                    className="text-[#A89880]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "0.95rem", lineHeight: 1.6 }}
                  >
                    {loc.address}
                  </span>
                </div>
                <ul className="space-y-2 mb-8">
                  {loc.hours.map((line) => (
                    <li key={line} className="flex items-center gap-3">
                      <Clock size={14} className="text-[#C9A84C]/70 flex-shrink-0" />
                      <span
                        className="text-[#6B6B6B]"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem" }}
                      >
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={loc.reservioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] active:scale-95"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
                >
                  Vytvořit rezervaci
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
