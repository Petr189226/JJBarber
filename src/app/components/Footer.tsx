import { motion } from "motion/react";
import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";
import { useLanguage } from "../i18n";

const INSTAGRAM_URL = "https://www.instagram.com/jjbarbershop_vrsovicka/";
const FACEBOOK_URL = "https://www.facebook.com/112444267014044";
const PRIVACY_URL = "https://www.jjbarbershop.cz/zasady-ochrany-osobnich-udaju";

export function Footer() {
  const { t } = useLanguage();

  const navColumns = [
    {
      title: t("footer.nav"),
      links: [
        { label: t("footer.home"), href: "#" },
        { label: t("nav.locations"), href: "#locations" },
        { label: t("nav.team"), href: "#team" },
        { label: t("nav.services"), href: "#services" },
        { label: t("nav.reviews"), href: "#reviews" },
        { label: t("nav.contact"), href: "#booking" },
      ],
    },
    {
      title: t("footer.services"),
      links: [
        { label: t("svc.classic.name"), href: "#services" },
        { label: t("svc.combo.name"), href: "#services" },
        { label: t("svc.shave.name"), href: "#services" },
        { label: t("svc.beard.name"), href: "#services" },
      ],
    },
  ];

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#080808] border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-block mb-5"
            >
              <img src="/logo.png" alt="J&J Barber Shop" className="h-10 w-auto object-contain" />
            </a>
            <p
              className="text-[#6B6660] mb-6 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.8 }}
            >
              {t("footer.brand")}
            </p>
            <div className="flex gap-3">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-[#222222] hover:border-white/15 rounded-sm flex items-center justify-center text-[#6B6660] hover:text-[#B5AEA4] transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]" aria-label="Instagram">
                <Instagram size={15} />
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-[#222222] hover:border-white/15 rounded-sm flex items-center justify-center text-[#6B6660] hover:text-[#B5AEA4] transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]" aria-label="Facebook">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {navColumns.map((col) => (
            <div key={col.title}>
              <h4
                className="text-[#8A8580] mb-5 tracking-[0.15em] uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.72rem" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className="text-[#6B6660] hover:text-[#B5AEA4] transition-colors duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] focus-visible:rounded-sm"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4
              className="text-[#C9A84C] mb-5 tracking-widest uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.2em" }}
            >
              {t("footer.contact")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#8A8580] flex-shrink-0 mt-0.5" />
                <span className="text-[#6B6660] whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Vršovická 7/27, 101 00 Praha 10
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#8A8580] flex-shrink-0 mt-0.5" />
                <span className="text-[#6B6660] whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Černokostelecká 830/23, 100 00 Praha 10
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-[#8A8580] flex-shrink-0 mt-0.5" />
                <a href="tel:+420777507662" className="text-[#6B6660] hover:text-[#B5AEA4] transition-colors duration-[180ms]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  777 507 662
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="text-[#8A8580] flex-shrink-0 mt-0.5" />
                <span className="text-[#6B6660]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {t("footer.hours")}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#111111]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[#2A2A2A]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
            {t("footer.copyright")}
          </span>
          <div className="flex gap-6">
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3A3A3A] hover:text-[#6B6660] transition-colors duration-[180ms] focus-visible:outline-none"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
            >
              {t("footer.privacy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
