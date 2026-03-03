import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Scissors, ScissorsLineDashed, Slice, Star, Baby, Gift, Clock, type LucideIcon } from "lucide-react";
import { VoucherModal } from "./VoucherModal";
import { useLanguage } from "../i18n";
import { BookButton } from "./BookButton";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  "svc.classic": Scissors,
  "svc.long": Scissors,
  "svc.beard": ScissorsLineDashed,
  "svc.shave": Slice,
  "svc.combo": Star,
  "svc.kids": Baby,
  "svc.voucher": Gift,
};

function ServiceIconBadge({ icon: Icon, popular }: { icon: LucideIcon; popular: boolean }) {
  return (
    <div
      className={`w-12 h-12 min-w-12 min-h-12 flex-shrink-0 rounded-xl flex items-center justify-center mb-6 transition-colors duration-200 ${
        popular
          ? "bg-[#C9A84C]/12 border border-[#C9A84C]/25"
          : "bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-white/10"
      }`}
    >
      <Icon
        size={20}
        className={
          popular
            ? "text-[#C9A84C]"
            : "text-[#8A8580] group-hover:text-[#B5AEA4] transition-colors duration-200"
        }
      />
    </div>
  );
}

interface Service {
  nameKey: string;
  descKey: string;
  price: string | null;
  hasDuration: boolean;
  popular: boolean;
}

const services: Service[] = [
  { nameKey: "svc.classic", descKey: "svc.classic", price: "490", hasDuration: true, popular: false },
  { nameKey: "svc.long", descKey: "svc.long", price: "690", hasDuration: true, popular: false },
  { nameKey: "svc.beard", descKey: "svc.beard", price: "390", hasDuration: true, popular: false },
  { nameKey: "svc.shave", descKey: "svc.shave", price: "390", hasDuration: true, popular: false },
  { nameKey: "svc.combo", descKey: "svc.combo", price: "790", hasDuration: true, popular: true },
  { nameKey: "svc.kids", descKey: "svc.kids", price: "450", hasDuration: true, popular: false },
  { nameKey: "svc.voucher", descKey: "svc.voucher", price: null, hasDuration: false, popular: false },
];

function ServiceCard({ service, index, onClick, t }: { service: Service; index: number; onClick?: () => void; t: (k: string) => string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const icon = SERVICE_ICON_MAP[service.nameKey] ?? Scissors;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      onClick={onClick}
      className={`relative group flex h-full flex-col rounded-xl border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${
        service.popular
          ? "border-[#C9A84C]/40 bg-[#111111] hover:border-[#C9A84C]/50"
          : "border-[#1F1F1F] bg-[#111111] hover:border-white/[0.08]"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {service.popular && (
        <div
          className="absolute -top-2.5 left-6 px-3 py-1.5 bg-[#1A1A1A] border border-[#C9A84C]/40 text-[#D4B85A] text-[0.65rem] tracking-[0.15em] uppercase shadow-[0_0_12px_rgba(201,168,76,0.15)]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
        >
          {t("svc.popular")}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col p-8">
        <ServiceIconBadge icon={icon} popular={service.popular} />

        <h3
          className="text-[#C4BEB4] mb-1"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.25rem" }}
        >
          {t(`${service.nameKey}.name`)}
        </h3>
        {service.hasDuration && (
          <span
            className="text-[#8A8580] flex items-center gap-1.5 mb-3"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "0.78rem" }}
          >
            <Clock size={12} className="text-[#8A8580] flex-shrink-0" />
            {t(`${service.nameKey}.duration`)}
          </span>
        )}
        {!service.hasDuration && <div className="mb-2" />}

        <p
          className="text-[#B5AEA4]/70 min-h-0 flex-1 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.8 }}
        >
          {t(`${service.descKey}.desc`)}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-[#1F1F1F] pt-6 mt-6">
          <div className="flex items-baseline">
            {service.price != null ? (
              <>
                <span
                  className="text-[#C9A84C]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "2rem", lineHeight: 1 }}
                >
                  {service.price}
                </span>
                <span
                  className="text-[#8A8580] ml-1"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
                >
                  {t("svc.currency")}
                </span>
              </>
            ) : (
              <span
                className={onClick ? "text-[#C9A84C]" : "text-[#8A8580]"}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: onClick ? 600 : 400, fontSize: "0.85rem", letterSpacing: onClick ? "0.05em" : undefined }}
              >
                {onClick ? t("svc.orderVoucher") : t("svc.onRequest")}
              </span>
            )}
          </div>
        </div>
      </div>

      {service.popular && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.15)" }} />
      )}
    </motion.div>
  );
}

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [voucherOpen, setVoucherOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <section id="services" className="py-8 md:py-12 lg:py-20 bg-[#0B0B0B] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-[#C4BEB4] mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.2 }}
          >
            {t("svc.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[#B5AEA4] mt-2 max-w-lg"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.8 }}
          >
            {t("svc.description")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 [&>div]:h-full">
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
          className="mt-10 text-center"
        >
          <BookButton
            href="#booking"
            label={t("svc.book")}
            variant="textLink"
            action="scroll"
            showIcon={false}
          />
        </motion.div>
      </div>

      <VoucherModal open={voucherOpen} onClose={() => setVoucherOpen(false)} />
    </section>
  );
}
