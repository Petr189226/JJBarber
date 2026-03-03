import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "../i18n";

const RESERVIO_VRSOVICE = "https://j-j-barbershop.reservio.com/j-j-barber-shop";
const RESERVIO_STRASNICE = "https://j-j-barbershop.reservio.com/j-j-barber-shop-strasnice";

function MiniMap({ loc, openLabel }: { loc: { name: string; mapImage: string; mapLink: string }; openLabel: string }) {
  return (
    <a
      href={loc.mapLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Otevřít mapu pobočky ${loc.name}`}
      className="block relative w-full h-[120px] md:h-[130px] rounded-sm overflow-hidden border border-[#1F1F1F] hover:border-[#C9A84C]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C] transition-all duration-300 group/map cursor-pointer"
    >
      <img
        src={loc.mapImage}
        alt={`Mapa – ${loc.name}`}
        loading="lazy"
        className="w-full h-full object-cover brightness-[0.4] group-hover/map:brightness-[0.55] transition-all duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="drop-shadow-[0_2px_6px_rgba(201,168,76,0.5)] group-hover/map:scale-110 transition-transform duration-200">
          <path d="M10 0C4.477 0 0 4.477 0 10c0 7.5 10 18 10 18s10-10.5 10-18c0-5.523-4.477-10-10-10z" fill="#C9A84C" />
          <circle cx="10" cy="10" r="4" fill="#0A0A0A" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent flex items-center justify-between">
        <span
          className="text-[#6B6B6B] group-hover/map:text-[#A89880] transition-colors duration-200 truncate"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem" }}
        >
          {openLabel}
        </span>
        <ExternalLink size={11} className="text-[#6B6B6B] group-hover/map:text-[#C9A84C] transition-colors duration-200 flex-shrink-0 ml-2" />
      </div>
    </a>
  );
}

function ReserveLink({ href, label, redirectLabel }: { href: string; label: string; redirectLabel: string }) {
  const [clicked, setClicked] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked(true);
    setTimeout(() => {
      window.open(href, "_blank");
      setClicked(false);
    }, 300);
  };
  return (
    <a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] focus:ring-2 focus:ring-[#C9A84C]/50 focus:outline-none ${clicked ? "scale-[0.98]" : "active:scale-95"}`}
      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
    >
      {clicked ? redirectLabel : label}
      <ExternalLink size={14} />
    </a>
  );
}

export function Locations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const locations = [
    {
      name: "Vršovice",
      address: "Vršovická 7/27, 101 00 Praha 10",
      image: "/location-vrsovice.png",
      hours: [t("loc.mon-fri"), t("loc.sat"), t("loc.sun.vrsovice")],
      reservioUrl: RESERVIO_VRSOVICE,
      mapImage: "/map-vrsovice.webp",
      mapLink: "https://www.google.com/maps/place/?q=place_id:ChIJj7OHo66TC0cR9_vNnPEtFtA",
    },
    {
      name: "Strašnice",
      address: "Černokostelecká 830/23, 100 00 Praha 10",
      image: "/location-strasnice.png",
      hours: [t("loc.mon-fri"), t("loc.sat"), t("loc.sun.strasnice")],
      reservioUrl: RESERVIO_STRASNICE,
      mapImage: "/map-strasnice.webp",
      mapLink: "https://www.google.com/maps/search/?api=1&query=JJ+Barber+Shop+Strašnice+Černokostelecká+Praha+10",
    },
  ];

  return (
    <section id="locations" className="py-24 bg-[#0D0D0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
              {t("loc.label")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#E8DCC8] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.15 }}
          >
            {t("loc.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#A89880] max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
          >
            {t("loc.description")}
          </motion.p>
        </div>

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
                <div className="mb-5">
                  <MiniMap loc={loc} openLabel={t("loc.openMaps")} />
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
                <ReserveLink href={loc.reservioUrl} label={t("loc.reserve")} redirectLabel={t("cta.redirecting")} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
