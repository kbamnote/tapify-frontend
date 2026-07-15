import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import StarRating from "@/components/shared/StarRating";
import { siteData } from "@/data/siteData";

export default function TestimonialsSection() {
  const testimonials = siteData.testimonials.map((t, i) => ({
    photo: t.photo && !t.photo.includes("{{") ? t.photo : `/assets/result-${(i % 2) + 1}.jpg`,
    name: t.name || ["Sneha Gupta", "Amit Sharma", "Priya Reddy"][i],
    review: t.review || [
      "The faculty here is exceptional. They not only cleared my doubts but also boosted my confidence. I secured a top rank in JEE, all thanks to Knowledge Horizon.",
      "Personalized attention and regular tests helped me identify my weak areas. The mentorship program was a game-changer for my preparation.",
      "Best coaching institute! The study material is comprehensive and the faculty is always available for doubt solving. Highly recommended!",
    ][i],
    rating: parseInt(t.rating) || 5,
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section id="testimonials" className="section-padding bg-section-alt">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Testimonials"
          title={siteData.testimonials_section_title || "What Our Students Say"}
          description="Hear from our students about their transformative learning experience."
        />

        {/* Slider Container */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[380px] snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="glass-card card-padding h-full flex flex-col">
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                  <Quote size={18} className="text-[var(--primary)]" />
                </div>

                {/* Review */}
                <p className="font-body-sm text-[var(--text-secondary)] flex-1 mb-5 italic">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={t.rating} />
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-h3 text-[var(--text-primary)] text-sm">{t.name}</h4>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                containerRef.current?.scrollTo({
                  left: i * 400,
                  behavior: "smooth",
                });
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === activeIndex ? "bg-[var(--primary)] w-8" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
