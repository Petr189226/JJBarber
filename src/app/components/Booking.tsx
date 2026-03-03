import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Phone, ExternalLink, Gift } from "lucide-react";
import { VoucherModal } from "./VoucherModal";

const RESERVIO_URL = "https://j-j-barbershop.reservio.com/";
const RESERVIO_VRSOVICE = "https://j-j-barbershop.reservio.com/j-j-barber-shop";
const RESERVIO_STRASNICE = "https://j-j-barbershop.reservio.com/j-j-barber-shop-strasnice";

export function Booking() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [voucherOpen, setVoucherOpen] = useState(false);

  return (
    <section id="booking" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column – contact info */}
          <div ref={ref}>
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
                Rezervace
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[#E8DCC8] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.15 }}
            >
              Rezervuj si
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A84C" }}>termín</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#6B6B6B] mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
            >
              Rezervace probíhá online přes Reservio. Vyber si pobočku, službu a volný termín. Potvrzení přijde na e-mail nebo SMS.
            </motion.p>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0 mt-1.5" />
                <div>
                  <span className="text-[#6B6B6B]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>Vršovice: </span>
                  <span className="text-[#A89880]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}>Vršovická 7/27, 101 00 Praha 10</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0 mt-1.5" />
                <div>
                  <span className="text-[#6B6B6B]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>Strašnice: </span>
                  <span className="text-[#A89880]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}>Černokostelecká 830/23, 100 00 Praha 10</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0" />
                <div className="flex gap-2 flex-wrap items-center">
                  <Phone size={14} className="text-[#C9A84C]" />
                  <a href="tel:+420777507662" className="text-[#A89880] hover:text-[#C9A84C] transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}>
                    777 507 662
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Dárkový poukaz */}
            <motion.button
              onClick={() => setVoucherOpen(true)}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#D4B85A] transition-colors cursor-pointer"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.1em" }}
            >
              <Gift size={18} />
              Dárkový poukaz
            </motion.button>
            <VoucherModal open={voucherOpen} onClose={() => setVoucherOpen(false)} />

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 pl-6 border-l-2 border-[#C9A84C]/40"
            >
              <p
                className="text-[#4A4A4A] italic"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "1.05rem", lineHeight: 1.7 }}
              >
                "Tvůj barber shop na Praze 10."
              </p>
              <span
                className="text-[#C9A84C] mt-2 block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.15em" }}
              >
                — J&amp;J BARBER SHOP
              </span>
            </motion.div>
          </div>

          {/* Right column – Reservio CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <a
              href={RESERVIO_VRSOVICE}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#111111] border border-[#1F1F1F] hover:border-[#C9A84C]/40 rounded-sm p-8 transition-all duration-300 group"
            >
              <h3
                className="text-[#E8DCC8] mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.35rem" }}
              >
                JJ Barber shop – Vršovice
              </h3>
              <p className="text-[#6B6B6B] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                Vršovická 7/27, 101 00 Praha 10
              </p>
              <span
                className="inline-flex items-center gap-2 text-[#C9A84C] group-hover:gap-3 transition-all"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                Vytvořit rezervaci
                <ExternalLink size={16} />
              </span>
            </a>
            <a
              href={RESERVIO_STRASNICE}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#111111] border border-[#1F1F1F] hover:border-[#C9A84C]/40 rounded-sm p-8 transition-all duration-300 group"
            >
              <h3
                className="text-[#E8DCC8] mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.35rem" }}
              >
                JJ Barber shop – Strašnice
              </h3>
              <p className="text-[#6B6B6B] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                Černokostelecká 830/23, 100 00 Praha 10
              </p>
              <span
                className="inline-flex items-center gap-2 text-[#C9A84C] group-hover:gap-3 transition-all"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                Vytvořit rezervaci
                <ExternalLink size={16} />
              </span>
            </a>
            <a
              href={RESERVIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 py-4 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] active:scale-[0.98]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              Otevřít Reservio
              <ExternalLink size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
