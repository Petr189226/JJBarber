import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";
import { useLanguage } from "../i18n";
import { RESERVIO_VRSOVICE, RESERVIO_STRASNICE } from "../cta-config";

function MiniMap({ loc, openLabel }: { loc: { name: string; mapImage: string; mapLink: string }; openLabel: string }) {
  return (
    <a
      href={loc.mapLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Otevřít mapu pobočky ${loc.name}`}
      className="block relative w-full rounded-xl overflow-hidden border border-[#252525] hover:border-[#3a341f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A255]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] transition-all duration-200 group/map cursor-pointer"
      style={{ height: "120px" }}
    >
      <img
        src={loc.mapImage}
        alt={`Mapa – ${loc.name}`}
        width={400}
        height={130}
        loading="lazy"
        fetchPriority="low"
        className="w-full h-full object-cover brightness-[0.65] group-hover/map:brightness-[0.8] transition-all duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center justify-between">
        <span
          className="truncate"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.85)",
          }}
        >
          {openLabel}
        </span>
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
      className={`inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#C9A255] text-[#08080c] hover:bg-[#B8913E] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#C9A255]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none ${clicked ? "scale-[0.98] opacity-90 pointer-events-none" : "active:scale-[0.98]"}`}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: "0.7rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}
    >
      {clicked ? redirectLabel : label}
    </a>
  );
}

interface LocationModel {
  id: string;
  name: string;
  address: string;
  image: string;
  hours: string[];
  reservioUrl: string;
  mapImage: string;
  mapLink: string;
  accent: string;
}

function LocationCard({ loc, reserveLabel, redirectLabel, openLabel }: { loc: LocationModel; reserveLabel: string; redirectLabel: string; openLabel: string }) {
  const isClosedText = (text: string) => /zavřeno/i.test(text);

  return (
    <div className="group relative flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
            lineHeight: 1,
            color: "rgba(201,162,85,0.14)",
            letterSpacing: "-0.02em",
            fontWeight: 300,
            userSelect: "none",
          }}
        >
          {loc.id}
        </span>
        <div
          className="hidden md:block"
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(to right, rgba(201,162,85,0.6), transparent)",
          }}
        />
      </div>

      <div
        className="relative overflow-hidden rounded-2xl mb-8"
        style={{
          aspectRatio: "16/10",
        }}
      >
        <img
          src={loc.image}
          alt={`JJ Barber shop – ${loc.name}`}
          className="w-full h-full object-cover"
          style={{
            transform: "scale(1)",
            transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.8s ease",
            filter: "brightness(0.78)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.35) 40%, transparent 70%)",
          }}
        />
        <div className="absolute bottom-5 left-6 flex items-center gap-3">
          <div style={{ width: "28px", height: "1px", background: "#C9A255" }} />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.8)",
            }}
          >
            {loc.accent}
          </span>
        </div>
      </div>

      <div className="mb-2">
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "#C9A255",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          JJ Barber shop
        </p>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.1rem, 3.4vw, 2.7rem)",
            fontWeight: 300,
            color: "#F5F0E8",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            marginBottom: "1.3rem",
          }}
        >
          {loc.name}
        </h3>
      </div>

      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.07)",
          marginBottom: "1.5rem",
        }}
      />

      <div className="flex items-start gap-3 mb-4" style={{ color: "#E0DAD4" }}>
        <span className="mt-[3px] text-[#C9A255]">
          <MapPin size={16} />
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
          }}
        >
          {loc.address}
        </span>
      </div>

      <div className="mb-6">
        <MiniMap loc={loc} openLabel={openLabel} />
      </div>

      <div className="mb-6 space-y-2">
        {loc.hours.map((line) => {
          const [days, time] = line.split("  ");
          const closed = isClosedText(line) || isClosedText(time || "");
          return (
            <div
              key={line}
              className="flex items-center justify-between border-b border-white/5 last:border-b-0 py-2.5"
            >
              <div className="flex items-center gap-2" style={{ color: "rgba(245,240,232,0.78)" }}>
                <Clock size={13} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                  }}
                >
                  {days || line}
                </span>
              </div>
              {time && (
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.9rem",
                    color: closed ? "rgba(245,240,232,0.5)" : "#F5F0E8",
                    fontStyle: closed ? "italic" as const : "normal",
                    letterSpacing: "0.03em",
                  }}
                >
                  {time}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-auto">
        <ReserveLink href={loc.reservioUrl} label={reserveLabel} redirectLabel={redirectLabel} />
      </div>
    </div>
  );
}

export function Locations() {
  const [inView, setInView] = useState(false);
  const [contentInView, setContentInView] = useState(false);
  useEffect(() => {
    setInView(true);
    const t = setTimeout(() => setContentInView(true), 100);
    return () => clearTimeout(t);
  }, []);
  const anim = "transition-all duration-500 ease-out";
  const { t } = useLanguage();

  const locations: LocationModel[] = [
    {
      id: "01",
      name: "Vršovice",
      address: "Vršovická 7/27, 101 00 Praha 10",
      image: "/location-vrsovice.png",
      hours: [t("loc.mon-fri"), t("loc.sat"), t("loc.sun.vrsovice")],
      reservioUrl: RESERVIO_VRSOVICE,
      mapImage: "/map-vrsovice.webp",
      mapLink: "https://www.google.com/maps/place/?q=place_id:ChIJj7OHo66TC0cR9_vNnPEtFtA",
      accent: "Lokace v srdci Vršovic",
    },
    {
      id: "02",
      name: "Strašnice",
      address: "Černokostelecká 830/23, 100 00 Praha 10",
      image: "/location-strasnice.png",
      hours: [t("loc.mon-fri"), t("loc.sat"), t("loc.sun.strasnice")],
      reservioUrl: RESERVIO_STRASNICE,
      mapImage: "/map-strasnice.webp",
      mapLink: "https://www.google.com/maps/search/?api=1&query=JJ+Barber+Shop+Strašnice+Černokostelecká+Praha+10",
      accent: "Moderní prostor ve Strašnicích",
    },
  ];

  return (
    <section id="locations" className="py-8 md:py-12 lg:py-20 bg-[#0B0B0B] overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <div
            className={`flex items-center gap-3 mb-5 ${anim} ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
          >
            <div className="w-10 h-px bg-[#C9A255]" />
            <span
              className="tracking-[0.25em] uppercase"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "#C9A255" }}
            >
              {t("loc.label")}
            </span>
          </div>
          <div
            className={`grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-end ${anim} ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{ transitionDelay: inView ? "40ms" : undefined }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3rem, 6vw, 4.8rem)",
                fontWeight: 300,
                color: "#F5F0E8",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Naše
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A255" }}>{t("loc.heading")}</em>
            </h2>
            <p
              className="border-l-2 border-[rgba(201,162,85,0.45)] pl-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "0.92rem",
                color: "rgba(245,240,232,0.86)",
                lineHeight: 1.9,
                transitionDelay: inView ? "120ms" : undefined,
              }}
            >
              {t("loc.description")}
            </p>
          </div>
        </div>

        <div style={{ minHeight: contentInView ? undefined : "520px" }} aria-hidden={!contentInView}>
          {contentInView ? (
            <div className="grid gap-10 md:grid-cols-2" style={{ alignItems: "flex-start" }}>
              {locations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  loc={loc}
                  reserveLabel={`${t("loc.reserve")} – ${loc.name}`}
                  redirectLabel={t("cta.redirecting")}
                  openLabel={t("loc.openMaps")}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
