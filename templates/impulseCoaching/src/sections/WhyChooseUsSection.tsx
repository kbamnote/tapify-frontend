import { motion } from "framer-motion";
import { Users, BookOpen, Monitor, CalendarCheck, UserCheck, HelpCircle, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import GlassCard from "@/components/shared/GlassCard";
import { siteData } from "@/data/siteData";

const iconMap: Record<string, LucideIcon> = {
  Users, BookOpen, Monitor, CalendarCheck, UserCheck, HelpCircle,
  "users": Users, "book-open": BookOpen, "monitor": Monitor,
  "calendar-check": CalendarCheck, "user-check": UserCheck,
  "help-circle": HelpCircle,
};

const defaultItems = [
  { icon: "Users", title: "Experienced Faculty", description: "Learn from highly qualified educators with decades of combined teaching experience." },
  { icon: "BookOpen", title: "Small Batch Size", description: "Personalized attention with limited students per batch for better learning outcomes." },
  { icon: "Monitor", title: "Smart Classrooms", description: "Modern teaching aids and digital infrastructure for interactive learning." },
  { icon: "CalendarCheck", title: "Weekly Tests", description: "Regular assessments to track progress and identify areas for improvement." },
  { icon: "UserCheck", title: "Personal Mentorship", description: "One-on-one guidance to help each student reach their full potential." },
  { icon: "HelpCircle", title: "Doubt Solving", description: "Dedicated doubt-clearing sessions to ensure no question goes unanswered." },
];

export default function WhyChooseUsSection() {
  const items = siteData.why_choose_us.map((item, i) => ({
    icon: item.icon || defaultItems[i]?.icon || "Users",
    title: item.title || defaultItems[i]?.title || "",
    description: item.description || defaultItems[i]?.description || "",
  }));

  return (
    <section id="why-us" className="section-padding bg-section-alt">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Why Choose Us"
          title="What Makes Us Different"
          description="We combine expert teaching, modern facilities, and personalized care to deliver outstanding results."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {items.map((item, i) => {
            const IconComponent = iconMap[item.icon] || Users;
            return (
              <GlassCard key={i} hoverable delay={i * 0.1}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center mb-4 shadow-lg">
                  <IconComponent size={26} className="text-white" />
                </div>
                <h3 className="font-h3 text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="font-body-sm text-[var(--text-secondary)]">{item.description}</p>
              </GlassCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
