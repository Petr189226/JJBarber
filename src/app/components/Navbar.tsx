import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useLanguage, type Lang } from "../i18n";

const RESERVIO_URL = "https://j-j-barbershop.reservio.com/";

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
      className="relative flex items-center gap-2 px-3 py-2 border border-[#2A2A2A] hover:border-[#C9A84C]/40 rounded-sm transition-all duration-300 group"
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
            className="text-[#A89880] group-hover:text-[#E8DCC8] transition-colors duration-200"
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
    const onScroll = () => setScrolled(window.scrollY > 40);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A84C]/20 shadow-2xl"
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
                  className="text-[#A89880] hover:text-[#E8DCC8] transition-colors duration-300 tracking-widest uppercase relative group"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.12em" }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA + Language + Mobile toggle */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <a
                href={RESERVIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] active:scale-95"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {t("nav.book")}
              </a>
              <button
                className="lg:hidden text-[#E8DCC8] hover:text-[#C9A84C] transition-colors p-1"
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
            className="fixed top-20 left-0 right-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-xl border-b border-[#C9A84C]/20 lg:hidden"
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
                  className="text-[#A89880] hover:text-[#E8DCC8] py-3 border-b border-[#1A1A1A] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={RESERVIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-center px-5 py-3 bg-[#C9A84C] text-[#0A0A0A] rounded-sm"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {t("nav.book")}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
