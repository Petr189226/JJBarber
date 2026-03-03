import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Scissors, Star, Zap, Droplets, Package, Gift } from "lucide-react";
import { VoucherModal } from "./VoucherModal";
import { useLanguage } from "../i18n";

interface Service {
  icon: typeof Scissors;
  nameKey: string;
  descKey: string;
  price: string | null;
  popular: boolean;
}

const services: Service[] = [
  { icon: Scissors, nameKey: "svc.classic", descKey: "svc.classic", price: "490", popular: false },
  { icon: Scissors, nameKey: "svc.long", descKey: "svc.long", price: "690", popular: false },
  { icon: Droplets, nameKey: "svc.beard", descKey: "svc.beard", price: "390", popular: false },
  { icon: Zap, nameKey: "svc.shave", descKey: "svc.shave", price: "390", popular: false },
  { icon: Star, nameKey: "svc.combo", descKey: "svc.combo", price: "790", popular: true },
  { icon: Package, nameKey: "svc.kids", descKey: "svc.kids", price: "450", popular: false },
  { icon: Gift, nameKey: "svc.voucher", descKey: "svc.voucher", price: null, popular: false },
];

function ServiceCard({ service, index, onClick, t }: { service: Service; index: number; onClick?: () => void; t: (k: string) => string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      onClick={onClick}
      className={`relative group rounded-sm border transition-all duration-400 hover:-translate-y-1 ${
        service.popular
          ? "border-[#C9A84C]/60 bg-gradient-to-b from-[#1A1610] to-[#111111]"
          : "border-[#1F1F1F] bg-[#111111] hover:border-[#C9A84C]/30"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {service.popular && (
        <div
          className="absolute -top-3 left-6 px-3 py-1 bg-[#C9A84C] text-[#0A0A0A] text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.65rem" }}
        >
          {t("svc.popular")}
        </div>
      )}

      <div className="p-8">
        <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-6 transition-colors duration-300 ${
          service.popular
            ? "bg-[#C9A84C]/15 border border-[#C9A84C]/30"
            : "bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#C9A84C]/20"
        }`}>
          <Icon size={20} className={service.popular ? "text-[#C9A84C]" : "text-[#7A7A7A] group-hover:text-[#C9A84C] transition-colors duration-300"} />
        </div>

        <h3
          className="text-[#E8DCC8] mb-3"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.25rem" }}
        >
          {t(`${service.nameKey}.name`)}
        </h3>

        <p
          className="text-[#6B6B6B] mb-6 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.7 }}
        >
          {t(`${service.descKey}.desc`)}
        </p>

        <div className="flex items-end justify-between pt-5 border-t border-[#1F1F1F]">
          <div>
            {service.price != null ? (
              <>
                <span
                  className="text-[#C9A84C]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}
                >
                  {service.price}
                </span>
                <span
                  className="text-[#6B6B6B] ml-1"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
                >
                  {t("svc.currency")}
                </span>
              </>
            ) : (
              <span
                className={onClick ? "text-[#C9A84C]" : "text-[#6B6B6B]"}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: onClick ? 600 : 400, fontSize: "0.85rem", letterSpacing: onClick ? "0.05em" : undefined }}
              >
                {onClick ? t("svc.orderVoucher") : t("svc.onRequest")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.15)" }} />
    </motion.div>
  );
}

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [voucherOpen, setVoucherOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <section id="services" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
            >
              {t("svc.label")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#E8DCC8]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.15 }}
          >
            {t("svc.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#6B6B6B] mt-4 max-w-lg"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.7 }}
          >
            {t("svc.description")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <ServiceCard
              key={service.nameKey}
              service={service}
              index={i}
              t={t}
              onClick={service.nameKey === "svc.voucher" ? () => setVoucherOpen(true) : undefined}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <a
            href="https://j-j-barbershop.reservio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] active:scale-95"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            {t("svc.book")}
          </a>
        </motion.div>
      </div>

      <VoucherModal open={voucherOpen} onClose={() => setVoucherOpen(false)} />
    </section>
  );
}
