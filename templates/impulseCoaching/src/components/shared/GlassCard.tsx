import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  delay?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  }),
};

export default function GlassCard({ children, className = "", hoverable = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card card-padding ${hoverable ? "glass-card-hover" : ""} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
