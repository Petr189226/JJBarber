import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage, type Lang } from "../i18n";
import { BookButton } from "./BookButton";
import { CTA_SCROLL_THRESHOLD, RESERVIO_URL } from "../cta-config";

function FlagCZ({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 640 480" className="rounded-lg overflow-hidden">
      <rect width="640" height="480" fill="#d7141a" />
      <rect width="640" height="240" fill="#fff" />
      <path d="M 0,0 320,240 0,480 z" fill="#11457e" />
    </svg>
  );
}

function FlagGB({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 80" className="rounded-lg overflow-hidden">
      <rect width="120" height="80" fill="#012169" />
      <path d="M-4,-4 L124,84 L132,76 L4,-12 Z M124,-4 L-4,84 L-12,76 L116,-12 Z" fill="#fff" />
      <path d="M0,15 L105,80 L113,72 L8,7 Z M120,15 L15,80 L7,72 L112,7 Z M15,0 L120,65 L112,73 L7,8 Z M105,0 L0,65 L8,73 L113,8 Z" fill="#C8102E" />
      <rect x="38" y="0" width="44" height="80" fill="#fff" />
      <rect x="0" y="18" width="120" height="44" fill="#fff" />
      <rect x="46" y="0" width="28" height="80" fill="#C8102E" />
      <rect x="0" y="26" width="120" height="28" fill="#C8102E" />
    </svg>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggle = () => setLang(lang === "cs" ? "en" : "cs");

  const flags: Record<Lang, { component: typeof FlagCZ | typeof FlagGB; label: string }> = {
    cs: { component: FlagCZ, label: "CZ" },
    en: { component: FlagGB, label: "EN" },
  };

  const current = flags[lang];
  const CurrentFlag = current.component;

  return (
    <button
      onClick={toggle}
      className="relative flex items-center gap-2 px-3 py-2 border border-[#2A2A2A] hover:border-[#C9A84C]/40 rounded-xl transition-all duration-200 cursor-pointer ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none group"
      aria-label={`Switch language to ${lang === "cs" ? "English" : "Czech"}`}
    >
      <div className="flex items-center gap-2">
        <CurrentFlag size={18} />
        <span
          className="text-[#8A8580] group-hover:text-[#C9A84C] transition-colors duration-200"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.1em" }}
        >
          {current.label}
        </span>
      </div>
    </button>
  );
}

const SECTION_IDS = ["locations", "team", "services", "voucher", "reviews", "booking"] as const;

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const navLinks = [
    { label: t("nav.locations"), href: "#locations", id: "locations" },
    { label: t("nav.team"), href: "#team", id: "team" },
    { label: t("nav.services"), href: "#services", id: "services" },
    { label: t("nav.voucher"), href: "#voucher", id: "voucher" },
    { label: t("nav.reviews"), href: "#reviews", id: "reviews" },
    { label: t("nav.contact"), href: "#booking", id: "booking" },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > CTA_SCROLL_THRESHOLD);
      const offset = 180;
      let current: string | null = null;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = SECTION_IDS[i];
          break;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <picture>
                <source
                  srcSet="/logo-240.webp 240w, /logo-480.webp 480w"
                  sizes="(max-width: 768px) 120px, 135px"
                  type="image/webp"
                />
                <img
                  src="/logo-480.webp"
                  alt="J&J Barber Shop"
                  width={480}
                  height={145}
                  className="h-9 w-auto object-contain"
                />
              </picture>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className={`group relative px-4 py-2.5 rounded-lg transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${
                      isActive
                        ? "text-[#C9A84C] bg-[#C9A84C]/10"
                        : "text-[#8A8580] hover:text-[#C9A84C] hover:bg-[#C9A84C]/8"
                    }`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[#C9A84C]" />
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 lg:gap-4 lg:pl-4 lg:border-l lg:border-white/[0.06]">
              <LanguageSwitcher />
              <BookButton
                href={RESERVIO_URL}
                label={t("nav.book")}
                size="sm"
                variant="primary"
                showIcon={false}
                className="hidden sm:inline-flex"
              />
              <button
                className="lg:hidden text-[#C4BEB4] hover:text-[#B5AEA4] transition-colors duration-200 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:rounded-xl"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-xl border-b border-white/[0.06] lg:hidden">
          <nav className="flex flex-col px-6 py-6 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-[#8A8580] hover:text-[#C4BEB4] py-3 border-b border-[#1A1A1A] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-inset"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                {link.label}
              </a>
            ))}
            <BookButton
              href={RESERVIO_URL}
              label={t("nav.book")}
              size="md"
              variant="primary"
              showIcon={false}
              className="mt-4 w-full justify-center"
            />
          </nav>
        </div>
      )}
    </>
  );
}
