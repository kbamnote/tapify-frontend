import { motion } from "framer-motion";
import { Clock, Wallet, CheckCircle, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import GlassCard from "@/components/shared/GlassCard";
import { siteData } from "@/data/siteData";

export default function CoursesSection() {
  const courses = siteData.courses.map((course, i) => ({
    image: course.image && !course.image.includes("{{") ? course.image : `/assets/course-${i + 1}.jpg`,
    name: course.name || ["Engineering Entrance", "Medical Entrance", "Foundation Course"][i],
    description: course.description || "Comprehensive coaching program designed for excellence.",
    duration: course.duration || "12 Months",
    fees: course.fees || "Contact Us",
    eligibility: course.eligibility || "Class 11-12",
    cta_text: course.cta_text || "Learn More",
    cta_link: course.cta_link || "#contact",
  }));

  return (
    <section id="courses" className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Our Courses"
          title="Courses We Offer"
          description="Comprehensive coaching programs designed to help you crack competitive exams with confidence."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {courses.map((course, i) => (
            <GlassCard key={i} hoverable delay={i * 0.1} className="overflow-hidden !p-0">
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-h3 text-[var(--text-primary)] mb-2">{course.name}</h3>
                <p className="font-body-sm text-[var(--text-secondary)] mb-4">{course.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] bg-blue-50 px-3 py-1.5 rounded-full">
                    <Clock size={13} />
                    {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <Wallet size={13} />
                    {course.fees}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                    <CheckCircle size={13} />
                    {course.eligibility}
                  </span>
                </div>

                {/* CTA */}
                <a
                  href={course.cta_link}
                  className="inline-flex items-center gap-2 font-button text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
                >
                  {course.cta_text}
                  <ArrowRight size={16} />
                </a>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
