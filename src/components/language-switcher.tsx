"use client";

import { useLocale } from "@/lib/locale-context";
import { type Locale } from "@/lib/translations";

const FLAGS: { locale: Locale; flag: string; label: string }[] = [
  { locale: "cs", flag: "🇨🇿", label: "Čeština" },
  { locale: "en", flag: "🇬🇧", label: "English" },
  { locale: "uk", flag: "🇺🇦", label: "Українська" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1">
      {FLAGS.map(({ locale: loc, flag, label }) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          className={`flex h-8 w-9 items-center justify-center rounded-md text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
            locale === loc
              ? "bg-[var(--accent)]/30 ring-1 ring-[var(--accent)]/60"
              : "hover:bg-[var(--border)]"
          }`}
          aria-label={label}
          aria-current={locale === loc ? "true" : undefined}
          title={label}
        >
          <span role="img" aria-hidden>
            {flag}
          </span>
        </button>
      ))}
    </div>
  );
}
