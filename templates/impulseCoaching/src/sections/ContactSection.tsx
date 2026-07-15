import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin, Globe, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import GlassCard from "@/components/shared/GlassCard";
import LazyIframe from "@/components/shared/LazyIframe";
import { siteData } from "@/data/siteData";

const contactItems = [
  {
    icon: Phone,
    label: "Phone",
    value: siteData.contact_phone,
    href: siteData.contact_phone ? `tel:${siteData.contact_phone}` : "",
    color: "bg-blue-50 text-[var(--primary)]",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteData.contact_whatsapp,
    href: siteData.contact_whatsapp ? `https://wa.me/${siteData.contact_whatsapp}` : "",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Mail,
    label: "Email",
    value: siteData.contact_email,
    href: siteData.contact_email ? `mailto:${siteData.contact_email}` : "",
    color: "bg-red-50 text-red-500",
  },
  {
    icon: Globe,
    label: "Website",
    value: siteData.contact_website,
    href: siteData.contact_website || "",
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: MapPin,
    label: "Address",
    value: siteData.contact_address,
    href: "",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function ContactSection() {
  const visibleContacts = contactItems.filter(
    (c) => c.value && !c.value.includes("{{")
  );

  const mapsUrl = siteData.google_maps_embed_url && !siteData.google_maps_embed_url.includes("{{")
    ? siteData.google_maps_embed_url
    : "";

  const mapsImage = siteData.google_maps_static_image && !siteData.google_maps_static_image.includes("{{")
    ? siteData.google_maps_static_image
    : "";

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="Get In Touch"
          title={siteData.contact_section_title || "Contact Us"}
          description="Have questions? We'd love to hear from you. Reach out through any of the channels below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {visibleContacts.map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } },
                }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="glass-card card-padding flex items-start gap-4 hover:-translate-y-1 transition-transform"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-caption text-[var(--text-muted)] mb-0.5">{item.label}</p>
                      <p className="font-body-sm text-[var(--text-primary)] font-medium truncate">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="glass-card card-padding flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-caption text-[var(--text-muted)] mb-0.5">{item.label}</p>
                      <p className="font-body-sm text-[var(--text-primary)] font-medium">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Admission CTA */}
            <motion.div
              className="sm:col-span-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.5 } },
              }}
            >
              <GlassCard className="!bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] !border-transparent text-center">
                <h4 className="font-h3 text-white mb-2">
                  {siteData.contact_form_title || "Admission Enquiry"}
                </h4>
                <p className="font-body-sm text-blue-100 mb-4">
                  Ready to start your journey? Get in touch with us for admissions.
                </p>
                <a
                  href={siteData.whatsapp ? `https://wa.me/${siteData.whatsapp}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-button px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Enquire on WhatsApp
                  <ArrowRight size={16} />
                </a>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-[20px] overflow-hidden shadow-xl h-full min-h-[400px]">
              {mapsUrl ? (
                <LazyIframe
                  src={mapsUrl}
                  title="Location Map"
                  className="w-full h-full min-h-[400px]"
                  placeholder={mapsImage || undefined}
                />
              ) : mapsImage ? (
                <img
                  src={mapsImage}
                  alt="Location"
                  className="w-full h-full object-cover min-h-[400px]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="text-[var(--primary)]/30 mx-auto mb-3" />
                    <p className="font-body-sm text-[var(--text-muted)]">
                      {siteData.contact_address || "Add your Google Maps embed URL"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
