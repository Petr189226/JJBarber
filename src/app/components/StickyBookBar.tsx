import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n";
import { BookButton } from "./BookButton";

const RESERVIO_URL = "https://j-j-barbershop.reservio.com/";

export function StickyBookBar() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/[0.06] px-4 py-3">
            <BookButton
              href={RESERVIO_URL}
              label={t("sticky.book")}
              size="md"
              className="w-full justify-center py-3.5"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
