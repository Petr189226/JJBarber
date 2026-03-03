import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { X, ZoomIn } from "lucide-react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBtYW4lMjBwb3J0cmFpdCUyMHN0eWxpc2glMjBoYWlyY3V0fGVufDF8fHx8MTc3MjUxOTAzN3ww&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Stylový střih - portét",
    label: "Klasický střih",
  },
  {
    src: "https://images.unsplash.com/photo-1629881544138-c45fc917eb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXJiZXJzaG9wJTIwaW50ZXJpb3IlMjBjaGFpcnMlMjB2aW50YWdlfGVufDF8fHx8MTc3MjUxOTAzOHww&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Luxusní interiér barbershopu",
    label: "Naše prostory",
  },
  {
    src: "https://images.unsplash.com/photo-1737966239656-1a72d12b20d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwaGFpcnN0eWxlJTIwZmFkZSUyMGN1dCUyMHVyYmFufGVufDF8fHx8MTc3MjUxOTAzOHww&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Fade střih",
    label: "Urban Fade",
  },
  {
    src: "https://images.unsplash.com/photo-1659223165847-f131ed27941c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBiZWFyZCUyMHRyaW0lMjBjbG9zZSUyMHVwJTIwZGFya3xlbnwxfHx8fDE3NzI1MTkwNDB8MA&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Úprava vousů detailně",
    label: "Beard Trim",
  },
  {
    src: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBncm9vbWluZyUyMHByb2R1Y3QlMjByYXpvciUyMGxlYXRoZXJ8ZW58MXx8fHwxNzcyNTE5MDQwfDA&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Prémiové produkty",
    label: "Premium produkty",
  },
  {
    src: "https://images.unsplash.com/photo-1635611578109-4b9ce9525b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBzaG9wJTIwd2luZG93JTIwbmVvbiUyMHNpZ24lMjBuaWdodHxlbnwxfHx8fDE3NzI1MTkwNDF8MA&ixlib=rb-4.1.0&q=80&w=800",
    alt: "Barber shop v noci",
    label: "Atmosféra",
  },
];

function GalleryItem({ item, index, onClick }: {
  item: typeof galleryImages[0];
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-sm cursor-pointer group"
      style={{ aspectRatio: index === 1 || index === 4 ? "3/4" : "1/1" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <motion.img
        src={item.src}
        alt={item.alt}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ filter: "contrast(1.05) saturate(0.85)" }}
      />
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/20 to-transparent flex flex-col justify-end p-5"
        animate={{ opacity: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between"
        >
          <span
            className="text-[#C4BEB4]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1rem" }}
          >
            {item.label}
          </span>
          <div className="w-8 h-8 rounded-sm border border-[#C9A84C]/50 flex items-center justify-center">
            <ZoomIn size={14} className="text-[#C9A84C]" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [lightbox, setLightbox] = useState<typeof galleryImages[0] | null>(null);

  return (
    <section id="gallery" className="py-28 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="mb-14">
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
              Galerie
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#C4BEB4]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.15 }}
          >
            Naše práce mluví za vše
          </motion.h2>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[240px] md:auto-rows-[280px]">
          {galleryImages.map((item, i) => (
            <div
              key={item.alt}
              className={i === 1 || i === 4 ? "row-span-2" : ""}
            >
              <GalleryItem
                item={item}
                index={i}
                onClick={() => setLightbox(item)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src.replace("w=800", "w=1400")}
                alt={lightbox.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-sm"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-[#C9A84C] hover:bg-[#D4B85A] rounded-sm flex items-center justify-center text-[#0A0A0A] transition-colors"
              >
                <X size={18} />
              </button>
              <div
                className="absolute bottom-4 left-4 text-[#C4BEB4] bg-[#0A0A0A]/80 px-4 py-2 rounded-sm"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "0.95rem" }}
              >
                {lightbox.label}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
