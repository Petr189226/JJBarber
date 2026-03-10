import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../i18n";

type Barber = { id: string; name: string; image: string };

const barbers: Barber[] = [
  { id: "01", name: "Kuba", image: "/team/kuba.png" },
  { id: "02", name: "Pepa", image: "/team/pepa.png" },
  { id: "03", name: "Oliver", image: "/team/oliver.png" },
  { id: "04", name: "Milan", image: "/team/milan.png" },
  { id: "05", name: "Honza", image: "/team/honza.png" },
  { id: "06", name: "Ondra", image: "/team/ondra.png" },
  { id: "07", name: "Vojta", image: "/team/vojta.png" },
  { id: "08", name: "Fila", image: "/team/fila.png" },
];

function FounderCard({ barber, roleLabel }: { barber: Barber; roleLabel: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl cursor-default aspect-[3/4]">
      <img
        src={barber.image}
        alt={barber.name}
        width={800}
        height={1000}
        loading="lazy"
        fetchPriority="low"
        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.28) 45%, transparent 70%)",
        }}
      />

      <div className="absolute bottom-0 inset-x-0 p-6 pb-7">
        <p
          className="mb-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#C5A572",
          }}
        >
          {roleLabel}
        </p>

        <div className="flex items-baseline justify-between">
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.9rem",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#EAE1D4",
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            {barber.name}
          </p>
        </div>

        <div
          className="absolute left-0 right-0 top-0"
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(197,165,114,0.4), transparent)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px rgba(197,165,114,0.35)" }}
      />
    </div>
  );
}

function TeamMemberCard({ barber }: { barber: Barber }) {
  return (
    <div className="group cursor-default">
      <div className="relative overflow-hidden rounded-xl aspect-square">
        <img
          src={barber.image}
          alt={barber.name}
          width={600}
          height={600}
          loading="lazy"
          fetchPriority="low"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)" }}
        />

        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 0 1px rgba(197,165,114,0.35)" }}
        />
      </div>

      <div className="mt-3 flex items-baseline justify-between px-[2px]">
        <p
          className="transition-colors duration-300"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.3rem",
            fontWeight: 400,
            fontStyle: "italic",
            color: "#C8BFB4",
            lineHeight: 1,
          }}
        >
          {barber.name}
        </p>
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

  const { founders, team } = useMemo(() => {
    const foundersByName = new Set(["Kuba", "Pepa"]);
    return {
      founders: barbers.filter((b) => foundersByName.has(b.name)),
      team: barbers.filter((b) => !foundersByName.has(b.name)),
    };
  }, []);

  return (
    <section id="team" className="py-8 md:py-12 lg:py-20 bg-[#0A0A0A] scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 md:px-16">
        <div className="mb-16">
          <div
            className={`mb-5 flex items-center gap-4 transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            <span className="h-px max-w-[40px] flex-1" style={{ background: "rgba(197,165,114,0.35)" }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.28em",
                color: "#5A5450",
                textTransform: "uppercase",
              }}
            >
              {t("team.label")}
            </span>
          </div>

          <h2
            className={`mb-5 transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.6rem, 5vw, 4rem)",
              fontWeight: 300,
              color: "#EAE1D4",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              transitionDelay: inView ? "50ms" : undefined,
            }}
          >
            J
            <em style={{ fontStyle: "italic", color: "#C5A572", margin: "0 0.05em" }}>&</em>J {t("team.heading")}
          </h2>

          <p
            className={`transition-all duration-500 ease-out ${inView ? "opacity-100" : "opacity-0"}`}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.88rem",
              color: "#5A5450",
              lineHeight: 1.7,
              maxWidth: "36ch",
              transitionDelay: inView ? "100ms" : undefined,
            }}
          >
            {t("team.description").split(". ").map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 ? "." : ""}
                {idx < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>

        <div style={{ minHeight: contentInView ? undefined : "560px" }} aria-hidden={!contentInView}>
          {contentInView ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                {founders.map((b) => (
                  <FounderCard key={b.id} barber={b} roleLabel={t("team.founder")} />
                ))}
              </div>

              <div className="my-4 h-px w-full" style={{ background: "rgba(255,255,255,0.04)" }} />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {team.map((b) => (
                  <TeamMemberCard key={b.id} barber={b} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
