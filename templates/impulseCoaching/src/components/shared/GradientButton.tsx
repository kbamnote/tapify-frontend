import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface GradientButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  className?: string;
  download?: boolean;
  pulse?: boolean;
}

export default function GradientButton({
  children,
  variant = "primary",
  icon: Icon,
  href,
  onClick,
  className = "",
  download = false,
  pulse = false,
}: GradientButtonProps) {
  const baseClasses =
    "font-button inline-flex items-center justify-center gap-2 rounded-[14px] transition-all duration-250 ease-out cursor-pointer whitespace-nowrap";

  const variantClasses = {
    primary: `gradient-primary text-white px-8 py-3.5 hover:gradient-primary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] ${pulse ? "pulse-glow" : ""}`,
    secondary:
      "bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-3.5 hover:bg-[var(--primary)] hover:text-white",
    ghost:
      "bg-white/10 border border-white/30 text-white backdrop-blur-[10px] px-8 py-3.5 hover:bg-white/20",
  };

  const allClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={allClasses} download={download} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
        {Icon && <Icon size={16} />}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={allClasses}>
      {children}
      {Icon && <Icon size={16} />}
    </button>
  );
}
