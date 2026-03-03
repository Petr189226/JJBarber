import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, Send, Loader2 } from "lucide-react";
import { useLanguage } from "../i18n";

const WEB3FORMS_KEY = "023e0516-f33d-4063-b6dc-afba879de144";

const BRANCHES = ["Vršovice", "Strašnice"];

const inputClass =
  "w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 text-[#C4BEB4] rounded-xl px-4 py-3 outline-none transition-all duration-200 placeholder:text-[#3A3A3A]";
const selectClass =
  "w-full appearance-none bg-[#111111] border border-[#2A2A2A] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 text-[#C4BEB4] rounded-xl px-4 py-3 outline-none transition-all duration-200 cursor-pointer";
const labelClass = "block text-[#6B6B6B] mb-1.5";
const labelStyle = { fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 } as const;
const inputStyle = { fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" } as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function VoucherModal({ open, onClose }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    service: "",
    branch: "",
    note: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const services = [
    `${t("svc.classic.name")} – 490 Kč`,
    `${t("svc.long.name")} – 690 Kč`,
    `${t("svc.beard.name")} – 390 Kč`,
    `${t("svc.combo.name")} – 790 Kč`,
    `${t("svc.kids.name")} – 450 Kč`,
  ];

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const canSubmit = form.name && form.email && form.service && form.branch && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Dárkový poukaz – ${form.service}`,
          from_name: `${form.name} ${form.surname}`.trim(),
          name: `${form.name} ${form.surname}`.trim(),
          email: form.email,
          phone: form.phone || "–",
          service: form.service,
          branch: form.branch,
          note: form.note || "–",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(t("voucher.errorSend"));
      }
    } catch {
      setError(t("voucher.errorConn"));
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", surname: "", email: "", phone: "", service: "", branch: "", note: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl shadow-2xl"
          >
            <div className="sticky top-0 z-10 bg-[#0D0D0D] border-b border-[#1F1F1F] px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift size={20} className="text-[#C9A84C]" />
                <h3 className="text-[#C4BEB4]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem" }}>
                  {t("voucher.title")}
                </h3>
              </div>
              <button onClick={handleClose} className="text-[#6B6B6B] hover:text-[#C4BEB4] transition-colors p-1" aria-label={t("voucher.close")}>
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6">
              {sent ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#C9A84C]/8 flex items-center justify-center">
                    <Gift size={28} className="text-[#C9A84C]" />
                  </div>
                  <h4 className="text-[#C4BEB4] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem" }}>
                    {t("voucher.thanks")}
                  </h4>
                  <p className="text-[#6B6B6B] max-w-xs mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    {t("voucher.success")}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-8 px-8 py-3 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-xl transition-all duration-200"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
                  >
                    {t("voucher.close")}
                  </button>
                </motion.div>
              ) : (
                <>
                  <p className="text-[#6B6B6B] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", lineHeight: 1.7 }}>
                    {t("voucher.intro")}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={labelStyle}>{t("voucher.name")} *</label>
                        <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jan" className={inputClass} style={inputStyle} />
                      </div>
                      <div>
                        <label className={labelClass} style={labelStyle}>{t("voucher.surname")}</label>
                        <input type="text" value={form.surname} onChange={(e) => update("surname", e.target.value)} placeholder="Novák" className={inputClass} style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass} style={labelStyle}>{t("voucher.email")} *</label>
                      <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jan@email.cz" className={inputClass} style={inputStyle} />
                    </div>

                    <div>
                      <label className={labelClass} style={labelStyle}>{t("voucher.phone")}</label>
                      <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+420 777 123 456" className={inputClass} style={inputStyle} />
                    </div>

                    <div>
                      <label className={labelClass} style={labelStyle}>{t("voucher.service")} *</label>
                      <select required value={form.service} onChange={(e) => update("service", e.target.value)} className={selectClass} style={inputStyle}>
                        <option value="" disabled>{t("voucher.servicePlaceholder")}</option>
                        {services.map((s) => (
                          <option key={s} value={s} style={{ background: "#111111", color: "#C4BEB4" }}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass} style={labelStyle}>{t("voucher.branch")} *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {BRANCHES.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => update("branch", b)}
                            className={`py-3 rounded-xl border transition-all duration-200 ${
                              form.branch === b
                                ? "border-[#C9A84C] bg-[#C9A84C]/8 text-[#C9A84C]"
                                : "border-[#2A2A2A] bg-[#111111] text-[#6B6B6B] hover:border-[#3A3A3A]"
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 500 }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass} style={labelStyle}>{t("voucher.note")}</label>
                      <textarea
                        value={form.note}
                        onChange={(e) => update("note", e.target.value)}
                        placeholder={t("voucher.notePlaceholder")}
                        rows={3}
                        className={`${inputClass} resize-none`}
                        style={inputStyle}
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" }}>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-[#C9A84C]"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
                    >
                      {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      {sending ? t("voucher.sending") : t("voucher.submit")}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
