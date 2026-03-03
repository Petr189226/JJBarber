import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "../i18n";
import { RESERVIO_VRSOVICE, RESERVIO_STRASNICE } from "../cta-config";

function MiniMap({ loc, openLabel }: { loc: { name: string; mapImage: string; mapLink: string }; openLabel: string }) {
  return (
    <a
      href={loc.mapLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Otevřít mapu pobočky ${loc.name}`}
      className="block relative w-full h-[120px] md:h-[130px] rounded-xl overflow-hidden border border-[#1F1F1F] hover:border-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] transition-all duration-200 group/map cursor-pointer"
    >
      <img
        src={loc.mapImage}
        alt={`Mapa – ${loc.name}`}
        loading="lazy"
        className="w-full h-full object-cover brightness-[0.6] group-hover/map:brightness-[0.75] transition-all duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]/8" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="drop-shadow-[0_2px_6px_rgba(201,168,76,0.5)] group-hover/map:scale-110 transition-transform duration-200">
          <path d="M10 0C4.477 0 0 4.477 0 10c0 7.5 10 18 10 18s10-10.5 10-18c0-5.523-4.477-10-10-10z" fill="#8A8580" />
          <circle cx="10" cy="10" r="4" fill="#0A0A0A" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-[#0A0A0A]/70 to-transparent flex items-center justify-between">
        <span
          className="text-[#B5AEA4] group-hover/map:text-[#C4BEB4] transition-colors duration-200 truncate"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem" }}
        >
          {openLabel}
        </span>
        <ExternalLink size={11} className="text-[#B5AEA4] group-hover/map:text-[#C4BEB4] transition-colors duration-200 flex-shrink-0 ml-2" />
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
      className={`inline-flex items-center gap-2 px-6 py-3 border border-[#3A3A3A] text-[#B5AEA4] bg-transparent hover:border-white/20 hover:text-[#C4BEB4] hover:bg-white/[0.03] hover:-translate-y-0.5 rounded-xl transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none ${clicked ? "scale-[0.98] opacity-90 pointer-events-none" : "active:scale-[0.98]"}`}
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
    <section id="locations" className="py-8 md:py-12 lg:py-20 bg-[#0B0B0B] overflow-hidden scroll-mt-24">
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
              {t("loc.label")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-[#C4BEB4] mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.2 }}
          >
            {t("loc.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[#B5AEA4] max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.8 }}
          >
            {t("loc.description")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="bg-[#111111] border border-white/[0.05] hover:border-white/[0.08] rounded-xl overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] group"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={loc.image}
                  alt={`Interiér JJ Barber shop ${loc.name}`}
                  className={`w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out ${i === 1 ? "brightness-[0.96]" : ""}`}
                />
              </div>
              <div className="p-8">
                <h3
                  className="text-[#C4BEB4] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.5rem" }}
                >
                  JJ Barber shop – {loc.name}
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={18} className="text-[#8A8580] flex-shrink-0 mt-0.5" />
                  <span
                    className="text-[#B5AEA4]"
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
                      <Clock size={14} className="text-[#8A8580] flex-shrink-0" />
                      <span
                        className="text-[#B5AEA4]"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem" }}
                      >
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
                <ReserveLink href={loc.reservioUrl} label={`${t("loc.reserve")} – ${loc.name}`} redirectLabel={t("cta.redirecting")} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
