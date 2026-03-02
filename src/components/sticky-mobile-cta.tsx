"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBookingLink } from "@/lib/booking-url";
import { useLocale } from "@/lib/locale-context";

const SCROLL_THRESHOLD_PX = 250;

export function StickyMobileCTA() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-area-pb md:hidden">
      <div className="flex items-stretch gap-2 border-t border-[var(--border)] bg-[var(--card)]/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-[var(--card)]/90">
        <a
          href="#pobocky"
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-[var(--border)] py-3 text-sm font-medium text-white transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)]"
          aria-label="Přejít na pobočky"
        >
          {t("stickyBranches")}
        </a>
        <Link
          {...getBookingLink()}
          className="flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-[var(--accent)] py-3 px-4 text-base font-bold text-black shadow-lg transition hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)]"
          aria-label="Rezervovat termín"
        >
          {t("stickyBook")}
        </Link>
      </div>
    </div>
  );
}
