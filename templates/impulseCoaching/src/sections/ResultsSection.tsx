import { motion } from "framer-motion";
import { Award } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import GlassCard from "@/components/shared/GlassCard";
import { siteData } from "@/data/siteData";

export default function ResultsSection() {
  const results = siteData.results.map((r, i) => ({
    photo: r.photo && !r.photo.includes("{{") ? r.photo : `/assets/result-${i + 1}.jpg`,
    name: r.name || ["Rahul Verma", "Ananya Patel"][i],
    course: r.course || ["JEE Advanced", "NEET"][i],
    score: r.score || ["AIR 247", "Score 685"][i],
    achievement: r.achievement || ["IIT Bombay", "AIIMS Delhi"][i],
  }));

  return (
    <section id="results" className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Success Stories"
          title="Our Star Achievers"
          description="Proud moments of our students who achieved their dreams through dedication and our guidance."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {results.map((result, i) => (
            <GlassCard key={i} hoverable delay={i * 0.1} className="text-center overflow-hidden !p-0">
              {/* Photo */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={result.photo}
                  alt={result.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Achievement Badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-semibold">
                  <Award size={13} />
                  {result.achievement}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-h3 text-[var(--text-primary)] text-base">{result.name}</h3>
                <p className="font-caption text-[var(--accent)] mt-1">{result.course}</p>
                <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-sm">
                  {result.score}
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
