import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, ExternalLink, FileText } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import BookViewer from "@/components/shared/BookViewer";
import { siteData } from "@/data/siteData";

export default function StudyMaterialsSection() {
  const [viewerOpen, setViewerOpen] = useState(false);

  const pdfCover = siteData.pdf_cover && !siteData.pdf_cover.includes("{{")
    ? siteData.pdf_cover
    : "/assets/book-cover.jpg";

  const pdfTitle = siteData.pdf_title || "Complete Study Guide 2025";
  const pdfAuthor = siteData.pdf_author || "Knowledge Horizon Faculty";
  const pdfPages = siteData.pdf_pages || "250";
  const pdfSize = siteData.pdf_size || "15 MB";
  const pdfUrl = siteData.pdf_url || "#";

  return (
    <section id="materials" className="section-padding bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#2563EB] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-sky-400/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <SectionHeader
          label="Study Materials"
          title="Your Complete Study Guide"
          description="Access our comprehensive study material designed by expert faculty to help you excel in competitive exams."
          light
        />

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* 3D Book Display */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ perspective: "1200px" }}>
              <motion.div
                style={{ transformStyle: "preserve-3d" }}
                initial={{ rotateY: -25 }}
                whileInView={{ rotateY: -12 }}
                viewport={{ once: true }}
                whileHover={{ rotateY: -30 }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="cursor-pointer"
                onClick={() => setViewerOpen(true)}
              >
                {/* Book Cover */}
                <div
                  className="relative w-[220px] h-[320px] md:w-[260px] md:h-[380px] rounded-r-xl overflow-hidden"
                  style={{
                    transformOrigin: "left center",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <img
                    src={pdfCover}
                    alt={pdfTitle}
                    className="w-full h-full object-cover"
                  />
                  {/* Page edge glow */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-white/30 to-transparent" />
                </div>

                {/* Stacked Pages Effect */}
                {[4, 8, 12].map((z, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 right-0 w-[220px] h-[320px] md:w-[260px] md:h-[380px] bg-white rounded-r-xl border border-gray-200/50"
                    style={{
                      transform: `translateZ(-${z}px) translateX(${idx * 3}px)`,
                      opacity: 0.9 - idx * 0.15,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Book Info & Actions */}
          <motion.div
            className="text-center lg:text-left max-w-lg"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 font-caption mb-4">
              <FileText size={14} />
              Premium Study Material
            </div>

            <h3 className="font-h1 text-white mb-2">{pdfTitle}</h3>
            <p className="font-body text-blue-200 mb-1">
              by {pdfAuthor}
            </p>
            <p className="font-body-sm text-blue-300/80 mb-6">
              {siteData.pdf_description ||
                "A comprehensive guide covering all topics with solved examples, practice questions, and previous year papers. Perfect for competitive exam preparation."}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <BookOpen size={16} className="text-blue-300" />
                <span className="font-body-sm text-white">{pdfPages} Pages</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <FileText size={16} className="text-blue-300" />
                <span className="font-body-sm text-white">{pdfSize}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={() => setViewerOpen(true)}
                className="gradient-primary text-white font-button px-8 py-4 rounded-[14px] inline-flex items-center gap-2 pulse-glow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen size={18} />
                {siteData.pdf_open_book_text || "Open Book"}
              </motion.button>
              <a
                href={pdfUrl}
                download
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-button px-8 py-4 rounded-[14px] inline-flex items-center gap-2 hover:bg-white/20 transition-all"
              >
                <Download size={18} />
                {siteData.pdf_download_text || "Download"}
              </a>
              <button
                onClick={() => setViewerOpen(true)}
                className="bg-transparent border border-white/30 text-white font-button px-8 py-4 rounded-[14px] inline-flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <ExternalLink size={18} />
                {siteData.pdf_read_online_text || "Read Online"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Book Viewer Modal */}
      <BookViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        pdfUrl={pdfUrl}
        pdfTitle={pdfTitle}
        pdfAuthor={pdfAuthor}
        pdfPages={pdfPages}
        pdfSize={pdfSize}
        pdfCover={pdfCover}
        readOnlineText={siteData.pdf_read_online_text || "Read Online"}
        downloadText={siteData.pdf_download_text || "Download"}
      />
    </section>
  );
}
