import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { siteData } from "@/data/siteData";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = siteData.faqs.map((f, i) => ({
    question: f.question || [
      "What courses do you offer?",
      "How can I enroll in a batch?",
      "Do you provide study materials?",
      "What is the batch size?",
      "Do you offer online classes?",
    ][i],
    answer: f.answer || [
      "We offer comprehensive coaching for JEE (Main & Advanced), NEET, and Foundation courses for classes 8-10. Each course is designed by expert faculty to ensure complete syllabus coverage.",
      "You can enroll by visiting our center, calling us, or filling out the enquiry form on our website. Our team will guide you through the admission process.",
      "Yes, we provide comprehensive study materials including textbooks, practice papers, and previous year question banks. All materials are prepared by our expert faculty.",
      "We maintain small batch sizes of 20-25 students to ensure personalized attention and effective learning for every student.",
      "Yes, we offer both offline and online classes. Our online platform provides live interactive sessions with recordings available for revision.",
    ][i],
  }));

  return (
    <section id="faq" className="section-padding bg-section-alt">
      <div className="max-w-[800px] mx-auto">
        <SectionHeader
          label="FAQ"
          title={siteData.faq_section_title || "Frequently Asked Questions"}
          description="Got questions? We have answers. Find everything you need to know about our institute."
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="glass-card !p-0 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={openIndex === i}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle size={16} className="text-[var(--primary)]" />
                  </div>
                  <span className="font-h3 text-[var(--text-primary)] text-base">{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-[var(--text-secondary)]" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <div className="pl-11 border-t border-gray-100 pt-4">
                        <p className="font-body-sm text-[var(--text-secondary)]">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
