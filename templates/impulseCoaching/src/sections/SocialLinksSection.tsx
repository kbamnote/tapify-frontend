import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Linkedin, Send } from "lucide-react";
import { siteData } from "@/data/siteData";
import { type LucideIcon } from "lucide-react";

interface SocialItem {
  platform: string;
  icon: LucideIcon;
  url: string;
  color: string;
  bgHover: string;
}

const socialConfig: SocialItem[] = [
  {
    platform: "Facebook",
    icon: Facebook,
    url: siteData.social.facebook,
    color: "#1877F2",
    bgHover: "bg-[#1877F2]",
  },
  {
    platform: "Instagram",
    icon: Instagram,
    url: siteData.social.instagram,
    color: "#E4405F",
    bgHover: "bg-[#E4405F]",
  },
  {
    platform: "YouTube",
    icon: Youtube,
    url: siteData.social.youtube,
    color: "#FF0000",
    bgHover: "bg-[#FF0000]",
  },
  {
    platform: "LinkedIn",
    icon: Linkedin,
    url: siteData.social.linkedin,
    color: "#0A66C2",
    bgHover: "bg-[#0A66C2]",
  },
  {
    platform: "Telegram",
    icon: Send,
    url: siteData.social.telegram,
    color: "#26A5E4",
    bgHover: "bg-[#26A5E4]",
  },
];

export default function SocialLinksSection() {
  const visibleSocials = socialConfig.filter(
    (s) => s.url && s.url.trim() !== "" && !s.url.includes("{{")
  );

  if (visibleSocials.length === 0) return null;

  return (
    <section className="py-12 bg-section-alt">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-h3 text-[var(--text-primary)]">Follow Us</h3>
          <p className="font-body-sm text-[var(--text-secondary)] mt-1">
            Stay connected for updates and inspiration
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {visibleSocials.map((social, i) => (
            <motion.a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ "--hover-color": social.color } as React.CSSProperties}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: i * 0.08 } },
              }}
              whileHover={{ backgroundColor: social.color, borderColor: social.color }}
            >
              <social.icon
                size={22}
                className="text-[var(--text-secondary)] group-hover:text-white transition-colors"
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
