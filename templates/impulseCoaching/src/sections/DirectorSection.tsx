import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { siteData } from "@/data/siteData";

export default function DirectorSection() {
  const d = siteData as unknown as {
    director_name?: string;
    director_designation?: string;
    director_photo?: string;
    director_message?: string;
    director_section_title?: string;
  };

  // Hide the section if no real director is configured.
  if (!d.director_name || d.director_name.includes("{{")) return null;

  const photo =
    d.director_photo && !d.director_photo.includes("{{") ? d.director_photo : "/assets/director-1.jpg";

  return (
    <section id="director" className="section-padding bg-white">
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader label="Leadership" title={d.director_section_title || "Director's Message"} description="" />

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-center">
          {/* Photo */}
          <motion.div
            className="mx-auto"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-[260px] mx-auto">
              <div className="w-[260px] h-[320px] rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-black/5">
                <img
                  src={photo}
                  alt={d.director_name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="font-h3 text-[var(--text-primary)]">{d.director_name}</h3>
                <p className="font-caption text-[var(--accent)] mt-0.5">{d.director_designation}</p>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Quote className="text-[var(--primary)] opacity-20 mb-3" size={44} />
            <p className="font-body text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {d.director_message}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-12 bg-[var(--accent)]" />
              <span className="font-h3 text-[var(--text-primary)] text-base">{d.director_name}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
