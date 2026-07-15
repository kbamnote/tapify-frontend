import { motion } from "framer-motion";
import { Phone, MessageCircle, Download, ArrowRight, GraduationCap } from "lucide-react";
import { siteData } from "@/data/siteData";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function HeroSection() {
  const hasHeroBg = siteData.hero_background_image && !siteData.hero_background_image.includes("{{");
  const hasStudentImg = siteData.hero_student_image && !siteData.hero_student_image.includes("{{");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed md:bg-fixed"
        style={{
          backgroundImage: hasHeroBg
            ? `url(${siteData.hero_background_image})`
            : "url(/assets/hero-bg.jpg)",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,23,42,0.5)] via-[rgba(15,23,42,0.7)] to-[rgba(15,23,42,0.85)]" />

      {/* Floating Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-sky-400/10 blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-amber-400/10 blur-2xl"
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Admission Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-button text-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {siteData.admission_open_badge || "Admissions Open 2025-26"}
          </span>
        </motion.div>

        {/* Institute Name */}
        <motion.div variants={itemVariants} className="mb-4 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg">
            <GraduationCap size={28} className="text-white" />
          </div>
          <span className="font-h2 text-white text-2xl md:text-3xl">
            {siteData.institute_name || "Knowledge Horizon"}
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 variants={itemVariants} className="font-display text-white mb-4 max-w-4xl mx-auto">
          {siteData.hero_title || "Where Bright Futures Begin"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="font-body text-blue-100/90 mb-10 max-w-2xl mx-auto">
          {siteData.hero_subtitle ||
            "Premier coaching institute dedicated to nurturing academic excellence. Expert faculty, proven results, and personalized guidance for every student."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-10">
          <a
            href={siteData.hero_cta_primary_link || "#contact"}
            className="gradient-primary pulse-glow text-white font-button px-8 py-4 rounded-[14px] inline-flex items-center gap-2 hover:gradient-primary-hover hover:-translate-y-0.5 transition-all"
          >
            {siteData.hero_cta_primary_text || "Enquire Now"}
            <ArrowRight size={18} />
          </a>
          <a
            href={siteData.hero_brochure_url || "#materials"}
            className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-button px-8 py-4 rounded-[14px] inline-flex items-center gap-2 hover:bg-white/20 transition-all"
          >
            {siteData.hero_cta_secondary_text || "Download Brochure"}
            <Download size={18} />
          </a>
        </motion.div>

        {/* Quick Action Row */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
          <a
            href={siteData.whatsapp ? `https://wa.me/${siteData.whatsapp}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 text-green-300 font-button text-sm hover:bg-[#25D366]/30 transition-colors"
          >
            <MessageCircle size={16} />
            {siteData.hero_whatsapp_text || "WhatsApp"}
          </a>
          <a
            href={siteData.phone ? `tel:${siteData.phone}` : "#"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-button text-sm hover:bg-blue-500/30 transition-colors"
          >
            <Phone size={16} />
            {siteData.hero_call_text || "Call Now"}
          </a>
        </motion.div>

        {/* Student Image (optional) */}
        {hasStudentImg && (
          <motion.div
            variants={itemVariants}
            className="mt-12 flex justify-center"
          >
            <img
              src={siteData.hero_student_image}
              alt="Student"
              className="w-48 h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
              loading="lazy"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
