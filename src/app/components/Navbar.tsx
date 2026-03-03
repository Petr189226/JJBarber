import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Pobočky", href: "#locations" },
  { label: "Tým", href: "#team" },
  { label: "Ceník", href: "#services" },
  { label: "Recenze", href: "#reviews" },
  { label: "Kontakt", href: "#booking" },
];

const RESERVIO_URL = "https://j-j-barbershop.reservio.com/";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
                  key={link.label}
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

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-4">
              <a
                href={RESERVIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] active:scale-95"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                Rezervovat termín
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
                  key={link.label}
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
                Rezervovat termín
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
