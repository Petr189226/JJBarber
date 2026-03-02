"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

const KEY = "cookie-consent";

export function CookieBar() {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const v = localStorage.getItem(KEY);
      if (v === "all" || v === "necessary") setConsent(v);
    } catch {
      setConsent(null);
    }
  }, []);

  useEffect(() => {
    if (!mounted || consent) return;
    document.body.style.paddingBottom = "100px";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [mounted, consent]);

  if (!mounted || consent) return null;

  const save = (v: string) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* noop */
    }
    setConsent(v);
  };

  return (
    <div
      role="dialog"
      aria-label="Souhlas s cookies"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[var(--border)] bg-[var(--card)] px-4 py-4"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-300">
          {t("cookieMessage")}{" "}
          <Link
            href="/zasady-ochrany-osobnich-udaju"
            className="ml-1 font-medium text-[var(--accent)] underline hover:text-[var(--accent-hover)]"
          >
            {t("cookiePrivacy")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => save("necessary")}
            className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-gray-300 hover:bg-[var(--border)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
          >
            {t("cookieNecessary")}
          </button>
          <button
            type="button"
            onClick={() => save("all")}
            className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
          >
            {t("cookieAcceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
