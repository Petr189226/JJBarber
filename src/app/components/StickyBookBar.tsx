import { useState, useEffect } from "react";
import { useLanguage } from "../i18n";

const RESERVIO_URL = "https://j-j-barbershop.reservio.com/";

export function StickyBookBar() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <a
        href={RESERVIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-b from-[#D4B85A] to-[#C9A84C] hover:from-[#DDC268] hover:to-[#D4B85A] text-[#0A0A0A] rounded-xl shadow-[0_4px_24px_rgba(201,168,76,0.35)] hover:shadow-[0_6px_28px_rgba(201,168,76,0.4)] hover:-translate-y-0.5 transition-all duration-200 font-semibold"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.95rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
      >
        {t("sticky.book")}
      </a>
    </div>
  );
}
