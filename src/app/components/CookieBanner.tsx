import { useState, useEffect } from "react";
import { useLanguage } from "../i18n";

const STORAGE_KEY = "jj-cookie-consent";

export function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-4xl mx-auto bg-[#111111] border border-white/[0.08] rounded-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p
              className="text-[#B5AEA4] text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}
            >
              {t("cookie.message")}{" "}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("jj-open-privacy"))}
                className="text-[#C9A84C] hover:text-[#D4B85A] underline underline-offset-2 transition-colors cursor-pointer"
              >
                {t("footer.privacy")}
              </button>
              .
            </p>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-shrink-0 px-6 py-3 bg-gradient-to-b from-[#D4B85A] to-[#C9A84C] hover:from-[#DDC268] hover:to-[#D4B85A] text-[#0A0A0A] rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(201,168,76,0.25)] cursor-pointer"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              {t("cookie.accept")}
            </button>
          </div>
    </div>
  );
}
