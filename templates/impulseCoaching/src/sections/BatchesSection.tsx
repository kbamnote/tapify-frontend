import { motion } from "framer-motion";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import GlassCard from "@/components/shared/GlassCard";
import { siteData } from "@/data/siteData";

export default function BatchesSection() {
  const batches = siteData.batches.map((b, i) => ({
    name: b.name || ["JEE Advanced Batch", "NEET Crash Course", "Foundation Batch"][i],
    start_date: b.start_date || ["Jan 15, 2025", "Feb 1, 2025", "Mar 1, 2025"][i],
    timing: b.timing || ["9:00 AM - 1:00 PM", "2:00 PM - 6:00 PM", "10:00 AM - 2:00 PM"][i],
    seats_left: b.seats_left || ["5", "12", "20"][i],
  }));

  return (
    <section id="batches" className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Upcoming"
          title={siteData.batches_section_title || "Upcoming Batches"}
          description="Enroll in our upcoming batches and start your journey to success. Limited seats available!"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {batches.map((batch, i) => {
            const seatsNum = parseInt(batch.seats_left) || 0;
            const isUrgent = seatsNum <= 5;

            return (
              <GlassCard key={i} hoverable delay={i * 0.1} className="relative overflow-hidden">
                {/* Urgent Badge */}
                {isUrgent && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold animate-pulse">
                    Filling Fast
                  </div>
                )}

                <h3 className="font-h3 text-[var(--text-primary)] mb-4 pr-20">{batch.name}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Calendar size={15} className="text-[var(--primary)]" />
                    </div>
                    <span className="font-body-sm">Starts: <strong className="text-[var(--text-primary)]">{batch.start_date}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Clock size={15} className="text-[var(--primary)]" />
                    </div>
                    <span className="font-body-sm">Timing: <strong className="text-[var(--text-primary)]">{batch.timing}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Users size={15} className="text-[var(--primary)]" />
                    </div>
                    <span className="font-body-sm">
                      Seats Left:{" "}
                      <strong className={isUrgent ? "text-red-500" : "text-[var(--text-primary)]"}>
                        {batch.seats_left}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isUrgent ? "bg-red-400" : "bg-[var(--primary)]"}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(10, 100 - seatsNum * 5)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 w-full justify-center py-3 rounded-xl bg-[var(--primary)] text-white font-button text-sm hover:bg-[var(--primary-dark)] transition-colors"
                >
                  Enroll Now
                  <ArrowRight size={16} />
                </a>
              </GlassCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
