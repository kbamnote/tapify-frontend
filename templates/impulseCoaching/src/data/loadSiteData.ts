// ============================================
// Backend data loader for the Impulsse Coaching template.
//
// Reusable-template model: siteData.ts holds the Impulsse demo/default content,
// and at boot we fetch the institute's real data from Tapify's public vCard API
// and override the backend-connected fields:
//   - identity + contact (name, logo, phone, email, address, website, colors)
//   - social links
//   - gallery
//   - courses (from vCard services)
// Everything else (faculties, results, achievements, batches, FAQ, testimonials,
// study material, vision/mission) stays as static demo content.
//
// The overrides are applied by MUTATING the shared siteData object BEFORE App and
// its section modules are imported (see main.tsx), so section module-scope reads
// (e.g. ContactSection, SocialLinksSection) pick up the real values.
// ============================================

import { siteData } from "./siteData";

// Same public endpoint the rest of tapify-frontend uses. Override with
// window.__TAPIFY_API__ if the app is hosted elsewhere.
const API_BASE: string =
  (window as unknown as { __TAPIFY_API__?: string }).__TAPIFY_API__ ||
  "https://app.tapify.co.in/api/public/vcard.php";

/** Figure out which vCard/institute to load. */
function resolveAlias(): string {
  const w = window as unknown as { __TAPIFY_ALIAS__?: string };
  if (w.__TAPIFY_ALIAS__) return String(w.__TAPIFY_ALIAS__).trim();

  const q = new URLSearchParams(window.location.search).get("alias");
  if (q) return q.trim();

  // Wildcard subdomain: <slug>.tapify.co.in
  const host = window.location.hostname;
  const parts = host.split(".");
  if (parts.length > 2 && !["www", "app", "localhost"].includes(parts[0])) {
    return parts[0];
  }
  return "";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyRec = Record<string, any>;

/** Only overwrite a siteData string field when the incoming value is non-empty. */
function set(key: string, val: unknown): void {
  if (val !== undefined && val !== null && String(val).trim() !== "") {
    (siteData as AnyRec)[key] = String(val);
  }
}

/** Map a backend social platform slug to one of the template's social keys. */
const SOCIAL_KEY: Record<string, keyof typeof siteData.social> = {
  facebook: "facebook",
  "facebook-f": "facebook",
  instagram: "instagram",
  youtube: "youtube",
  linkedin: "linkedin",
  "linkedin-in": "linkedin",
  telegram: "telegram",
};

function readVcardColors(vcard: AnyRec): void {
  const primary = vcard.primary_color;
  const accent = vcard.secondary_color || vcard.accent_color;
  if (primary && String(primary).trim() !== "") siteData.primary_color = String(primary);
  if (accent && String(accent).trim() !== "") siteData.accent_color = String(accent);
}

/** Push the current siteData brand colors onto the CSS custom properties. */
function syncTheme(): void {
  const root = document.documentElement;
  const primary = siteData.primary_color;
  const accent = siteData.accent_color;
  if (primary && !primary.includes("{{")) {
    root.style.setProperty("--primary", primary);
    root.style.setProperty("--primary-dark", primary);
  }
  if (accent && !accent.includes("{{")) {
    root.style.setProperty("--accent", accent);
  }
}

function mapVcardToSiteData(vcard: AnyRec): void {
  // --- Identity ---
  set("institute_name", vcard.vcard_name || [vcard.first_name, vcard.last_name].filter(Boolean).join(" "));
  set("logo", vcard.profile_image_url || vcard.profile_image);
  set("favicon", vcard.favicon_image_url || vcard.favicon_image);
  set("tagline", vcard.occupation || vcard.company);
  set("about_description", vcard.description);
  set("hero_background_image", vcard.cover_image_url || vcard.cover_image);

  // --- Contact (top-level + contact_* mirror) ---
  set("phone", vcard.phone);
  set("email", vcard.email);
  set("address", vcard.location || vcard.address);
  set("website", vcard.website);
  set("contact_phone", vcard.phone);
  set("contact_email", vcard.email);
  set("contact_address", vcard.location || vcard.address);
  set("contact_website", vcard.website);
  if (vcard.location_url) set("fab_location_url", vcard.location_url);

  const wa = String(vcard.whatsapp || vcard.phone || "").replace(/\D/g, "");
  if (wa) {
    siteData.whatsapp = wa;
    siteData.contact_whatsapp = wa;
    siteData.fab_whatsapp_number = wa;
  }
  if (vcard.phone) siteData.fab_phone_number = String(vcard.phone);

  // --- Social links ---
  const links: AnyRec[] = Array.isArray(vcard.social_links) ? vcard.social_links : [];
  for (const l of links) {
    const key = SOCIAL_KEY[String(l.platform || "").toLowerCase()];
    if (key && l.url && String(l.url).trim() !== "") {
      siteData.social[key] = String(l.url);
    }
  }

  // --- Gallery ---
  const galleries: AnyRec[] = Array.isArray(vcard.galleries) ? vcard.galleries : [];
  const gImgs: { image: string; alt: string }[] = [];
  for (const g of galleries) {
    for (const im of g.images || []) {
      const url = im.public_url || im.image_url;
      if (url) gImgs.push({ image: String(url), alt: g.title || siteData.institute_name });
    }
  }
  if (gImgs.length) siteData.gallery = gImgs;

  // --- Courses (from vCard services) ---
  const services: AnyRec[] = Array.isArray(vcard.services) ? vcard.services : [];
  if (services.length) {
    siteData.courses = services.map((s) => ({
      image: String(s.image_url || s.image || ""), // empty -> section falls back to demo asset
      name: String(s.name || ""),
      description: String(s.description || ""),
      duration: String(s.duration || ""),
      fees: String(s.fees || s.price || ""),
      eligibility: String(s.eligibility || ""),
      cta_text: "Enquire Now",
      cta_link: String(s.service_url || "#contact"),
    }));
  }

  // --- Brand colors (applied by syncTheme in applyBackendData) ---
  readVcardColors(vcard);
}

/**
 * Fetch the institute's data and merge it into siteData. Resolves (never rejects)
 * so the app always renders — with real data if available, else the demo defaults.
 */
export async function applyBackendData(): Promise<void> {
  const alias = resolveAlias();

  if (alias) {
    try {
      const res = await fetch(`${API_BASE}?alias=${encodeURIComponent(alias)}`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const json = (await res.json()) as AnyRec;
        const vcard: AnyRec | undefined = json?.data?.vcard || json?.vcard;
        if (json?.success !== false && vcard) mapVcardToSiteData(vcard);
      }
    } catch {
      // Network/parse error -> keep demo defaults.
    }
  }

  // Always brand the page: Impulsse colors by default, or the institute's
  // colors when the backend provided them.
  syncTheme();
  if (siteData.seo_title && !siteData.seo_title.includes("{{")) {
    document.title = siteData.seo_title;
  }
}
