"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";

const NAV_KEYS = [
  { href: "/#pobocky", key: "navBranches" as const },
  { href: "/#sluzby", key: "navServices" as const },
  { href: "/#cenik", key: "navPricing" as const },
  { href: "/#tym", key: "navTeam" as const },
  { href: "/#poukaz", key: "navVoucher" as const },
  { href: "/#kontakt", key: "navContact" as const },
];

export function Header() {
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)] py-4">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="relative h-8 w-32 shrink-0" aria-label="J&J Barber Shop – úvodní stránka">
          <Image src="/logo.png" alt="J&J Barber Shop" width={128} height={32} className="object-contain" />
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden md:flex flex-1 justify-center gap-1">
          {NAV_KEYS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[var(--border)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex h-11 w-11 items-center justify-center text-white hover:text-[var(--accent)]"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-3 md:hidden"
          aria-label="Hlavní navigace"
        >
          <div className="flex flex-col gap-1">
            {NAV_KEYS.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-gray-300 hover:bg-[var(--border)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
