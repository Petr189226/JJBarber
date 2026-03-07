import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { VoucherModal } from "./VoucherModal";
import { useLanguage } from "../i18n";

export function VoucherSection() {
  const [inView, setInView] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setInView(true);
  }, []);

  return (
    <section
      id="voucher"
      className="relative py-16 md:py-24 lg:py-28 overflow-hidden scroll-mt-24"
    >
      {/* Gradient background: black → dark gold/brown */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #0A0A0A 0%, #1A1510 50%, #2A2218 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div
            className={`transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            <h2
              className="text-[#C4BEB4] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                lineHeight: 1.2,
              }}
            >
              {t("voucher.title")}
            </h2>
            <p
              className="text-[#B5AEA4]/90 mb-10 leading-relaxed max-w-lg"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            >
              {t("voucher.sectionDesc")}
            </p>
            <button
              onClick={() => setVoucherOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#C9A84C] text-[#C4BEB4] rounded-xl hover:bg-[#C9A84C]/10 transition-all duration-200 group"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.08em" }}
            >
              {t("voucher.orderBtn")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right: voucher card image */}
          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-700 ease-out delay-150 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <div className="relative">
              <img
                src="/voucher-card.png"
                alt="Dárkový poukaz J&J Barber Shop"
                className="w-full max-w-sm lg:max-w-md drop-shadow-2xl"
                style={{ transform: "rotate(-3deg)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <VoucherModal open={voucherOpen} onClose={() => setVoucherOpen(false)} />
    </section>
  );
}
