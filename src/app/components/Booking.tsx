import { useEffect, useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { useLanguage } from "../i18n";
import { BookButton } from "./BookButton";
import { RESERVIO_URL, RESERVIO_VRSOVICE, RESERVIO_STRASNICE } from "../cta-config";

export function Booking() {
  const [inView, setInView] = useState(false);
  const [rightInView, setRightInView] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  useEffect(() => {
    setInView(true);
    const t = setTimeout(() => setRightInView(true), 100);
    return () => clearTimeout(t);
  }, []);
  const { t } = useLanguage();

  return (
    <section
      id="booking"
      className="relative py-16 md:py-24 lg:py-28 scroll-mt-24 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d0c08 0%, #0a0a09 50%, #080808 100%)",
        borderTop: "1px solid rgba(201,162,85,0.08)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-4%",
          bottom: "-10%",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(10rem, 20vw, 18rem)",
          fontWeight: 300,
          color: "rgba(201,162,85,0.02)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {t("book.label")}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className={`pt-2 transition-all duration-500 ease-out ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}>
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
                {t("book.label")}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3rem, 5.5vw, 5rem)",
                fontWeight: 300,
                color: "#F5F0E8",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                margin: "0 0 2.5rem",
              }}
            >
              {t("book.heading1")}
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A255" }}>{t("book.heading2")}</em>
            </h2>

            <div
              style={{
                height: "1px",
                width: "60px",
                background: "#C9A255",
                marginBottom: "2rem",
                opacity: 0.4,
              }}
            />

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(245,240,232,0.86)",
                lineHeight: 1.9,
                letterSpacing: "0.01em",
                margin: "0 0 2.5rem",
                maxWidth: "360px",
              }}
            >
              {t("book.description")}
            </p>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: "2.5rem" }}>
              {[
                { label: "Vršovice", value: "Vršovická 7/27, 101 00 Praha 10" },
                { label: "Strašnice", value: "Černokostelecká 830/23, 100 00 Praha 10" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.85rem 0",
                    borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#C9A255",
                      marginTop: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.7rem",
                        color: "#C9A255",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginRight: "0.5rem",
                      }}
                    >
                      {item.label}:
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.88rem",
                        color: "rgba(245,240,232,0.9)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  paddingTop: "0.85rem",
                }}
              >
                <span style={{ color: "#C9A255" }}>
                  <Phone size={14} />
                </span>
                <a
                  href="tel:+420777507662"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(245,240,232,0.9)",
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                  }}
                >
                  777 507 662
                </a>
              </div>
            </div>

            <div
              style={{
                borderLeft: "2px solid rgba(201,162,85,0.45)",
                paddingLeft: "1.5rem",
                marginTop: "2.8rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.15rem",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "rgba(245,240,232,0.78)",
                  lineHeight: 1.7,
                  margin: "0 0 0.75rem",
                  letterSpacing: "0.01em",
                }}
              >
                „{t("book.quote")}"
              </p>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(201,162,85,0.85)",
                }}
              >
                — J&J Barber Shop
              </span>
            </div>
          </div>

          <div style={{ minHeight: rightInView ? undefined : "320px" }} aria-hidden={!rightInView}>
            {rightInView ? (
              <div className="space-y-6 pt-2 opacity-100 translate-x-0 transition-all duration-500 ease-out">
                {[
                  {
                    id: "01",
                    name: "Vršovice",
                    address: "Vršovická 7/27, 101 00 Praha 10",
                    url: RESERVIO_VRSOVICE,
                  },
                  {
                    id: "02",
                    name: "Strašnice",
                    address: "Černokostelecká 830/23, 100 00 Praha 10",
                    url: RESERVIO_STRASNICE,
                  },
                ].map((loc) => {
                  const isHovered = hoveredCard === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onMouseEnter={() => setHoveredCard(loc.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        position: "relative",
                        padding: "2.25rem 2.5rem",
                        background: isHovered
                          ? "linear-gradient(135deg, rgba(201,162,85,0.07) 0%, rgba(255,255,255,0.02) 100%)"
                          : "rgba(255,255,255,0.025)",
                        border: `1px solid ${isHovered ? "rgba(201,162,85,0.3)" : "rgba(255,255,255,0.06)"}`,
                        transition: "all 0.4s ease",
                        cursor: "default",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "1px",
                          background: isHovered
                            ? "linear-gradient(to right, #C9A255, transparent)"
                            : "transparent",
                          transition: "background 0.4s ease",
                        }}
                      />

                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          right: "1.5rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "6rem",
                          fontWeight: 300,
                          color: isHovered ? "rgba(201,162,85,0.08)" : "rgba(201,162,85,0.04)",
                          lineHeight: 1,
                          userSelect: "none",
                          pointerEvents: "none",
                          letterSpacing: "-0.03em",
                          transition: "color 0.4s ease",
                        }}
                      >
                        {loc.id}
                      </div>

                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "1px",
                              background: "#C9A255",
                              opacity: isHovered ? 1 : 0.4,
                              transition: "opacity 0.4s",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.6rem",
                              letterSpacing: "0.22em",
                              color: "#C9A255",
                              textTransform: "uppercase",
                              opacity: isHovered ? 1 : 0.6,
                              transition: "opacity 0.4s",
                            }}
                          >
                            JJ Barber Shop
                          </span>
                        </div>

                        <h3
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                            fontWeight: 300,
                            color: "#F5F0E8",
                            lineHeight: 1.1,
                            letterSpacing: "-0.01em",
                            margin: "0 0 0.75rem",
                          }}
                        >
                          {loc.name}
                        </h3>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.55rem",
                            marginBottom: "2rem",
                          }}
                        >
                          <MapPin size={15} />
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.9rem",
                              color: "rgba(245,240,232,0.9)",
                              letterSpacing: "0.03em",
                            }}
                          >
                            {loc.address}
                          </span>
                        </div>

                        <a
                          href={loc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "0.75rem 1.75rem",
                            background: isHovered ? "#C9A255" : "transparent",
                            border: `1px solid ${isHovered ? "#C9A255" : "rgba(201,162,85,0.35)"}`,
                            color: isHovered ? "#0A0A0A" : "rgba(201,162,85,0.8)",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            fontWeight: 500,
                            transition: "all 0.4s ease",
                          }}
                        >
                          {t("book.reserve")} — {loc.name}
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: isHovered ? "translateX(3px)" : "translateX(0)",
                              transition: "transform 0.4s ease",
                            }}
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  );
                })}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    paddingTop: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "1px",
                      background: "rgba(201,162,85,0.2)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.65rem",
                      color: "rgba(245,240,232,0.25)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {t("book.bottomNote")}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
