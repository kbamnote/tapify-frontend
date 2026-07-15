import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import LazyIframe from "@/components/shared/LazyIframe";
import { siteData } from "@/data/siteData";

export default function VideoSection() {
  // Only real YouTube videos render; if the institute has none, hide the section.
  const videos = siteData.videos
    .filter((v) => v.youtube_id && !v.youtube_id.includes("{{"))
    .map((v) => ({
      youtube_id: v.youtube_id,
      title: v.title || "Video",
      description: v.description || "Watch to learn more about our institute.",
    }));

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="section-padding bg-section-alt">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Videos"
          title={siteData.video_section_title || "Watch & Learn"}
          description="Explore our campus and hear success stories from our students."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {videos.map((video, i) => (
            <motion.div
              key={i}
              className="rounded-[20px] overflow-hidden bg-white shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.15 } },
              }}
            >
              {/* Video Embed */}
              <div className="relative aspect-video bg-gray-900">
                <LazyIframe
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  title={video.title}
                  className="w-full h-full"
                />
                {/* Play overlay fallback */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play size={28} className="text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-h3 text-[var(--text-primary)] text-base">{video.title}</h3>
                <p className="font-body-sm text-[var(--text-secondary)] mt-1">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
