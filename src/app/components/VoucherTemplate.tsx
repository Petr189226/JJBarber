import { formatServiceForVoucher } from "../utils/formatService";

export interface VoucherData {
  firstName: string;
  lastName: string;
  service: string;
  branch: string;
  voucherNumber: string;
}

interface VoucherTemplateProps {
  data: VoucherData;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

const ScissorsDecor = () => (
  <svg width="32" height="16" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="#C9A96E" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="22" r="7" stroke="#C9A96E" strokeWidth="1.5" fill="none" />
    <line x1="16" y1="7" x2="54" y2="16" stroke="#C9A96E" strokeWidth="1.5" />
    <line x1="16" y1="25" x2="54" y2="16" stroke="#C9A96E" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.5" fill="#C9A96E" />
    <circle cx="10" cy="22" r="2.5" fill="#C9A96E" />
  </svg>
);

const DiamondOrnament = () => (
  <svg width="120" height="14" viewBox="0 0 240 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="14" x2="100" y2="14" stroke="#C9A96E" strokeWidth="0.8" />
    <rect x="108" y="7" width="14" height="14" transform="rotate(45 115 14)" fill="#C9A96E" opacity="0.6" />
    <rect x="116" y="9" width="10" height="10" transform="rotate(45 121 14)" fill="none" stroke="#C9A96E" strokeWidth="0.8" />
    <line x1="140" y1="14" x2="240" y2="14" stroke="#C9A96E" strokeWidth="0.8" />
  </svg>
);

export function VoucherTemplate({ data, printRef }: VoucherTemplateProps) {
  const isEmpty = !data.firstName && !data.lastName && !data.service && !data.branch;
  const serviceDisplay = formatServiceForVoucher(data.service || "");

  return (
    <div
      ref={printRef}
      id="voucher-print"
      style={{
        width: "740px",
        height: "520px",
        fontFamily: "'Inter', 'Lato', sans-serif",
        backgroundColor: "#FDFAF5",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#1C1712",
          height: "148px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          padding: "0 48px",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "5px", backgroundColor: "#C9A96E" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "5px", backgroundColor: "#C9A96E" }} />
        <img
          src="/logo-480.webp"
          alt="J&J Barber Shop"
          style={{ height: "100px", objectFit: "contain", filter: "brightness(1)" }}
        />
      </div>

      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #1C1712 0%, #C9A96E 20%, #E8D5B0 50%, #C9A96E 80%, #1C1712 100%)",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          flex: 1,
          backgroundColor: "#FDFAF5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 56px 16px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "12px", left: "20px", width: "30px", height: "30px", borderTop: "1.5px solid #C9A96E", borderLeft: "1.5px solid #C9A96E", opacity: 0.7 }} />
        <div style={{ position: "absolute", top: "12px", right: "20px", width: "30px", height: "30px", borderTop: "1.5px solid #C9A96E", borderRight: "1.5px solid #C9A96E", opacity: 0.7 }} />
        <div style={{ position: "absolute", bottom: "32px", left: "20px", width: "30px", height: "30px", borderBottom: "1.5px solid #C9A96E", borderLeft: "1.5px solid #C9A96E", opacity: 0.7 }} />
        <div style={{ position: "absolute", bottom: "32px", right: "20px", width: "30px", height: "30px", borderBottom: "1.5px solid #C9A96E", borderRight: "1.5px solid #C9A96E", opacity: 0.7 }} />

        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", letterSpacing: "6px", color: "#C9A96E", textTransform: "uppercase", marginBottom: "4px" }}>
            ✦ &nbsp; Dárkový poukaz &nbsp; ✦
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", letterSpacing: "4px", color: "#1C1712", fontWeight: 600, textTransform: "uppercase", lineHeight: 1 }}>
            Dárkový Voucher
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <DiamondOrnament />
        </div>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#8B7355", textTransform: "uppercase", marginBottom: "4px" }}>
            Určeno pro
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", color: "#1C1712", fontWeight: 500, fontStyle: "italic", letterSpacing: "1px", minHeight: "38px" }}>
            {isEmpty ? (
              <span style={{ color: "#C9A96E", opacity: 0.5 }}>Jméno Příjmení</span>
            ) : (
              `${data.firstName} ${data.lastName}`.trim() || <span style={{ color: "#C9A96E", opacity: 0.5 }}>—</span>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            width: "100%",
            maxWidth: "580px",
            borderTop: "1px solid #E4D5B8",
            borderBottom: "1px solid #E4D5B8",
            padding: "12px 0",
            marginBottom: "12px",
          }}
        >
          <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid #E4D5B8", paddingRight: "24px" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "3px", color: "#8B7355", textTransform: "uppercase", marginBottom: "5px" }}>
              Služba
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#1C1712", fontWeight: 600, lineHeight: 1.4, minHeight: "20px" }}>
              {isEmpty ? (
                <span style={{ color: "#C9A96E", opacity: 0.4, fontSize: "13px", fontStyle: "italic" }}>Název služby</span>
              ) : (
                serviceDisplay || <span style={{ color: "#C9A96E", opacity: 0.4, fontSize: "13px", fontStyle: "italic" }}>—</span>
              )}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "center", paddingLeft: "24px" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "3px", color: "#8B7355", textTransform: "uppercase", marginBottom: "5px" }}>
              Pobočka
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: "#1C1712", fontWeight: 600, lineHeight: 1.3, minHeight: "20px" }}>
              {isEmpty ? (
                <span style={{ color: "#C9A96E", opacity: 0.4, fontSize: "13px", fontStyle: "italic" }}>Název pobočky</span>
              ) : (
                data.branch || <span style={{ color: "#C9A96E", opacity: 0.4, fontSize: "13px", fontStyle: "italic" }}>—</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "4px" }}>
          <ScissorsDecor />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#1C1712",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px 0 28px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "5px", backgroundColor: "#C9A96E" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "5px", backgroundColor: "#C9A96E" }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "2px", color: "#8B7355", textTransform: "uppercase" }}>
          Voucher nelze vyplatit v hotovosti · Jednorázové použití
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "2px", color: "#8B7355", textTransform: "uppercase" }}>
            č.
          </span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", letterSpacing: "3px", color: "#C9A96E", fontWeight: 600 }}>
            {data.voucherNumber || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
