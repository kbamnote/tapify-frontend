import { motion } from "framer-motion";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  light?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const lineGrow = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function SectionHeader({ label, title, description, light = false }: SectionHeaderProps) {
  return (
    <motion.div
      className="text-center max-w-[700px] mx-auto mb-12 md:mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
    >
      {label && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <span className={`font-label ${light ? "text-blue-200" : "text-[var(--accent)]"}`}>
            {label}
          </span>
        </div>
      )}
      <h2 className={`font-h2 ${light ? "text-white" : "text-[var(--text-primary)]"}`}>
        {title}
      </h2>
      <div className="flex items-center justify-center mt-4">
        <motion.div
          className="h-[3px] w-[60px] rounded-full bg-[var(--primary)] origin-left"
          variants={lineGrow}
        />
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] ml-1" />
      </div>
      {description && (
        <p className={`font-body mt-4 max-w-[560px] mx-auto ${light ? "text-blue-100" : "text-[var(--text-secondary)]"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
