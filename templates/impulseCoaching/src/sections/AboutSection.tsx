import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import GlassCard from "@/components/shared/GlassCard";
import { siteData } from "@/data/siteData";

export default function AboutSection() {
  const aboutImg = siteData.about_image && !siteData.about_image.includes("{{")
    ? siteData.about_image
    : "/assets/about-img.jpg";

  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="About Us"
          title={siteData.about_title || "About Our Institute"}
          description={
            siteData.about_description ||
            "We are committed to providing world-class education that empowers students to achieve their academic dreams."
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="relative"
          >
            <div className="rounded-[20px] overflow-hidden shadow-xl">
              <img
                src={aboutImg}
                alt="About our institute"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--primary)]/10 rounded-[20px] -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--accent)]/10 rounded-[16px] -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <p className="font-body text-[var(--text-secondary)] mb-8">
              {siteData.about_description ||
                "At Knowledge Horizon, we believe every student has the potential to excel. Our dedicated team of educators combines years of experience with innovative teaching methods to create an environment where learning thrives. We focus on building strong conceptual foundations while developing critical thinking skills that serve students throughout their academic journey."}
            </p>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard hoverable delay={0}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                    <Eye size={20} className="text-[var(--primary)]" />
                  </div>
                  <h4 className="font-h3 text-[var(--text-primary)] text-base">
                    {siteData.vision_title || "Our Vision"}
                  </h4>
                </div>
                <p className="font-body-sm text-[var(--text-secondary)]">
                  {siteData.vision_description ||
                    "To be the most trusted education partner, empowering students to achieve excellence and become leaders of tomorrow."}
                </p>
              </GlassCard>

              <GlassCard hoverable delay={0.1}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-warm)]/10 flex items-center justify-center">
                    <Target size={20} className="text-[var(--accent-warm)]" />
                  </div>
                  <h4 className="font-h3 text-[var(--text-primary)] text-base">
                    {siteData.mission_title || "Our Mission"}
                  </h4>
                </div>
                <p className="font-body-sm text-[var(--text-secondary)]">
                  {siteData.mission_description ||
                    "To provide quality education through expert guidance, innovative methods, and personalized attention that brings out the best in every student."}
                </p>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
