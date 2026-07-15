import { motion } from "framer-motion";
import { Users, Trophy, Calendar, Building2 } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CountUpItem from "@/components/shared/CountUpItem";
import { siteData } from "@/data/siteData";
import { type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users, Trophy, Calendar, Building2,
};

const defaultAchievements = [
  { label: "Students Trained", value: 5000, suffix: "+", icon: "Users" },
  { label: "Top Rankers", value: 500, suffix: "+", icon: "Trophy" },
  { label: "Years of Excellence", value: 15, suffix: "+", icon: "Calendar" },
  { label: "Branches", value: 8, suffix: "", icon: "Building2" },
];

export default function AchievementsSection() {
  const achievements = siteData.achievements.map((a, i) => ({
    label: a.label || defaultAchievements[i]?.label || "",
    value: parseInt(a.value) || defaultAchievements[i]?.value || 0,
    suffix: a.suffix || defaultAchievements[i]?.suffix || "",
    icon: defaultAchievements[i]?.icon || "Users",
  }));

  return (
    <section id="achievements" className="section-padding bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/5"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <SectionHeader
          label="Our Achievements"
          title="Numbers That Speak"
          description="Our track record of success reflects our commitment to educational excellence."
          light
        />

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {achievements.map((item, i) => {
            const Icon = iconMap[item.icon] || Users;
            return (
              <motion.div
                key={i}
                className="glass-card bg-white/10 backdrop-blur-lg border-white/20 text-center py-8 px-4"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
                  },
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-white" />
                </div>
                <CountUpItem
                  value={item.value}
                  suffix={item.suffix}
                  label={item.label}
                  delay={i * 0.2}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
