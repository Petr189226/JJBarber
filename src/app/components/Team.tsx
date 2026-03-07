import { useEffect, useState } from "react";
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

const cardAnim = "transition-all duration-500 ease-out";

function TeamCard({ barber, index }: { barber: typeof barbers[0]; index: number }) {
  return (
    <div
      className={`group ${index >= 4 ? "pt-3" : ""} opacity-100 translate-y-0 ${cardAnim}`}
    >
      <div className="relative overflow-hidden rounded-xl border border-[#1F1F1F] group-hover:border-[#C9A84C]/25 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={barber.image}
            alt={barber.name}
            width={300}
            height={400}
            loading="lazy"
            fetchPriority="low"
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
    </div>
  );
}

export function Team() {
  const [inView, setInView] = useState(false);
  const [contentInView, setContentInView] = useState(false);
  useEffect(() => {
    setInView(true);
    const t = setTimeout(() => setContentInView(true), 100);
    return () => clearTimeout(t);
  }, []);
  const { t } = useLanguage();

  return (
    <section id="team" className="py-8 md:py-12 lg:py-20 bg-[#0F0F0F] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <div
            className={`flex items-center gap-3 mb-5 transition-all duration-500 ease-out ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
          >
            <div className="w-8 h-px bg-[#8A8580]" />
            <span
              className="text-[#8A8580] tracking-[0.25em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
            >
              {t("team.label")}
            </span>
          </div>
          <h2
            className={`text-[#C4BEB4] mb-8 transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.2, transitionDelay: inView ? "50ms" : undefined }}
          >
            J<span className="text-[#C9A84C]">&</span>J {t("team.heading")}
          </h2>
          <p
            className={`text-[#B5AEA4] max-w-2xl transition-all duration-500 ease-out ${inView ? "opacity-100" : "opacity-0"}`}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.9, transitionDelay: inView ? "100ms" : undefined }}
          >
            {t("team.description")}
          </p>
        </div>

        <div style={{ minHeight: contentInView ? undefined : "480px" }} aria-hidden={!contentInView}>
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
