import { motion } from "framer-motion";
import { Phone, MessageCircle, Share2, MapPin, GraduationCap } from "lucide-react";
import { siteData } from "@/data/siteData";

const buttons = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    color: "#25D366",
    href: siteData.fab_whatsapp_number ? `https://wa.me/${siteData.fab_whatsapp_number}` : "",
    label: "WhatsApp",
  },
  {
    id: "call",
    icon: Phone,
    color: "var(--primary)",
    href: siteData.fab_phone_number ? `tel:${siteData.fab_phone_number}` : "",
    label: "Call",
  },
  {
    id: "location",
    icon: MapPin,
    color: "#EA4335",
    href: siteData.fab_location_url || "",
    label: "Location",
  },
  {
    id: "share",
    icon: Share2,
    color: "#7C3AED",
    href: "",
    label: "Share",
    action: async () => {
      const shareData = {
        title: siteData.fab_share_title || document.title,
        text: siteData.fab_share_text || "",
        url: window.location.href,
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch {}
      } else {
        try { await navigator.clipboard.writeText(window.location.href); } catch {}
      }
    },
  },
  {
    id: "admission",
    icon: GraduationCap,
    color: "var(--accent-warm)",
    href: siteData.fab_admission_link || "#contact",
    label: "Admission",
  },
];

export default function FloatingActionBar() {
  const visibleButtons = buttons.filter((b) => {
    if (b.id === "share") return true;
    return b.href || b.action;
  });

  return (
    <>
      {/* Mobile - Bottom Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-2"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
      >
        <div className="flex items-center justify-around">
          {visibleButtons.slice(0, 5).map((btn) => (
            <a
              key={btn.id}
              href={btn.href || undefined}
              onClick={(e) => {
                if (btn.action) {
                  e.preventDefault();
                  btn.action();
                }
              }}
              className="flex flex-col items-center gap-1 py-1 px-2"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: btn.color }}
              >
                <btn.icon size={18} />
              </div>
              <span className="font-caption text-[10px] text-[var(--text-secondary)]">{btn.label}</span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Desktop - Right Side Stack */}
      <motion.div
        className="hidden md:flex fixed right-6 bottom-1/2 translate-y-1/2 z-[100] flex-col gap-3"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
      >
        {visibleButtons.map((btn) => (
          <a
            key={btn.id}
            href={btn.href || undefined}
            onClick={(e) => {
              if (btn.action) {
                e.preventDefault();
                btn.action();
              }
            }}
            className="group relative"
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
              style={{ backgroundColor: btn.color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <btn.icon size={22} />
            </motion.div>
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[var(--text-primary)] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {btn.label}
            </span>
          </a>
        ))}
      </motion.div>
    </>
  );
}
