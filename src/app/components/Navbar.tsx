import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useLanguage, type Lang } from "../i18n";
import { BookButton } from "./BookButton";
import { CTA_SCROLL_THRESHOLD, RESERVIO_URL } from "../cta-config";

function FlagCZ({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 640 480" className="rounded-[3px] overflow-hidden">
      <rect width="640" height="480" fill="#d7141a" />
      <rect width="640" height="240" fill="#fff" />
      <path d="M 0,0 320,240 0,480 z" fill="#11457e" />
    </svg>
  );
}

function FlagGB({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 640 480" className="rounded-[3px] overflow-hidden">
      <rect width="640" height="480" fill="#012169" />
      <path d="M75,0 L640,370 640,480 565,480 0,110 0,0z M565,0 L640,0 640,110 75,480 0,480 0,370z" fill="#fff" />
      <path d="M267,0 L267,480 373,480 373,0z M0,160 L0,320 640,320 640,160z" fill="#fff" />
      <path d="M283,0 L283,480 357,480 357,0z M0,176 L0,304 640,304 640,176z" fill="#C8102E" />
      <path d="M0,320 L213,320 0,480z M0,0 L213,160 0,160z M640,0 L427,160 640,160z M640,480 L427,320 640,320z" fill="#C8102E" />
    </svg>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggle = () => setLang(lang === "cs" ? "en" : "cs");

  const flags: Record<Lang, { component: typeof FlagCZ; label: string }> = {
    cs: { component: FlagCZ, label: "CZ" },
    en: { component: FlagGB, label: "EN" },
  };

  const current = flags[lang];
  const CurrentFlag = current.component;

  return (
    <button
      onClick={toggle}
      className="relative flex items-center gap-2 px-3 py-2 border border-[#2A2A2A] hover:border-white/15 rounded-sm transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none group"
      aria-label={`Switch language to ${lang === "cs" ? "English" : "Czech"}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0, scale: 0.8, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <CurrentFlag size={18} />
          <span
            className="text-[#8A8580] group-hover:text-[#E8E0D4] transition-colors duration-[180ms]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.1em" }}
          >
            {current.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.locations"), href: "#locations" },
    { label: t("nav.team"), href: "#team" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.reviews"), href: "#reviews" },
    { label: t("nav.contact"), href: "#booking" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > CTA_SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center group"
            >
              <img
                src="/logo.png"
                alt="J&J Barber Shop"
                className="h-9 w-auto object-contain"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="group text-[#8A8580] hover:text-[#E8E0D4] transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] tracking-[0.12em] uppercase relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:rounded-sm"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.72rem" }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/30 group-hover:w-full transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </a>
              ))}
            </nav>

            {/* CTA + Language + Mobile toggle */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <BookButton
                href={RESERVIO_URL}
                label={t("nav.book")}
                size="sm"
                variant={scrolled ? "primary" : "ghost"}
                showIcon={false}
                className="hidden sm:inline-flex"
              />
              <button
                className="lg:hidden text-[#E8E0D4] hover:text-[#B5AEA4] transition-colors duration-[180ms] p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:rounded-sm"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-xl border-b border-white/[0.06] lg:hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-[#8A8580] hover:text-[#E8E0D4] py-3 border-b border-[#1A1A1A] transition-colors duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-inset"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <BookButton
                href={RESERVIO_URL}
                label={t("nav.book")}
                size="md"
                variant={scrolled ? "primary" : "ghost"}
                showIcon={false}
                className="mt-4 w-full justify-center"
              />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
