import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "../i18n";

const RESERVIO_URL = "https://j-j-barbershop.reservio.com/";

export function StickyBookBar() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked(true);
    setTimeout(() => {
      window.open(RESERVIO_URL, "_blank");
      setClicked(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#C9A84C]/20 px-4 py-3">
            <a
              href={RESERVIO_URL}
              onClick={handleClick}
              className={`flex w-full items-center justify-center gap-2 py-3.5 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] focus:ring-2 focus:ring-[#C9A84C]/50 focus:outline-none ${clicked ? "scale-[0.98]" : "active:scale-95"}`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              {clicked ? t("cta.redirecting") : t("sticky.book")}
              <ExternalLink size={15} />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
