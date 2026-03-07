import { X, FileText } from "lucide-react";
import { useLanguage } from "../i18n";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TermsModal({ open, onClose }: Props) {
  const { t, lang } = useLanguage();

  const content = lang === "cs" ? (
    <>
      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>1. Provozovatel</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Provozovatelem webu a prodejcem služeb je J&J Barber Shop, IČO 19452381, sídlo Vršovická 7/27, 101 00 Praha 10. Kontakt: 777 507 662.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>2. Objednávka dárkových poukazů</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Objednávka voucheru prostřednictvím webového formuláře představuje nezávaznou poptávku. Kupní smlouva vzniká až po potvrzení objednávky provozovatelem a zaplacení na pobočce při vyzvednutí. Voucher je platný 12 měsíců od data vydání.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>3. Rezervace služeb</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Rezervace probíhá přes systém Reservio (reservio.com). Platí obchodní podmínky Reservia. Provozovatel si vyhrazuje právo zrušit rezervaci z provozních důvodů.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>4. Reklamace</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Reklamace služeb uplatňujte osobně na pobočce nebo na tel. 777 507 662. Lhůta pro vyřízení reklamace je 30 dnů. U služeb (střih, holení) nelze uplatnit právo na odstoupení od smlouvy dle § 1837 občanského zákoníku.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>5. Závěrečná ustanovení</h3>
      <p className="text-[#8A8580]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Tyto obchodní podmínky jsou platné od 1. 1. 2025. Provozovatel si vyhrazuje právo je změnit. Aktuální znění je vždy dostupné na webu.
      </p>
    </>
  ) : (
    <>
      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>1. Operator</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        The website operator and service provider is J&J Barber Shop, Company ID 19452381, registered office Vršovická 7/27, 101 00 Prague 10. Contact: 777 507 662.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>2. Gift Voucher Orders</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Placing an order via the web form constitutes a non-binding request. The purchase contract is formed only when the order is confirmed by the operator and payment is made at the branch upon pickup. Vouchers are valid for 12 months from the date of issue.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>3. Service Bookings</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Bookings are handled via Reservio (reservio.com). Reservio's terms and conditions apply. The operator reserves the right to cancel bookings for operational reasons.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>4. Complaints</h3>
      <p className="text-[#8A8580] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        Lodge complaints in person at a branch or by phone at 777 507 662. The complaint resolution period is 30 days. For services (haircut, shave), the right to withdraw from the contract under consumer law does not apply.
      </p>

      <h3 className="text-[#C4BEB4] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>5. Final Provisions</h3>
      <p className="text-[#8A8580]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        These terms are effective from 1 January 2025. The operator reserves the right to amend them. The current version is always available on the website.
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
            <FileText size={20} className="text-[#C9A84C]" />
            <h2 className="text-[#C4BEB4]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem" }}>
              {t("footer.terms")}
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
