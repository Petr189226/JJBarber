import { useEffect, useRef, useState } from "react";
import { Scissors, ScissorsLineDashed, Slice, Star, Baby, Clock, type LucideIcon } from "lucide-react";
import { useLanguage } from "../i18n";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  "svc.classic": Scissors,
  "svc.long": Scissors,
  "svc.beard": ScissorsLineDashed,
  "svc.shave": Slice,
  "svc.combo": Star,
  "svc.kids": Baby,
};

function ServiceIconBadge({ icon: Icon, popular }: { icon: LucideIcon; popular: boolean }) {
  return (
    <div
      className={`w-12 h-12 min-w-12 min-h-12 flex-shrink-0 rounded-xl flex items-center justify-center mb-6 transition-colors duration-200 ${
        popular
          ? "bg-[#C9A84C]/12 border border-[#C9A84C]/25"
          : "bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-white/10"
      }`}
    >
      <Icon
        size={20}
        className={
          popular
            ? "text-[#C9A84C]"
            : "text-[#8A8580] group-hover:text-[#B5AEA4] transition-colors duration-200"
        }
      />
    </div>
  );
}

interface Service {
  nameKey: string;
  descKey: string;
  price: string | null;
  hasDuration: boolean;
  popular: boolean;
}

const services: Service[] = [
  { nameKey: "svc.combo", descKey: "svc.combo", price: "790", hasDuration: true, popular: true },
  { nameKey: "svc.classic", descKey: "svc.classic", price: "490", hasDuration: true, popular: false },
  { nameKey: "svc.long", descKey: "svc.long", price: "690", hasDuration: true, popular: false },
  { nameKey: "svc.beard", descKey: "svc.beard", price: "390", hasDuration: true, popular: false },
  { nameKey: "svc.shave", descKey: "svc.shave", price: "390", hasDuration: true, popular: false },
  { nameKey: "svc.kids", descKey: "svc.kids", price: "450", hasDuration: true, popular: false },
];

function ServiceCard({ service, index, onClick, t }: { service: Service; index: number; onClick?: () => void; t: (k: string) => string }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setInView(true), index * 80);
    return () => clearTimeout(id);
  }, [index]);
  const icon = SERVICE_ICON_MAP[service.nameKey] ?? Scissors;

  return (
    <div
      onClick={onClick}
      style={{ transitionDelay: inView ? `${index * 80}ms` : undefined }}
      className={`relative group flex h-full flex-col rounded-xl border transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} ${
        service.popular
          ? "border-[#C9A84C]/40 bg-[#111111] hover:border-[#C9A84C]/50"
          : "border-[#1F1F1F] bg-[#111111] hover:border-white/[0.08]"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex min-h-0 flex-1 flex-col p-8">
        <div className="flex items-center justify-between gap-3">
          <ServiceIconBadge icon={icon} popular={service.popular} />
          {service.popular && (
            <span
              className="shrink-0 px-3 py-1 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#D4B85A] text-[0.65rem] tracking-[0.12em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
            >
              {t("svc.popular")}
            </span>
          )}
        </div>

        <h3
          className="text-[#C4BEB4] mb-1"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.25rem" }}
        >
          {t(`${service.nameKey}.name`)}
        </h3>
        {service.hasDuration && (
          <span
            className="text-[#8A8580] flex items-center gap-1.5 mb-3"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "0.78rem" }}
          >
            <Clock size={12} className="text-[#8A8580] flex-shrink-0" />
            {t(`${service.nameKey}.duration`)}
          </span>
        )}
        {!service.hasDuration && <div className="mb-2" />}

        <p
          className="text-[#B5AEA4]/70 min-h-0 flex-1 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.8 }}
        >
          {t(`${service.descKey}.desc`)}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-[#1F1F1F] pt-6 mt-6">
          <div className="flex items-baseline">
            {service.price != null ? (
              <>
                <span
                  className="text-[#C9A84C]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "2rem", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
                >
                  {service.price}
                </span>
                <span
                  className="text-[#8A8580] ml-1"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
                >
                  {t("svc.currency")}
                </span>
              </>
            ) : (
              <span
                className={onClick ? "text-[#C9A84C]" : "text-[#8A8580]"}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: onClick ? 600 : 400, fontSize: "0.85rem", letterSpacing: onClick ? "0.05em" : undefined }}
              >
                {onClick ? t("svc.orderVoucher") : t("svc.onRequest")}
              </span>
            )}
          </div>
        </div>
      </div>

      {service.popular && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.15)" }} />
      )}
    </div>
  );
}

export function Services() {
  const [inView, setInView] = useState(false);
  const [contentInView, setContentInView] = useState(false);
  useEffect(() => {
    setInView(true);
    const t = setTimeout(() => setContentInView(true), 100);
    return () => clearTimeout(t);
  }, []);
  const { t } = useLanguage();

  return (
    <section id="services" className="py-8 md:py-12 lg:py-20 bg-[#0A0A0A] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <h2
            className={`text-[#C4BEB4] mb-8 transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.2, transitionDelay: inView ? "50ms" : undefined }}
          >
            {t("svc.heading")}
          </h2>
        </div>

        <div style={{ minHeight: contentInView ? undefined : "480px" }} aria-hidden={!contentInView}>
          {contentInView ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 [&>div]:h-full">
              {services.map((service, i) => (
                <ServiceCard key={service.nameKey} service={service} index={i} t={t} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
