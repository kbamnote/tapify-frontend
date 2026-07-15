import { useState, useRef, useEffect } from "react";

interface LazyIframeProps {
  src: string;
  title: string;
  className?: string;
  placeholder?: string;
}

export default function LazyIframe({ src, title, className = "", placeholder }: LazyIframeProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <iframe
          src={src}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : placeholder ? (
        <img src={placeholder} alt={title} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 animate-pulse" />
      )}
    </div>
  );
}
