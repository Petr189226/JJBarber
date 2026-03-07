import { useEffect, useState } from "react";
import { Star, Users, MapPin, Calendar, Car } from "lucide-react";
import { useLanguage } from "../i18n";

const TRUST_ITEMS = [
  { icon: Star, key: "why.rating", value: "4.9" },
  { icon: Users, key: "why.barbers", value: "8" },
  { icon: MapPin, key: "why.salon", value: null },
  { icon: Calendar, key: "why.booking", value: null },
  { icon: Car, key: "why.parking", value: null },
];

export function WhyUs() {
  const [inView, setInView] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setInView(true);
  }, []);

  return (
    <section id="why" className="py-12 md:py-16 lg:py-24 bg-[#111111] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div
            className={`flex items-center justify-center gap-3 mb-5 transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <div className="w-8 h-px bg-[#8A8580]" />
            <span
              className="text-[#8A8580] tracking-[0.25em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
            >
              {t("why.label")}
            </span>
            <div className="w-8 h-px bg-[#8A8580]" />
          </div>
          <h2
            className={`text-[#C4BEB4] transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.2, transitionDelay: "50ms" }}
          >
            {t("why.heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className={`flex flex-col items-center text-center p-6 rounded-xl border border-[#1F1F1F] bg-[#0D0D0D] hover:border-[#C9A84C]/30 transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#C9A84C]" />
                </div>
                {item.value && (
                  <span
                    className="text-[#C9A84C] font-bold mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}
                  >
                    {item.value}
                  </span>
                )}
                <span
                  className="text-[#B5AEA4]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.5 }}
                >
                  {t(item.key)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
