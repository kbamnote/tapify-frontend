import { Facebook, Instagram, Youtube, Linkedin, Send, GraduationCap, Phone, Mail, MapPin } from "lucide-react";
import { siteData } from "@/data/siteData";

const socialIcons = [
  { platform: "facebook", icon: Facebook, url: siteData.social.facebook },
  { platform: "instagram", icon: Instagram, url: siteData.social.instagram },
  { platform: "youtube", icon: Youtube, url: siteData.social.youtube },
  { platform: "linkedin", icon: Linkedin, url: siteData.social.linkedin },
  { platform: "telegram", icon: Send, url: siteData.social.telegram },
];

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Courses", href: "#courses" },
  { label: "Faculties", href: "#faculties" },
  { label: "Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
  { label: "FAQ", href: "#faq" },
];

export default function Footer() {
  const visibleSocials = socialIcons.filter((s) => s.url && s.url.trim() !== "" && !s.url.includes("{{"));

  return (
    <footer className="bg-[var(--text-primary)] text-white pt-16 pb-24 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Institute Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-h3 text-white text-lg leading-tight">
                  {siteData.institute_name || "Knowledge Horizon"}
                </h3>
              </div>
            </div>
            <p className="font-body-sm text-gray-400 mb-6">
              {siteData.footer_description || siteData.tagline || "Shaping futures through quality education since 2005."}
            </p>
            {/* Social Icons */}
            {visibleSocials.length > 0 && (
              <div className="flex gap-3">
                {visibleSocials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[var(--primary)] hover:text-white transition-all"
                    aria-label={s.platform}
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-h3 text-white text-base mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-h3 text-white text-base mb-5">Our Courses</h4>
            <ul className="space-y-3">
              {siteData.courses.map((course, i) => (
                <li key={i}>
                  <a
                    href="#courses"
                    className="font-body-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {course.name || `Course ${i + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-h3 text-white text-base mb-5">Contact Us</h4>
            <ul className="space-y-4">
              {siteData.contact_phone && !siteData.contact_phone.includes("{{") && (
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <span className="font-body-sm text-gray-400">{siteData.contact_phone}</span>
                </li>
              )}
              {siteData.contact_email && !siteData.contact_email.includes("{{") && (
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <span className="font-body-sm text-gray-400">{siteData.contact_email}</span>
                </li>
              )}
              {siteData.contact_address && !siteData.contact_address.includes("{{") && (
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <span className="font-body-sm text-gray-400">{siteData.contact_address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-caption text-gray-500 text-center md:text-left">
            {siteData.footer_copyright || `© ${new Date().getFullYear()} Knowledge Horizon. All rights reserved.`}
          </p>
          <p className="font-caption text-gray-600">
            Designed with care for education
          </p>
        </div>
      </div>
    </footer>
  );
}
