import { useState, useRef, useEffect } from "react";
import CountUp from "react-countup";

interface CountUpItemProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

export default function CountUpItem({ value, suffix = "", label, delay = 0 }: CountUpItemProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-h1 text-[var(--primary)]">
        {hasAnimated ? (
          <CountUp end={value} duration={2.5} suffix={suffix} delay={delay} />
        ) : (
          <span>0{suffix}</span>
        )}
      </div>
      <p className="font-body-sm text-[var(--text-secondary)] mt-2">{label}</p>
    </div>
  );
}
