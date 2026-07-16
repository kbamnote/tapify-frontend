import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "@/components/shared/MobileNav";
import FloatingActionBar from "@/components/shared/FloatingActionBar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import DirectorSection from "@/sections/DirectorSection";
import WhyChooseUsSection from "@/sections/WhyChooseUsSection";
import CoursesSection from "@/sections/CoursesSection";
import FacultiesSection from "@/sections/FacultiesSection";
import AchievementsSection from "@/sections/AchievementsSection";
import ResultsSection from "@/sections/ResultsSection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import GallerySection from "@/sections/GallerySection";
import VideoSection from "@/sections/VideoSection";
import BatchesSection from "@/sections/BatchesSection";
import StudyMaterialsSection from "@/sections/StudyMaterialsSection";
import FAQSection from "@/sections/FAQSection";
import ContactSection from "@/sections/ContactSection";
import SocialLinksSection from "@/sections/SocialLinksSection";

function PageLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center mx-auto mb-4 shadow-lg">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </motion.div>
        </div>
        <p className="font-h3 text-[var(--text-primary)] text-lg">Loading...</p>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Navigation */}
          <MobileNav />

          {/* Main Content */}
          <main>
            <HeroSection />
            <AboutSection />
            <DirectorSection />
            <WhyChooseUsSection />
            <CoursesSection />
            <FacultiesSection />
            <AchievementsSection />
            <ResultsSection />
            <TestimonialsSection />
            <GallerySection />
            <VideoSection />
            <BatchesSection />
            <StudyMaterialsSection />
            <FAQSection />
            <ContactSection />
            <SocialLinksSection />
          </main>

          {/* Footer */}
          <Footer />

          {/* Floating Action Buttons */}
          <FloatingActionBar />
        </motion.div>
      )}
    </>
  );
}

export default App;
