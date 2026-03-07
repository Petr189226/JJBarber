import { useState, useEffect } from "react";
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

  if (!visible) return null;

  return (
    <div
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
    </div>
  );
}
