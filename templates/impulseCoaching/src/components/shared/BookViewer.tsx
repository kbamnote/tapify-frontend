import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
import GradientButton from "./GradientButton";

interface BookViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfTitle: string;
  pdfAuthor: string;
  pdfPages: string;
  pdfSize: string;
  pdfCover: string;
  readOnlineText: string;
  downloadText: string;
  pages?: string[];
}

export default function BookViewer({
  isOpen,
  onClose,
  pdfUrl,
  pdfTitle,
  pdfAuthor,
  pdfPages,
  pdfSize,
  pdfCover,
  readOnlineText,
  downloadText,
  pages,
}: BookViewerProps) {
  const [viewerMode, setViewerMode] = useState<"cover" | "reading">("cover");
  const [currentPage, setCurrentPage] = useState(0);

  const pageImages = pages && pages.length ? pages : null;
  const totalPages = pageImages ? pageImages.length : parseInt(pdfPages) || 100;

  const openBook = () => setViewerMode("reading");

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

  const handleClose = () => {
    setViewerMode("cover");
    setCurrentPage(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>

            {viewerMode === "cover" ? (
              /* Cover View - 3D Book Display */
              <div className="flex flex-col lg:flex-row items-center gap-10 p-8">
                {/* 3D Book */}
                <motion.div
                  className="perspective-[1200px] flex-shrink-0"
                  style={{ perspective: "1200px" }}
                  initial={{ rotateY: -30 }}
                  animate={{ rotateY: -15 }}
                  transition={{ type: "spring", stiffness: 60 }}
                >
                  <motion.div
                    className="relative"
                    style={{ transformStyle: "preserve-3d" }}
                    whileHover={{ rotateY: -35 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Book Cover */}
                    <div
                      className="relative w-[240px] h-[340px] md:w-[280px] md:h-[400px] rounded-r-lg overflow-hidden"
                      style={{
                        transformOrigin: "left center",
                        boxShadow: "var(--shadow-book)",
                      }}
                    >
                      <img
                        src={pdfCover || "/assets/book-cover.jpg"}
                        alt={pdfTitle}
                        className="w-full h-full object-cover"
                      />
                      {/* Page edge effect */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-gray-300/50 to-transparent"
                      />
                    </div>
                    {/* Page stack */}
                    <div
                      className="absolute top-1 right-[-6px] w-[240px] h-[340px] md:w-[280px] md:h-[400px] bg-white rounded-r-lg border border-gray-200"
                      style={{ transform: "translateZ(-4px)" }}
                    />
                    <div
                      className="absolute top-2 right-[-12px] w-[240px] h-[340px] md:w-[280px] md:h-[400px] bg-white rounded-r-lg border border-gray-200"
                      style={{ transform: "translateZ(-8px)" }}
                    />
                    <div
                      className="absolute top-3 right-[-18px] w-[240px] h-[340px] md:w-[280px] md:h-[400px] bg-white rounded-r-lg border border-gray-200"
                      style={{ transform: "translateZ(-12px)" }}
                    />
                  </motion.div>
                </motion.div>

                {/* Book Info */}
                <div className="text-center lg:text-left text-white">
                  <h3 className="font-h1 text-white mb-2">{pdfTitle || "Complete Study Guide"}</h3>
                  <p className="font-body text-blue-200 mb-1">
                    by {pdfAuthor || "Knowledge Horizon"}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
                    <span className="font-caption text-blue-300 bg-white/10 px-3 py-1 rounded-full">
                      {pdfPages || "250"} Pages
                    </span>
                    <span className="font-caption text-blue-300 bg-white/10 px-3 py-1 rounded-full">
                      {pdfSize || "15 MB"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <GradientButton variant="primary" onClick={openBook} icon={ExternalLink} pulse>
                      {readOnlineText || "Read Online"}
                    </GradientButton>
                    <GradientButton
                      variant="ghost"
                      href={pdfUrl}
                      download
                      icon={Download}
                    >
                      {downloadText || "Download"}
                    </GradientButton>
                  </div>
                </div>
              </div>
            ) : (
              /* Reading View - PDF Viewer with Page Flip */
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--primary)] text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewerMode("cover")}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="font-h3 text-white text-base">{pdfTitle}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-caption text-blue-200">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <a
                      href={pdfUrl}
                      download
                      className="text-white/80 hover:text-white transition-colors"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>

                {/* PDF Content */}
                <div className="relative bg-gray-100" style={{ minHeight: "60vh" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      className="w-full"
                      style={{ perspective: "1200px" }}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    >
                      {pageImages ? (
                        <div className="flex items-center justify-center" style={{ minHeight: "70vh" }}>
                          <img
                            src={pageImages[currentPage]}
                            alt={`${pdfTitle} — Page ${currentPage + 1}`}
                            className="max-w-full max-h-[70vh] w-auto h-auto object-contain shadow-lg"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <iframe
                          src={`${pdfUrl}#page=${currentPage + 1}`}
                          title={`${pdfTitle} - Page ${currentPage + 1}`}
                          className="w-full border-0"
                          style={{ height: "70vh" }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Overlay */}
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[var(--primary)] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[var(--primary)] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Bottom Progress */}
                <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center gap-4">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--primary)] rounded-full"
                      animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
