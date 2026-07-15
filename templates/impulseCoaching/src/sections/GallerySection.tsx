import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { siteData } from "@/data/siteData";

export default function GallerySection() {
  const images = siteData.gallery.map((g, i) => ({
    src: g.image && !g.image.includes("{{") ? g.image : `/assets/gallery-${i + 1}.jpg`,
    alt: g.alt || `Gallery image ${i + 1}`,
  }));

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Gallery"
          title="Campus Life"
          description="A glimpse into our vibrant learning environment and memorable moments."
        />

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                i === 0 || i === 3 ? "col-span-2 row-span-2" : ""
              }`}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.4, delay: i * 0.08 },
                },
              }}
            >
              <div className={`${i === 0 || i === 3 ? "aspect-square" : "aspect-[4/3]"} overflow-hidden`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
