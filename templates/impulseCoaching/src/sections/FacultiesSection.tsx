import { motion } from "framer-motion";
import { Award, BookOpen } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import GlassCard from "@/components/shared/GlassCard";
import { siteData } from "@/data/siteData";

export default function FacultiesSection() {
  const faculties = siteData.faculties.map((f, i) => ({
    photo: f.photo && !f.photo.includes("{{") ? f.photo : `/assets/faculty-${i + 1}.jpg`,
    name: f.name || ["Dr. Rajesh Kumar", "Prof. Priya Sharma", "Prof. Anand Mehta"][i],
    qualification: f.qualification || ["Ph.D. in Physics", "M.Sc. in Chemistry", "Ph.D. in Mathematics"][i],
    experience: f.experience || `${15 - i * 3}+ Years`,
    subject: f.subject || ["Physics", "Chemistry", "Mathematics"][i],
    bio: f.bio || "Experienced educator passionate about making complex concepts simple and accessible.",
  }));

  return (
    <section id="faculties" className="section-padding bg-section-alt">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Our Team"
          title="Expert Faculty Members"
          description="Learn from the best minds in education who are dedicated to your success."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {faculties.map((faculty, i) => (
            <GlassCard key={i} hoverable delay={i * 0.1} className="text-center">
              {/* Photo */}
              <div className="relative mx-auto mb-4 w-28 h-28">
                <img
                  src={faculty.photo}
                  alt={faculty.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  loading="lazy"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <Award size={14} className="text-white" />
                </div>
              </div>

              {/* Info */}
              <h3 className="font-h3 text-[var(--text-primary)]">{faculty.name}</h3>
              <p className="font-caption text-[var(--accent)] mt-1">{faculty.qualification}</p>

              <div className="flex flex-wrap gap-2 justify-center mt-3 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full">
                  <BookOpen size={12} />
                  {faculty.subject}
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)] bg-gray-100 px-3 py-1 rounded-full">
                  {faculty.experience} Experience
                </span>
              </div>

              <p className="font-body-sm text-[var(--text-secondary)]">{faculty.bio}</p>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
