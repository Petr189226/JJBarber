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
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #111009 0%, #0d0c08 50%, #0a0a0a 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Dekorativní velký nápis v pozadí */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "2%",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(10rem, 20vw, 17rem)",
            fontWeight: 300,
            color: "rgba(201,168,76,0.04)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.04em",
          }}
        >
          Gift
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative">
          <div
            className={`transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            {/* Tag */}
            <div className="flex items-center gap-4 mb-6">
              <div style={{ width: "40px", height: "1px", background: "#C9A255" }} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.28em",
                  color: "#C9A255",
                  textTransform: "uppercase",
                }}
              >
                {t("voucher.tag")}
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "clamp(2.8rem, 5vw, 4.4rem)",
                color: "#F5F0E8",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
              }}
            >
              {t("voucher.title")}
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A255" }}>J&J Barber Shop</em>
            </h2>

            {/* Zlata linka */}
            <div
              style={{
                height: "1px",
                width: "60px",
                background: "#C9A255",
                marginBottom: "2rem",
                opacity: 0.5,
              }}
            />

            {/* Popis */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(245,240,232,0.9)",
                lineHeight: 1.9,
                letterSpacing: "0.01em",
                marginBottom: "2.4rem",
                maxWidth: "400px",
              }}
            >
              {t("voucher.sectionDesc")}
            </p>

            {/* Feature chips – ponechán jen hlavní benefit */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid rgba(201,162,85,0.4)",
                  color: "rgba(245,240,232,0.9)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {t("voucher.feature1")}
              </span>
            </div>

            <button
              onClick={() => setVoucherOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-200 group"
              style={{
                background: "#C9A255",
                color: "#0A0A0A",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "0.8rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {t("voucher.orderBtn")}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-700 ease-out delay-150 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Glow za kartou */}
              <div
                style={{
                  position: "absolute",
                  inset: "-25%",
                  background:
                    "radial-gradient(ellipse at center, rgba(201,162,85,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Rohové linky */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "6px",
                  width: "28px",
                  height: "28px",
                  borderTop: "1px solid rgba(201,162,85,0.5)",
                  borderLeft: "1px solid rgba(201,162,85,0.5)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-12px",
                  right: "6px",
                  width: "28px",
                  height: "28px",
                  borderBottom: "1px solid rgba(201,162,85,0.5)",
                  borderRight: "1px solid rgba(201,162,85,0.5)",
                }}
              />

              {/* Voucher image – zachováno */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "480px",
                }}
              >
                <img
                  src="/voucher-card.png"
                  alt="Dárkový poukaz J&J Barber Shop"
                  className="w-full h-auto block"
                  style={{
                    boxShadow:
                      "0 32px 70px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.45)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-36px",
                    left: "12%",
                    right: "12%",
                    height: "40px",
                    background:
                      "linear-gradient(to bottom, rgba(201,162,85,0.08), transparent)",
                    filter: "blur(12px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoucherModal open={voucherOpen} onClose={() => setVoucherOpen(false)} />
    </section>
  );
}
