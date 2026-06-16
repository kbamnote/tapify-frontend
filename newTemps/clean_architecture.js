// Produce a static clean.html preview for imagesArchitecture (hosted asset URLs, no scripts).
// Reuses the SAME deterministic base64->arc-NNN mapping as build_architecture.js. Does NOT touch the PHP template.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const BASE = 'C:/Users/Printworld/Downloads/Tapify/Tapify/TAPIFY-FRESH-UPLOAD/TAPIFY-FRESH-UPLOAD';
const FOLDER = 'imagesArchitecture', SLUG = 'architecture';
const SRC_DIR = `${BASE}/frontend/newTemps/${FOLDER}`;
const ASSET_URL = `/images/templates/${SLUG}`;
const OUT = `${SRC_DIR}/clean.html`;

let htmls = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html') && !f.toLowerCase().includes('clean'));
let h = fs.readFileSync(path.join(SRC_DIR, htmls[0]), 'utf8');
h = h.replace(/<!--\s*Page saved with SingleFile[\s\S]*?-->/g, '');
h = h.replace(/<meta[^>]*Content-Security-Policy[^>]*>/gi, '');
const EXT = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/gif': 'gif', 'image/svg+xml': 'svg' };
const seen = {}; let idx = 0;
function url(mime, data) {
  if (mime === 'image/svg+xml' && !/^[A-Za-z0-9+/=]+$/.test(data.slice(0, 40))) return null;
  let raw; try { raw = Buffer.from(data, 'base64'); } catch (e) { return null; }
  if (!raw || raw.length === 0) return null;
  const m = crypto.createHash('md5').update(raw).digest('hex');
  if (seen[m]) return seen[m];
  const ext = EXT[mime] || 'bin';
  seen[m] = `${ASSET_URL}/${SLUG.slice(0, 3)}-${String(idx).padStart(3, '0')}.${ext}`; idx++;
  return seen[m];
}
h = h.replace(/data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)/g, (full, mime, data) => url(mime, data) || full);
h = h.replace(/@font-face\s*\{[^}]*\}/g, '');
h = h.replace(/data:(?:font|application)\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
h = h.replace(/<script[\s\S]*?<\/script>/gi, '');
fs.writeFileSync(OUT, h);
console.log('WROTE clean.html', Math.floor(h.length / 1024), 'KB | mapped images:', idx, '| base64 left:', (h.match(/base64,[A-Za-z0-9+/=]{80,}/g) || []).length);
