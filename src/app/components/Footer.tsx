import { motion } from "motion/react";
import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/jjbarbershop_vrsovicka/";
const FACEBOOK_URL = "https://www.facebook.com/112444267014044";
const PRIVACY_URL = "https://www.jjbarbershop.cz/zasady-ochrany-osobnich-udaju";

const navColumns = [
  {
    title: "Navigace",
    links: [
      { label: "Úvod", href: "#" },
      { label: "Pobočky", href: "#locations" },
      { label: "Tým", href: "#team" },
      { label: "Ceník", href: "#services" },
      { label: "Recenze", href: "#reviews" },
      { label: "Kontakt", href: "#booking" },
    ],
  },
  {
    title: "Služby",
    links: [
      { label: "Klasický střih", href: "#services" },
      { label: "Střih + vousy", href: "#services" },
      { label: "Holení vousů", href: "#services" },
      { label: "Úprava vousů", href: "#services" },
    ],
  },
];

export function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#080808] border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-block mb-5"
            >
              <img
                src="/logo.png"
                alt="J&J Barber Shop"
                className="h-10 w-auto object-contain"
              />
            </a>
            <p
              className="text-[#4A4A4A] mb-6 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.75 }}
            >
              Lokální barber shop s přátelskou atmosférou – Vršovice a Strašnice, Praha 10.
            </p>
            <div className="flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#222222] hover:border-[#C9A84C]/40 rounded-sm flex items-center justify-center text-[#4A4A4A] hover:text-[#C9A84C] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#222222] hover:border-[#C9A84C]/40 rounded-sm flex items-center justify-center text-[#4A4A4A] hover:text-[#C9A84C] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h4
                className="text-[#C9A84C] mb-5 tracking-widest uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.2em" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className="text-[#4A4A4A] hover:text-[#A89880] transition-colors duration-300"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4
              className="text-[#C9A84C] mb-5 tracking-widest uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.2em" }}
            >
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#C9A84C]/60 flex-shrink-0 mt-0.5" />
                <span className="text-[#4A4A4A] whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Vršovická 7/27, 101 00 Praha 10
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#C9A84C]/60 flex-shrink-0 mt-0.5" />
                <span className="text-[#4A4A4A] whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Černokostelecká 830/23, 100 00 Praha 10
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-[#C9A84C]/60 flex-shrink-0 mt-0.5" />
                <a href="tel:+420777507662" className="text-[#4A4A4A] hover:text-[#A89880] transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  777 507 662
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="text-[#C9A84C]/60 flex-shrink-0 mt-0.5" />
                <span className="text-[#4A4A4A]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Po–Pá 9:00–21:00, So 10:00–17:00
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#111111]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span
            className="text-[#2A2A2A]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
          >
            © 2026 J&amp;J Barber Shop. Všechna práva vyhrazena.
          </span>
          <div className="flex gap-6">
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2A2A2A] hover:text-[#4A4A4A] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
            >
              Zásady ochrany osobních údajů
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
