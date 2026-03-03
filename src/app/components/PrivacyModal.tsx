import { X, Shield } from "lucide-react";
import { useLanguage } from "../i18n";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: Props) {
  const { t, lang } = useLanguage();

  const content = lang === "cs" ? (
    <>
      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>1. Správce údajů</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Správcem osobních údajů je J&J Barber Shop (IČO a sídlo dle obchodního rejstříku). Kontakt: 777 507 662, pobočky Vršovická 7/27 a Černokostelecká 830/23, Praha 10.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>2. Jaké údaje zpracováváme</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        <strong className="text-[#B5AEA4]">Online rezervace</strong> (systém Reservio): jméno, e-mail, telefon, vybraný termín a služba. <strong className="text-[#B5AEA4]">Objednávka dárkového poukazu</strong> (formulář na webu): jméno, příjmení, e-mail, telefon, výběr služby a pobočky. Případně technické údaje (IP adresa, cookies) při návštěvě webu.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>3. Účel a právní základ</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Údaje zpracováváme za účelem zajištění rezervací, vyřízení objednávek voucherů a komunikace s vámi. Právním základem je plnění smlouvy (rezervace, objednávka) a oprávněný zájem (provoz webu).
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>4. Doba uchování</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Údaje z rezervací a objednávek uchováváme po dobu nezbytnou pro plnění účelu (typicky do 3 let od posledního kontaktu). Účetní doklady dle zákona o účetnictví.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>5. Vaše práva</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování, přenositelnost a námitku. Můžete podat stížnost u Úřadu pro ochranu osobních údajů (uoou.cz).
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>6. Cookies a třetí strany</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Web používá technicky nezbytné cookies pro fungování stránky. Rezervace probíhá přes Reservio (reservio.com), objednávky voucherů přes Web3Forms – jejich zásady ochrany údajů platí pro data předaná těmto službám.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>7. Kontakt</h3>
      <p className="text-[#8A8580]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Dotazy k ochraně údajů: 777 507 662 nebo osobně na pobočkách.
      </p>
    </>
  ) : (
    <>
      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>1. Data Controller</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        The data controller is J&J Barber Shop (company ID and registered office as per the commercial register). Contact: 777 507 662, branches at Vršovická 7/27 and Černokostelecká 830/23, Prague 10.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>2. Data We Process</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        <strong className="text-[#B5AEA4]">Online booking</strong> (Reservio): name, email, phone, selected time and service. <strong className="text-[#B5AEA4]">Gift voucher orders</strong> (website form): name, surname, email, phone, service and branch selection. Technical data (IP, cookies) may be collected when visiting the site.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>3. Purpose and Legal Basis</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        We process data to handle bookings, voucher orders, and communication. Legal basis: contract performance and legitimate interest (website operation).
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>4. Retention</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        We retain booking and order data as long as necessary (typically up to 3 years from last contact). Accounting records per applicable law.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>5. Your Rights</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        You have the right to access, rectify, erase, restrict processing, data portability, and to object. You may lodge a complaint with the Office for Personal Data Protection (uoou.cz).
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>6. Cookies and Third Parties</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        The site uses technically necessary cookies. Bookings are handled via Reservio (reservio.com), voucher orders via Web3Forms – their privacy policies apply to data shared with these services.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>7. Contact</h3>
      <p className="text-[#8A8580]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Data protection enquiries: 777 507 662 or in person at our branches.
      </p>
    </>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl shadow-2xl">
            <div className="sticky top-0 z-10 bg-[#0D0D0D] border-b border-[#1F1F1F] px-6 lg:px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-[#C9A84C]" />
                <h2 className="text-[#C4BEB4]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem" }}>
                  {t("footer.privacy")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#6B6B6B] hover:text-[#C4BEB4] transition-colors duration-200 p-1 cursor-pointer"
                aria-label={lang === "cs" ? "Zavřít" : "Close"}
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 lg:px-8 py-6 max-h-[calc(85vh-80px)]">
              {content}
            </div>
      </div>
    </div>
  );
}
